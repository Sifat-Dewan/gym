import { TableFilters } from "@/components/data-table/table-filters";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import db from "@/lib/db";
import { ReactNode } from "react";

export default async function membersTableLayout({
  children,
}: {
  children: ReactNode;
}) {
  const membershipPlans = await db.membershipPlan.findMany();
  const totalMembers = await db.member.count();
  const maxPages = Math.ceil(totalMembers / 10);
  return (
    <div className="space-y-3">
      <PageHeader
        label="Members"
        actionLabel="Add New"
        actionUrl="/admin/members/new"
      />
      <TableFilters membershipPlans={membershipPlans} maxPages={maxPages} />
      {children}
      <Pagination totalPages={maxPages} />
    </div>
  );
}
