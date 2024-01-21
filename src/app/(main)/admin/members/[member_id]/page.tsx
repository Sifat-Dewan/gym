import { MemberPhoto } from "@/components/member-photo";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import db from "@/lib/db";
import { cn, formatText } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowDown } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Fragment } from "react";

const MemberProfilePage = async ({
  params,
}: {
  params: { member_id: string };
}) => {
  const member = await db.member.findUnique({
    where: {
      id: params.member_id,
    },
    include: {
      membershipPlan: true,
      renews: true,
    },
  });

  if (!member) {
    notFound();
  }

  const getFormattedDate = (date: Date) => {
    return format(date, "d MMMM yyyy");
  };

  const lastRenew = member.renews.length
    ? getFormattedDate(member.renews[0].createdAt)
    : "Null";

  const lists = [
    {
      label: "Name",
      value: formatText(member.name),
    },
    {
      label: "Phone",
      value: member.phone,
    },
    {
      label: "Email",
      value: member.email || "Null",
    },
    {
      label: "Address",
      value: member.address,
    },
    {
      label: "Created At",
      value: getFormattedDate(member.createdAt),
    },
    {
      label: "Joined",
      value: getFormattedDate(member.startDate),
    },
    {
      label: "Last Renewed",
      value: lastRenew,
    },
    {
      label: "Expiration Date",
      value: getFormattedDate(member.endDate),
    },
    {
      label: "Current Membership Plan",
      value: formatText(member.membershipPlan.name),
    },
  ];

  return (
    <div className="space-y-3">
      <PageHeader label={member.name} />
      <div className="flex flex-col gap-6 py-6 max-w-[500px] border rounded-xl shadow-lg mx-auto sm:px-3">
        <MemberPhoto image={member.image} className="mx-auto" />
        <section className="grid grid-cols-2 overflow-hidden">
          {lists.map((item, index) => (
            <Fragment key={item.label}>
              <p
                className={cn(
                  "text-sm text-muted-foreground font-medium py-1.5 px-3 rounded-l-lg",
                  index % 2 === 0 && "bg-accent"
                )}
              >
                {item.label}
              </p>
              <p
                className={cn(
                  "text-sm text-muted-foreground font-medium break-words py-1.5 px-3 rounded-r-lg",
                  index % 2 === 0 && "bg-accent"
                )}
              >
                {item.value}
              </p>
            </Fragment>
          ))}
        </section>
        <section className="flex flex-col gap-2 items-center font-medium">
          <h4 className="font-bold">Status</h4>
          <Separator />
          <div className="flex gap-5 mt-2">
            <p className="text-muted-foreground">Joined</p>
            <p>{getFormattedDate(member.startDate)}</p>
          </div>
          {member.renews.map((renew, index) => (
            <div key={renew.id} className="flex flex-col gap-3 items-center">
              <ArrowDown className="h-10 w-10 text-muted-foreground" />
              <div className="flex items-center gap-5">
                <p className="text-muted-foreground">
                  {index + 1}
                  {index === 0
                    ? "st"
                    : index === 1
                    ? "nd"
                    : index === 2
                    ? "rd"
                    : "th"}{" "}
                  renew
                </p>
                <p>{getFormattedDate(renew.createdAt)}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default MemberProfilePage;
