"use client";

import { cn, formatText } from "@/lib/utils";
import { Member, MembershipPlan } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { differenceInDays, format } from "date-fns";
import { Avatar } from "../avatar";
import { Badge } from "../ui/badge";
import { CellAction } from "./cell-action";
import { StatusCellHeader } from "./status-cell-header";
import { MemberWithPlanAndRenew } from "@/types";
import Link from "next/link";

export const columns: ColumnDef<MemberWithPlanAndRenew>[] = [
  {
    accessorKey: "memberId",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.memberId;
      return Number(id) < 10 ? `0${id}` : id;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/members/${row.original.id}`} className="flex items-center gap-2">
          <Avatar image={row.original.image} alt={row.original.name} />
          <div>
            <h4 className="font-semibold text-sm whitespace-nowrap">
              {row.original.name}
            </h4>
            <p className="text-muted-foreground text-sm">
              {row.original.phone}
            </p>
          </div>
        </Link >
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      return <p className="capitalize">{row.original.gender.toLowerCase()}</p>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;
      return (
        <p className={cn(!phone && "text-muted-foreground")}>
          {phone || "Not Given"}
        </p>
      );
    },
  },
  {
    accessorKey: "membershipPlan",
    header: "Membership Plan",
    cell: ({ row }) => {
      return `${formatText(row.original.membershipPlan.name)}`;
    },
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ row }) => {
      return <p>{format(row.original.startDate, "d MMMM yyyy")}</p>;
    },
  },
  {
    accessorKey: "renews",
    header: "Last Renew",
    cell: ({ row }) => {
      const lastRenew = row.original.renews[0]?.startDate;
      return (
        <p className={cn(!lastRenew && "text-muted-foreground")}>
          {lastRenew ? format(lastRenew, "d MMMM yyyy") : "No Renewals Yet."}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <StatusCellHeader />;
    },
    cell: ({ row }) => {
      const getMembershipStatus = ({
        startDate,
        endDate,
      }: {
        startDate: Date;
        endDate: Date;
      }) => {
        const difference = differenceInDays(endDate, new Date());

        const day = [0, -1, 1].includes(difference) ? "Day" : "Days";
        const leftOver = difference < 0 ? "Over" : "Left";

        const today = new Date();
        let status = null;
        if (!row.original.isPaid) {
          status = "Unpaid";
        } else if (startDate > today) {
          status = "Pending";
        } else if (difference >= 0) {
          status = "Active";
        } else if (difference > -30) {
          status = "Expire";
        } else {
          status = "Invalid";
        }

        return { difference: Math.abs(difference), day, leftOver, status };
      };

      const { difference, day, leftOver, status } = getMembershipStatus({
        startDate: row.original.startDate,
        endDate: row.original.endDate,
      });

      return (
        <div className="flex flex-col items-center text-center gap-1">
          <Badge
            className={cn(
              status === "Active" && "bg-green-500 hover:bg-green-500/80",
              status === "Pending" && "bg-orange-500 hover:bg-orange-500/80",
              (status === "Expire" || status === "Unpaid") &&
                "bg-red-500 hover:bg-red-500/80",
              status === "Invalid" && "bg-neutral-900 hover:bg-neutral-900/80"
            )}
          >
            {status}
          </Badge>
          {difference} {day} {leftOver}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Action",
    cell: ({ row }) => {
      return <CellAction member={row.original} />;
    },
  },
];
