import db from "@/lib/db";
import { getMembers } from "./members-action";

interface GraphData {
  name: string;
  total: number;
}

const graphData: GraphData[] = [
  { name: "Jan", total: 0 },
  { name: "Feb", total: 0 },
  { name: "Mar", total: 0 },
  { name: "Apr", total: 0 },
  { name: "May", total: 0 },
  { name: "Jun", total: 0 },
  { name: "Jul", total: 0 },
  { name: "Aug", total: 0 },
  { name: "Sep", total: 0 },
  { name: "Oct", total: 0 },
  { name: "Nov", total: 0 },
  { name: "Dec", total: 0 },
];

export const getGraphRevenue = async () => {
  const members = await db.member.findMany({
    include: {
      membershipPlan: true,
      renews: true,
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  for (const member of members) {
    const month = member.createdAt.getMonth();
    for (const renew of member.renews) {
      const renewMonth = renew.startDate.getMonth();
      monthlyRevenue[renewMonth] = (monthlyRevenue[month] || 0) + renew.cost;
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + member.cost;
  }

  for (const month in monthlyRevenue) {
    graphData[month].total = monthlyRevenue[month];
  }

  return graphData;
};

export const getRevenue = async ({
  type,
}: { type?: "TODAY_JOINED" | "THIS_MONTH_JOINED" } = {}) => {
  const members = await getMembers({ type });

  const revenue = members.reduce((total, member) => {
    if (!member.isPaid) {
      return total;
    }
    const renews = member.renews.reduce((total, renew) => {
      return total + renew.cost;
    }, 0);

    return (total = total + member.cost + renews);
  }, 0);

  return revenue;
};
