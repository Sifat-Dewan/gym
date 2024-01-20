"use client";

import { useModal } from "@/hooks/use-modal-store";
import { cn, formatText } from "@/lib/utils";
import { FullMembershipPlan } from "@/types";
import { Check, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

interface MembershipPlanCardProps {
  membershipPlan: FullMembershipPlan;
  isModerator?: boolean;
}

export const MembershipPlanCard = ({
  membershipPlan,
  isModerator,
}: MembershipPlanCardProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex flex-col p-5 border rounded-xl w-full max-w-[500px] mx-auto dark:bg-secondary/50">
      <h3 className="font-bold text-2xl">{formatText(membershipPlan.name)}</h3>
      <div className="mt-3 space-y-2">
        {membershipPlan.benefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {benefit.title}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-3">
        <span className="font-bold mt-2.5">৳</span>
        <h1 className="text-primary text-4xl font-extrabold">
          {membershipPlan.price}
        </h1>
        <span className="mt-2.5 font-bold">
          /{membershipPlan.durationInMonth} Month
        </span>
      </div>
      <div className="flex items-center w-full gap-5 mt-5">
        {isModerator ? (
          <>
            <Button
              disabled={!!membershipPlan.members.length}
              onClick={() =>
                onOpen("DELETE_MEMBERSHIP_PLAN_MODAL", {
                  membershipPlanId: membershipPlan.id,
                })
              }
              variant="destructive"
              className={cn("w-full")}
            >
              <Trash className="h-4 w-4 mr-2 mb-0.5" />
              Delete
            </Button>
            <Link
              href={`/admin/membership-plans/${membershipPlan.id}/edit`}
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              <Edit className="h-4 w-4 mr-2 mb-0.5" />
              Edit
            </Link>
          </>
        ) : (
          <Link
            href={`/membership-plans/enroll?selected_plan=${membershipPlan.id}`}
            className={cn(buttonVariants(), "w-full")}
          >
            Purchase Plan
          </Link>
        )}
      </div>
    </div>
  );
};
