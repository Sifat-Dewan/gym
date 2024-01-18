"use client";

import { useModal } from "@/hooks/use-modal-store";
import { ChevronRight, Wallet2 } from "lucide-react";

export const AdmissionFee = ({ admissionFee }: { admissionFee?: number }) => {
  const { onOpen } = useModal();

  return (
    <div
      onClick={() => onOpen("ADMISSION_FEE_MODAL", { admissionFee })}
      className="p-3 flex items-center rounded-xl bg-background hover:bg-background/80 dark:hover:bg-neutral-900 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Wallet2 className="h-5 w-5" />
        <h3 className="font-medium">Admission Fee</h3>
      </div>
      <ChevronRight className="h-4 w-4 ml-auto" />
    </div>
  );
};
