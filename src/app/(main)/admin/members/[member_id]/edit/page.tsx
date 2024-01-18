import { getMembershipPlans } from "@/actions/membership-plans-action";
import { MemberForm } from "@/components/forms/member-form";
import { PageHeader } from "@/components/page-header";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";

const EditMemberPage = async ({
  params,
  searchParams,
}: {
  params: { member_id: string };
  searchParams: { selected_plan: string | undefined };
}) => {
  const member = await db.member.findUnique({
    where: {
      id: params.member_id,
    },
    include: {
      membershipPlan: true,
    },
  });

  if (!member) {
    notFound();
  }

  const membershipPlans = await getMembershipPlans();

  const selectedPlan =
    membershipPlans.find((plan) => plan.id === searchParams.selected_plan) ||
    member.membershipPlan;

  const defaultSettings = await db.defaultSettings.findFirst();

  if (!selectedPlan) {
    redirect("/admin/members");
  }

  return (
    <div className="space-y-3">
      <PageHeader label="Edit Member" />
      <MemberForm
        admissionFee={defaultSettings?.admissionFee}
        member={member}
        membershipPlans={membershipPlans}
        selectedPlan={selectedPlan}
        isModerator
      />
    </div>
  );
};

export default EditMemberPage;
