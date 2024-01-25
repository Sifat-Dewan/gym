"use client";

import { useModal } from "@/hooks/use-modal-store";
import { MemberWithPlan } from "@/types";
import {
  Calendar,
  CheckCircle2,
  EditIcon,
  TrashIcon,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ActionDropdownMenu } from "../action-dropdown-menu";
import { differenceInDays } from "date-fns";

interface CellActionProps {
  member: MemberWithPlan;
}

export const CellAction = ({ member }: CellActionProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const items = [
    {
      label: "Profile",
      icon: User2,
      onClick: () => router.push(`/admin/members/${member.id}`),
    },
    {
      label: "Renew",
      icon: Calendar,
      onClick: () =>
        router.push(
          `/admin/members/${member.id}/renew/?selected_plan=${member.membershipPlanId}`
        ),
    },
    {
      label: "Edit",
      icon: EditIcon,
      onClick: () => router.push(`/admin/members/${member.id}/edit`),
    },
    {
      label: "Delete",
      icon: TrashIcon,
      onClick: () => onOpen("DELETE_MEMBER_MODAL", { memberId: member.id }),
    },
  ];

  if (!member.isPaid) {
    items.unshift({
      label: "Approve" as string,
      icon: CheckCircle2,
      onClick: () => onOpen("APPROVE_MEMBER_MODAL", { member }),
    });
  }
  return <ActionDropdownMenu items={items} />;
};
