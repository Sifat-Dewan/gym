import { FullMembershipPlan, MemberWithPlan } from "@/types";
import { Benefit, Faq } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "MEMBERSHIP_PLAN_PICKER_MODAL"
  | "DELETE_MEMBER_MODAL"
  | "EDIT_MEMBER_MODAL"
  | "DELETE_BENEFIT_MODAL"
  | "ADMISSION_FEE_MODAL"
  | "DELETE_MEMBERSHIP_PLAN_MODAL"
  | "CANCEL_ADMISSION_MODAL"
  | "APPROVE_MEMBER_MODAL"
  | "FAQ_MODAL"
  | "EDIT_FAQ_MODAL"
  | "DELETE_FAQ_MODAL"
  | "RENEW_MEMBER_MODAL"
  | "QUESTION_MODAL"
  | "ANSWER_MODAL"
  | "DELETE_FAQ_MODAL"
  | "DELETE_ANSWER_MODAL"
interface ModalData {
  membershipPlans?: FullMembershipPlan[];
  membershipPlanId?: string;
  memberId?: string;
  benefit?: Benefit;
  member?: MemberWithPlan;
  admissionFee?: number;
  faq?: Faq;
  isModerator?: boolean;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
