"use client";

import { useModal } from "@/hooks/use-modal-store";
import { formatText } from "@/lib/utils";
import { FullMembershipPlan } from "@/types";
import { MembershipPlan } from "@prisma/client";
import { motion, useAnimation } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface MembershipPlanPickerProps {
  membershipPlans: FullMembershipPlan[];
  selectedPlan: MembershipPlan;
}

export const MembershipPlanPicker = ({
  membershipPlans,
  selectedPlan,
}: MembershipPlanPickerProps) => {
  const { onOpen } = useModal();
  const ChevronRightIcon = motion(ChevronRight);
  const animation = useAnimation();

  return (
    <motion.div
      onClick={() =>
        onOpen("MEMBERSHIP_PLAN_PICKER_MODAL", {
          membershipPlans,
        })
      }
      onMouseEnter={() => animation.start("iconAnimation")}
      onMouseLeave={() => animation.start("stopIconAnimation")}
      className="relative p-5 rounded-xl border hover:bg-primary/5 transition-colors cursor-pointer shadow flex items-center justify-center mb-5"
    >
      <div className="ml-auto flex flex-col items-center">
        <h3 className="font-bold text-2xl text-primary">
          {formatText(selectedPlan.name)}
        </h3>
        <p className="text-muted-foreground text-sm font-semibold">
          Duration: {selectedPlan.durationInMonth} Month
        </p>
        <p className="text-muted-foreground text-sm font-semibold">
          Price: {selectedPlan.price} BDT
        </p>
      </div>
      <ChevronRightIcon
        variants={{
          iconAnimation: { x: 10, scale: 1.3 },
          stopIconAnimation: { x: 0, scale: 1 },
        }}
        animate={animation}
        className="text-primary h-10 w-10 ml-auto"
      />
    </motion.div>
  );
};
