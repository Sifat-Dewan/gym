import { getMembershipPlans } from "@/actions/membership-plans-action";
import { MemberForm } from "@/components/forms/member-form";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@/lib/current-user";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const membershipPlans = await getMembershipPlans();
  const user = await currentUser();

  const existingMember = await db.member.findFirst({
    where: {
      email: user?.email,
    },
    include: {
      membershipPlan: true,
    },
  });

  if (existingMember) {
    redirect("/dashboard");
  }

  const selectedPlan = await db.membershipPlan.findUnique({
    where: {
      id: searchParams.selected_plan,
    },
  });

  if (!selectedPlan) {
    return notFound();
  }

  const defaultSettings = await db.defaultSettings.findFirst();

  if (!defaultSettings?.admissionFee) {
    redirect("/membership-plans/new");
  }

  return (
    <div className="space-y-3">
      <PageHeader label="New" />
      <MemberForm
        admissionFee={defaultSettings.admissionFee}
        membershipPlans={membershipPlans}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Page;
