import { getMembers } from "@/actions/members-action";
import { getGraphRevenue, getRevenue } from "@/actions/revenue";
import { Avatar } from "@/components/avatar";
import { DumbleLoader } from "@/components/dumble-loader/dumble-loader";
import { Overview } from "@/components/overview";
import { PageHeader } from "@/components/page-header";
import db from "@/lib/db";
import { CircleDollarSign, Users2 } from "lucide-react";

const DashboardPage = async () => {
  const graphRevenue = await getGraphRevenue();
  const totalRevenue = await getRevenue();
  const todaysRevenue = await getRevenue({ type: "TODAY_JOINED" });
  const monthlyRevenue = await getRevenue({ type: "THIS_MONTH_JOINED" });
  const todayJoined = await getMembers({ type: "TODAY_JOINED" }).then(
    (res) => res.length
  );
  const totalMembers = await db.member.count();
  const todayRenewed = await getMembers({ type: "TODAY_RENEWED" }).then(
    (res) => res.length
  );
  const savedRevenue =
    (await db.defaultSettings.findFirst().then((res) => res?.savedRevenue)) ||
    0;
  const revenueCard = [
    {
      label: "Total Revenue",
      count: `${totalRevenue + savedRevenue}৳`,
      growth: "201% ↑ from last month",
      icon: CircleDollarSign,
    },
    {
      label: "This Month",
      count: `${monthlyRevenue}৳`,
      growth: "2+ admissions 3+ renews",
      icon: CircleDollarSign,
    },
    {
      label: "Today's Revenue",
      count: `${todaysRevenue}৳`,
      growth: "2+ admissions 3+ renews",
      icon: CircleDollarSign,
    },
    {
      label: "Members",
      count: `${totalMembers}+`,
      growth: "2% ↓ from last month",
      icon: Users2,
    },
    {
      label: "Today Joined",
      count: `${todayJoined}+`,
      growth: "201% ↑ from last month",
      icon: Users2,
    },
    {
      label: "Today's Renewals",
      count: `${todayRenewed}+`,
      growth: "201% ↑ from last month",
      icon: Users2,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader label="Dashboard" hideBackButton />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
        {revenueCard.map((item, index) => (
          <div
            key={index}
            className="relative space-y-1 rounded-lg border shadow p-4 bg-background"
          >
            <h4 className="font-semibold">{item.label}</h4>
            <h3 className="font-bold text-2xl text-primary">{item.count}</h3>
            {/* <p className="text-sm text-muted-foreground leading-3">
              {item.growth}
            </p> */}
            <item.icon className="h-5 w-5 text-muted-foreground absolute right-4 top-2" />
          </div>
        ))}
      </section>
      <section className="grid gap-5 2xl:grid-cols-2">
        <Overview data={graphRevenue} />
        <RecentMembers />
      </section>
    </div>
  );
};

const RecentMembers = async () => {
  const members = await getMembers();
  return (
    <div className="border p-5 space-y-5 rounded-xl bg-background">
      <h3 className="text-xl font-semibold">Recent Admissions</h3>
      <div>
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between even:bg-accent px-3 py-2 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar image={member.image} alt={member.name} />
              <div>
                <h4 className="font-semibold text-sm">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.phone}</p>
              </div>
            </div>
            <p className="font-semibold text-sm">+{member.cost}৳</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
