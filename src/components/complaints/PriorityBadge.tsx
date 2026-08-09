import { cn } from "@/lib/utils";
import type { Priority } from "@/types/complaint";

const tone: Record<Priority, string> = {
  Low: "border-border bg-secondary text-muted-foreground",
  Medium: "border-status-progress-border bg-status-progress-bg text-status-progress",
  High: "border-destructive/20 bg-destructive/10 text-destructive",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tone[priority],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {priority} priority
    </span>
  );
}
