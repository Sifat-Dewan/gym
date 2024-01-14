"use server";

import { currentUser } from "@/lib/current-user";

import db from "@/lib/db";
import { getEndingDate, isModerator } from "@/lib/utils";
import { differenceInDays } from "date-fns";

export async function renewMember({
  membershipPlanId,
  memberId,
}: {
  membershipPlanId: string;
  memberId: string;
}) {
  const user = await currentUser();

  if (!membershipPlanId || !memberId) {
    return {
      error: "Membership plan ID or member ID or End Date or Cost is missing",
    };
  }

  if (!user) {
    return { error: "Unauthenticated" };
  }

  if (!isModerator(user)) {
    return {
      error:
        "Permission Denied: Only administrators or moderators are authorized to perform this operation.",
    };
  }

  const membershipPlan = await db.membershipPlan.findUnique({
    where: {
      id: membershipPlanId,
    },
  });

  if (!membershipPlan) {
    return { error: "Membership plan not found" };
  }

  const member = await db.member.findUnique({
    where: {
      id: memberId,
    },
  });

  if (!member) {
    return { error: "Member not found" };
  }

  const isInvalidMember = () => {
    const difference = differenceInDays(member.endDate, new Date());
    return difference < -30;
  };

  const startDate = isInvalidMember() ? new Date() : member.endDate;

  const endDate = getEndingDate({
    startDate,
    durationInMonth: membershipPlan.durationInMonth,
  });

  await db.member.update({
    where: {
      id: memberId,
    },
    data: {
      endDate,
      renews: {
        create: {
          membershipPlanId,
          cost: membershipPlan.price,
        },
      },
    },
  });

  return { success: "Member renewed!" };
}
