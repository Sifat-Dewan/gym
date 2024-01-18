"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { deleteMembershipPlan } from "@/actions/membership-plans-action";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export const DeleteMembershipPlanModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { membershipPlanId } = data;

  if (!membershipPlanId) {
    return null;
  }

  const onConfirm = () => {
    startTransition(() => {
      deleteMembershipPlan(membershipPlanId).then(({ error, success }) => {
        if (success) {
          toast.success(success);
          onClose();
          router.refresh();
        } else if (error) {
          toast.error(error);
        } else {
          toast.error("Something went wrong");
        }
      });
    });
  };

  return (
    <Dialog
      open={isOpen && type === "DELETE_MEMBERSHIP_PLAN_MODAL"}
      onOpenChange={() => onClose()}
    >
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Delete Membership Plan</DialogTitle>
          <DialogDescription>
            Delete Membership Plan parmanently?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-5">
          <Button disabled={isPending} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
