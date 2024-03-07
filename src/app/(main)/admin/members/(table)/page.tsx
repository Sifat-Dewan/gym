import { OrderBy, getMembers } from "@/actions/members-action";
import Await from "@/components/await";
import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { Gender } from "@prisma/client";
import { Suspense } from "react";

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
  const take = 10;

  const promise = getMembers({
    take,
    page,
    q,
    gender,
    orderby,
    membershipPlan,
  });
  return (
    <Suspense key={Math.random()} fallback={<TableSkeleton />}>
      <Await promise={promise}>
        {(members) => <DataTable columns={columns} data={members} />}
      </Await>
    </Suspense>
  );
};

export default MembersPage;