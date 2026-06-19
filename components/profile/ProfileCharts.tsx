"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PointDistribution, ProfileTip } from "@/lib/api/types";
import { useChartColors } from "@/hooks/useChartColors";
import { Skeleton } from "@/components/ui/skeleton";

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

const tooltipStyle = (colors: ReturnType<typeof useChartColors>) => ({
  background: "hsl(var(--popover))",
  border: `1px solid ${colors.grid}`,
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
});

/** Kumulativer Punkteverlauf über die (gewerteten) Tipps. */
export function PointsProgressionChart({ history }: { history: ProfileTip[] }) {
  const colors = useChartColors();
  const mounted = useMounted();

  if (!mounted) return <Skeleton className="h-56 w-full" />;
  if (history.length === 0) return null;

  let cum = 0;
  const data = history.map((t, i) => {
    cum += t.points;
    return { name: `${i + 1}`, Punkte: cum };
  });

  return (
    <ResponsiveContainer width="100%" height={224}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <defs>
          <linearGradient id="pointsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} width={32} />
        <RTooltip contentStyle={tooltipStyle(colors)} cursor={{ stroke: colors.grid }} />
        <Area
          type="monotone"
          dataKey="Punkte"
          stroke={colors.primary}
          strokeWidth={2}
          fill="url(#pointsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Punktstufen-Verteilung als Balkendiagramm (4/3/2/0). */
export function DistributionChart({ distribution }: { distribution: PointDistribution }) {
  const colors = useChartColors();
  const mounted = useMounted();

  if (!mounted) return <Skeleton className="h-56 w-full" />;

  const data = [
    { tier: "4 P", value: distribution.p4, fill: colors.success },
    { tier: "3 P", value: distribution.p3, fill: colors.primary },
    { tier: "2 P", value: distribution.p2, fill: colors.warning },
    { tier: "0 P", value: distribution.p0, fill: colors.muted },
  ];

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
        <XAxis dataKey="tier" tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <RTooltip contentStyle={tooltipStyle(colors)} cursor={{ fill: colors.grid, opacity: 0.3 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.tier} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
