import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  pillLabel?: string;
  pillClassName?: string;
  progressPercent?: number;
  ringColor?: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  pillLabel,
  pillClassName,
  progressPercent,
  ringColor = "stroke-primary",
  iconBgColor = "bg-primary/10",
  iconTextColor = "text-primary",
}: StatCardProps) {
  // SVG circle calculation for 36x36 viewBox, radius 14
  const radius = 14;
  const circumference = 2 * Math.PI * radius; // ~87.96
  const percent = progressPercent !== undefined ? Math.min(Math.max(progressPercent, 0), 100) : null;
  const strokeOffset = percent !== null ? circumference - (percent / 100) * circumference : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-border/70 dark:bg-card">
      {/* Micro circular progress ring / indicator top-right */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <div className="relative flex size-10 items-center justify-center shrink-0">
          {percent !== null ? (
            <svg className="size-10 -rotate-90 transform" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r={radius}
                className="stroke-secondary/60 dark:stroke-muted/40"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="18"
                cy="18"
                r={radius}
                className={cn("transition-all duration-700 ease-out", ringColor)}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          ) : (
            <div className="size-10 rounded-full border border-border/50 bg-secondary/60" />
          )}

          {/* Centered micro icon */}
          <div
            className={cn(
              "absolute inset-1.5 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110",
              iconBgColor,
              iconTextColor
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-4xl">
          {value}
        </p>
        {pillLabel && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-2xs",
              pillClassName || "bg-secondary text-secondary-foreground"
            )}
          >
            {pillLabel}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground font-normal">{hint}</p>
    </div>
  );
}