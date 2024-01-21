"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";

const boxVariants = {
  hidden: {
    x: "-100vw",
  },
  visible: {
    x: 0,
    delay: 0.5,
    transition: {
      staggerChildren: 0.08,
      type: "tween",
    },
  },
};

const listVariants = {
  hidden: { opacity: 0, y: 10, x: -10 },
  visible: { opacity: 1, y: 0, x: 0 },
};

export const MembershipPlanPickerModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { membershipPlans } = data;
  const MotionButton = motion(Button);
  const router = useRouter();
  const open = isOpen && type === "MEMBERSHIP_PLAN_PICKER_MODAL";
  const searchParams = useSearchParams();

  const [active, setActive] = useState<string>();
  const pathname = usePathname();
  useEffect(() => {
    const initialActive =
      membershipPlans?.find(
        (plan) => plan.id === searchParams.get("selected_plan")
      )?.name || membershipPlans?.[0].name;

    setActive(initialActive);
  }, [searchParams, membershipPlans]);

  if (!membershipPlans?.length) {
    return null;
  }

  const handleSelect = (plan: string) => {
    const url = `${pathname}/?selected_plan=${plan}`;
    router.push(url);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="px-2 pt-12 xs:px-5 h-[100svh] xs:max-h-[500px] overflow-x-hidden overflow-y-auto">
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center flex-wrap justify-center border rounded-full">
            {membershipPlans.map((plan) => (
              <Button
                variant="ghost"
                key={plan.id}
                onClick={() => setActive(plan.name)}
                className={cn(
                  "rounded-full relative",
                  active === plan.name &&
                    "hover:bg-transparent text-white hover:text-white"
                )}
              >
                {plan.name.toLowerCase()}
                {active === plan.name && (
                  <motion.span
                    layoutId="active"
                    className="absolute inset-0 -z-10 bg-primary rounded-full"
                  />
                )}
              </Button>
            ))}
          </div>
          {membershipPlans.map((plan) => (
            <Fragment key={plan.name}>
              {active === plan.name && (
                <motion.div
                  variants={boxVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col h-full gap-1 items-center w-full border rounded-xl shadow p-3 px-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                >
                  <motion.h3
                    variants={listVariants}
                    className="font-bold text-2xl capitalize"
                  >
                    {plan.name.toLowerCase()}
                  </motion.h3>
                  <motion.h3
                    variants={listVariants}
                    className="text-3xl font-extrabold mt-2"
                  >
                    {plan.price}৳
                  </motion.h3>
                  <motion.p
                    variants={listVariants}
                    className="font-semibold text-sm"
                  >
                    {plan.durationInMonth} months
                  </motion.p>
                  <div className="flex flex-col gap-2 mt-6">
                    {plan.benefits.map((benefit) => (
                      <motion.div
                        variants={listVariants}
                        key={benefit.id}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <p className="font-semibold">{benefit.title}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="relative w-full h-fit mt-auto">
                    <MotionButton
                      onClick={() => handleSelect(plan.id)}
                      variant="outline"
                      className="w-full text-black dark:text-foreground font-bold"
                    >
                      Select Plan
                    </MotionButton>
                    <motion.span
                      initial={{ width: "100%" }}
                      animate={{ width: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute h-full top-0 right-0 rounded-md bg-neutral-900 dark:bg-white w-full z-10"
                    />
                  </div>
                </motion.div>
              )}
            </Fragment>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
