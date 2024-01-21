"use client";

import { AdmissionFeeModal } from "@/components/modals/admission-fee-modal";
import { AnswerModal } from "@/components/modals/answer-modal";
import { ApproveMemberModal } from "@/components/modals/approve-member-modal";
import { CancelAdmissionModal } from "@/components/modals/cancel-admission-modal";
import { ChangeCostModal } from "@/components/modals/change-cost-modal";
import { DeleteBenefitModal } from "@/components/modals/delete-benefit-modal";
import { DeleteFaqModal } from "@/components/modals/delete-faq-modal";
import { DeleteMemberModal } from "@/components/modals/delete-member-modal";
import { DeleteMembershipPlanModal } from "@/components/modals/delete-membership-plan-modal";
import { FaqModal } from "@/components/modals/faq-modal";
import { MembershipPlanPickerModal } from "@/components/modals/membership-plan-picker-modal";
import { QuestionModal } from "@/components/modals/question-modal";
import { RenewMemberModal } from "@/components/modals/renew-member-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <MembershipPlanPickerModal />
      <DeleteMemberModal />
      <DeleteBenefitModal />
      <AdmissionFeeModal />
      <DeleteMembershipPlanModal />
      <CancelAdmissionModal />
      <ApproveMemberModal />
      <RenewMemberModal />
      <FaqModal />
      <QuestionModal />
      <AnswerModal />
      <DeleteFaqModal />
      <ChangeCostModal/>
    </>
  );
};

export default ModalProvider;
