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
import { useChartColors, type ChartColors } from "@/hooks/useChartColors";
import { chronologicalTips } from "@/lib/tips";
import { formatKickoff } from "@/lib/datetime";
import { Skeleton } from "@/components/ui/skeleton";

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function tooltipProps(colors: ChartColors) {
  return {
    contentStyle: {
      background: "hsl(var(--popover))",
      border: `1px solid ${colors.grid}`,
      borderRadius: 8,
      fontSize: 12,
    },
    labelStyle: { color: "hsl(var(--popover-foreground))", fontWeight: 600 },
    itemStyle: { color: "hsl(var(--popover-foreground))" },
  };
}

/** Kumulativer Punkteverlauf über die (gewerteten) Tipps. */
export function PointsProgressionChart({ history }: { history: ProfileTip[] }) {
  const colors = useChartColors();
  const mounted = useMounted();

  if (!mounted) return <Skeleton className="h-56 w-full" />;
  if (history.length === 0) return null;

  let cum = 0;
  const data = chronologicalTips(history).map((t, i) => {
    cum += t.points;
    return {
      n: i + 1,
      total: cum,
      date: t.kickoffUtc ? formatKickoff(t.kickoffUtc) : `Tipp ${i + 1}`,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={224}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 20, left: -12 }}>
        <defs>
          <linearGradient id="pointsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
        <XAxis
          dataKey="n"
          tick={{ fontSize: 11, fill: colors.muted }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "Spiele (chronologisch)",
            position: "insideBottom",
            offset: -8,
            fontSize: 11,
            fill: colors.muted,
          }}
        />
        <YAxis tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} width={32} />
        <RTooltip
          {...tooltipProps(colors)}
          cursor={{ stroke: colors.grid }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
          formatter={(value: number) => [`${value} Punkte`, "Gesamt"]}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke={colors.primary}
          strokeWidth={2}
          fill="url(#pointsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const TIER_META = [
  { key: "p4" as const, label: "4 Punkte", short: "4 P" },
  { key: "p3" as const, label: "3 Punkte", short: "3 P" },
  { key: "p2" as const, label: "2 Punkte", short: "2 P" },
  { key: "p0" as const, label: "0 Punkte", short: "0 P" },
];

/** Punktstufen-Verteilung als Balkendiagramm (4/3/2/0). */
export function DistributionChart({ distribution }: { distribution: PointDistribution }) {
  const colors = useChartColors();
  const mounted = useMounted();

  if (!mounted) return <Skeleton className="h-56 w-full" />;

  const fills = [colors.success, colors.primary, colors.warning, colors.muted];
  const data = TIER_META.map((t, i) => ({
    stufe: t.short,
    label: t.label,
    Tipps: distribution[t.key],
    fill: fills[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
        <XAxis dataKey="stufe" tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: colors.muted }} tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <RTooltip
          {...tooltipProps(colors)}
          cursor={{ fill: colors.grid, opacity: 0.3 }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
          formatter={(value: number) => [`${value}× getippt`, "Anzahl"]}
        />
        <Bar dataKey="Tipps" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.stufe} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
