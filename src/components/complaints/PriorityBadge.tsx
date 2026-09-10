import { cn } from "@/lib/utils";
import type { Priority } from "@/types/complaint";

const priorityConfig: Record<
  Priority,
  { container: string; dot: string }
> = {
  Low: {
    container: "bg-palette-slate/15 text-slate-700 dark:text-slate-300 border-palette-slate/30",
    dot: "bg-palette-slate",
  },
  Medium: {
    container: "bg-palette-peach/15 text-amber-700 dark:text-palette-peach border-palette-peach/30",
    dot: "bg-palette-peach",
  },
  High: {
    container: "bg-palette-terracotta/15 text-palette-terracotta dark:text-palette-terracotta border-palette-terracotta/40",
    dot: "bg-palette-terracotta",
  },
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
        config.container,
        className
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", config.dot)} />
      {priority} Priority
    </span>
  );
}