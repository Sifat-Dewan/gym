import { Benefit, Member, MembershipPlan, Renew } from "@prisma/client";

export type FullMembershipPlan = MembershipPlan & {
  benefits: Benefit[];
  members: Member[]
};

export type MemberWithPlan = Member & {
  membershipPlan: MembershipPlan;
};

export type MemberWithPlanAndRenew = Member & {
  membershipPlan: MembershipPlan;
  renews: Renew[];
};
