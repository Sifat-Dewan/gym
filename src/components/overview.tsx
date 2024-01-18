"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Overview({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto w-full border rounded-xl space-y-5 p-5 pl-0 bg-background">
      <h3 className="font-semibold text-2xl ml-5">Overview</h3>
      <ResponsiveContainer width="100%" minWidth={500} height={350} className="">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#E11D48"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#E11D48"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `৳${value}`}
          />
          <Bar dataKey="total" fill="#E11D48" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
