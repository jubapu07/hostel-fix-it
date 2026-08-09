import { cn } from "@/lib/utils";
import type { Priority } from "@/types/complaint";

const tone: Record<Priority, string> = {
  Low: "text-muted-foreground",
  Medium: "text-foreground",
  High: "text-destructive",
};

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        tone[priority],
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {priority} priority
    </span>
  );
}