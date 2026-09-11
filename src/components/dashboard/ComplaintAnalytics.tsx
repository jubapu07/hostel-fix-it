import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

import type { Complaint } from "@/types/complaint";
import { CATEGORIES, PRIORITIES } from "@/types/complaint";

interface ComplaintAnalyticsProps {
  complaints: Complaint[];
}

const PRIORITY_COLORS: Record<string, string> = {
  High: "#E74C3C", // Red/Terracotta
  Medium: "#D99B7F", // Peach
  Low: "#0FBED4", // Cyan
};

const CATEGORY_BAR_COLOR = "#0FBED4";

export function ComplaintAnalytics({ complaints }: ComplaintAnalyticsProps) {
  // Category distribution data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((c) => {
      counts[c] = 0;
    });
    complaints.forEach((c) => {
      if (counts[c.category] !== undefined) {
        counts[c.category]++;
      }
    });

    return CATEGORIES.map((category) => ({
      category: category.length > 8 ? `${category.slice(0, 7)}…` : category,
      fullName: category,
      count: counts[category],
    })).filter((d) => d.count > 0 || complaints.length === 0);
  }, [complaints]);

  // Priority breakdown data
  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {
      High: 0,
      Medium: 0,
      Low: 0,
    };
    complaints.forEach((c) => {
      if (counts[c.priority] !== undefined) {
        counts[c.priority]++;
      }
    });

    return PRIORITIES.map((p) => ({
      name: p,
      value: counts[p],
      color: PRIORITY_COLORS[p] || "#A56F63",
    })).filter((d) => d.value > 0);
  }, [complaints]);

  if (!complaints || complaints.length === 0) {
    return null;
  }

  return (
    <section className="mt-6" aria-label="Complaints Analytics">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Category Breakdown Bar Chart */}
        <div className="rounded-2xl border border-slate-200/70 bg-card p-5.5 shadow-xs lg:col-span-7 dark:border-border/70">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-teal/15 text-cyan-teal">
                <BarChart3 className="size-4" />
              </div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Issues by Category
              </h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {complaints.length} Total
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground, #64748b)" }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground, #64748b)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                          <p className="font-semibold text-foreground">{data.fullName}</p>
                          <p className="mt-0.5 text-muted-foreground">
                            Complaints: <span className="font-bold text-foreground">{data.count}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: "rgba(15, 190, 212, 0.08)" }}
                />
                <Bar
                  dataKey="count"
                  fill={CATEGORY_BAR_COLOR}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="rounded-2xl border border-slate-200/70 bg-card p-5.5 shadow-xs lg:col-span-5 dark:border-border/70">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-terracotta/15 text-terracotta">
                <PieChartIcon className="size-4" />
              </div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Priority Distribution
              </h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Severity</span>
          </div>

          <div className="mt-4 flex h-64 flex-col items-center justify-center">
            {priorityData.length === 0 ? (
              <p className="text-xs text-muted-foreground">No priority data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="45%"
                    innerRadius={48}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const percentage = Math.round(
                          (data.value / complaints.length) * 100,
                        );
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                            <p className="font-semibold text-foreground">{data.name} Priority</p>
                            <p className="mt-0.5 text-muted-foreground">
                              {data.value} complaints ({percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs font-medium text-foreground mr-2">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
