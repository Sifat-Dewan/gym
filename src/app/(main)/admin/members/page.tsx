import { OrderBy, getMembers } from "@/actions/members-action";
import { getMembershipPlans } from "@/actions/membership-plans-action";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { TableFilters } from "@/components/data-table/table-filters";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import db from "@/lib/db";
import { Gender } from "@prisma/client";

const MembersPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = Number(searchParams.page) || 1;
  const q = searchParams.q;
  const gender = searchParams.gender?.toUpperCase() as Gender;
  const orderby = searchParams.orderby as OrderBy;
  const membershipPlan = searchParams.membership_plan;
  const take = 20;

  const members = await getMembers({
    take,
    page,
    q,
    gender,
    orderby,
    membershipPlan,
  });
  const totalMembers = await db.member.count();
  const membershipPlans = await getMembershipPlans();

  const totalPages = Math.ceil(totalMembers / take);

  return (
    <div className="space-y-3">
      <PageHeader
        label="Members"
        actionLabel="Add New"
        actionUrl="/admin/members/new"
      />
      <TableFilters membershipPlans={membershipPlans} />
      <DataTable columns={columns} data={members} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
};

export default MembersPage;
