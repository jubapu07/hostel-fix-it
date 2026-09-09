import { cn } from "@/lib/utils";
import type { Priority } from "@/types/complaint";

const priorityConfig: Record<
  Priority,
  { container: string; dot: string }
> = {
  Low: {
    container: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
    dot: "bg-slate-500",
  },
  Medium: {
    container: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    dot: "bg-amber-500",
  },
  High: {
    container: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
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