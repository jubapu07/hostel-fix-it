import { cn } from "@/lib/utils";
import type { Priority } from "@/types/complaint";

const priorityConfig: Record<
  Priority,
  { container: string; dot: string }
> = {
  Low: {
    container: "bg-slate-100/80 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/60",
    dot: "bg-slate-400",
  },
  Medium: {
    container: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dot: "bg-amber-500",
  },
  High: {
    container: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60 font-semibold",
    dot: "bg-rose-500",
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