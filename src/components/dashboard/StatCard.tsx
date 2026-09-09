import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accentClassName,
  pillLabel,
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  accentClassName?: string;
  pillLabel?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[var(--shadow-card-hover)]">
      {/* Subtle ambient gradient highlight */}
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-primary/5 blur-2xl transition-opacity duration-300 group-hover:bg-primary/10" />

      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-xl border border-border/50 bg-secondary/80 text-foreground transition-all duration-300 group-hover:scale-110",
            accentClassName
          )}
        >
          <Icon aria-hidden="true" className="size-4.5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <p className="text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
          {value}
        </p>
        {pillLabel && (
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {pillLabel}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground/90 font-normal">{hint}</p>
    </div>
  );
}