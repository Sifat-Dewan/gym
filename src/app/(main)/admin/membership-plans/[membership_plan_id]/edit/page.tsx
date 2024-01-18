import { MembershipPlanForm } from "@/components/forms/membership-plan-form";
import { PageHeader } from "@/components/page-header";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const EditMembershipPlanPage = async ({
  params,
}: {
  params: { membership_plan_id: string };
}) => {
  const membershipBenefits = await db.benefit.findMany();

  const membershipPlan = await db.membershipPlan.findUnique({
    where: {
      id: params.membership_plan_id,
    },
    include: {
      benefits: true,
      members: true,
    },
  });

  if (!membershipPlan) {
    redirect("/members");
  }

  return (
    <div className="space-y-3">
      <PageHeader label="New" />
      <MembershipPlanForm
        membershipBenefits={membershipBenefits}
        membershipPlan={membershipPlan}
      />
    </div>
  );
};

export default EditMembershipPlanPage;
