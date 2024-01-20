"use server";

import { currentUser } from "@/lib/current-user";
import db from "@/lib/db";
import { isModerator } from "@/lib/utils";
import { MembershipPlanSchema } from "@/schemas";
import * as z from "zod";

export async function getMembershipPlans() {
  const plans = await db.membershipPlan.findMany({
    include: {
      benefits: true,
      members: true,
    },
    orderBy: {
      price: "asc",
    },
  });
  return plans;
}

export async function createMembershipPlan(
  values: z.infer<typeof MembershipPlanSchema>
) {
  try {
    const validatedFields = MembershipPlanSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const membershipPlan = await db.membershipPlan.findFirst({
      where: {
        OR: [
          {
            name: values.name.toUpperCase(),
          },
          {
            price: values.price,
          },
          {
            durationInMonth: values.durationInMonth,
          },
        ],
      },
    });
  
    if (membershipPlan) {
      return {
        error: "Same Name or Price or duration already exists",
      };
    }
  
    const user = await currentUser();
  
    if (!user || user.role !== "ADMIN") {
      return { error: "Permission denied" };
    }
  
    await db.membershipPlan.create({
      data: {
        ...values,
        name: values.name,
        benefits: {
          connect: values.benefitIds.map((benefitId) => ({ id: benefitId })),
        },
      },
    });
  
    return { success: "Membership Plan Created!" };
  } catch (error) {
    return {error: "Something went wrong"}
  }
}

export async function updateMembershipPlan({
  values,
  membershipPlanId,
}: {
  values: z.infer<typeof MembershipPlanSchema>;
  membershipPlanId: string;
}) {
  const validatedFields = MembershipPlanSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await currentUser();

  if (!user) {
    return { error: "Unauthenticated" };
  }

  if (!membershipPlanId) {
    return { error: "Membership plan Id is required" };
  }

  if (!isModerator(user)) {
    return { error: "Only admin or moderator have this permission" };
  }

  const plan = await db.membershipPlan.findUnique({
    where: {
      id: membershipPlanId,
    },
    include: {
      benefits: true,
    },
  });

  if (!plan) {
    return { error: "Membership plan not found" };
  }

  await db.membershipPlan.update({
    where: {
      id: membershipPlanId,
    },
    data: {
      ...values,
      benefits: {
        disconnect: plan.benefits.map((benefit) => ({ id: benefit.id })),
        connect: values.benefitIds.map((benefitId) => ({ id: benefitId })),
      },
    },
  });

  return { success: "Membership Plan Updated!" };
}

export async function deleteMembershipPlan(membershipPlanId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthenticated" };
    }
  
    if (!membershipPlanId) {
      return { error: "Membership plan Id is requried" };
    }
  
    if (!isModerator(user)) {
      return { error: "Only admin or moderator have this permission" };
    }
  
    await db.membershipPlan.delete({
      where: {
        id: membershipPlanId,
      },
    });
  
    return { success: "Membership Plan Deleted!" };
  } catch (error) {
    return {error: "Something went wrong"};
  }
}
