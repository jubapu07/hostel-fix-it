import { CircleDot, CheckCircle2, Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/types/complaint";

const config: Record<
  ComplaintStatus,
  { icon: typeof CircleDot; className: string }
> = {
  Open: {
    icon: CircleDot,
    className: "bg-status-open-bg text-status-open border-status-open-border",
  },
  "In Progress": {
    icon: Loader,
    className: "bg-status-progress-bg text-status-progress border-status-progress-border",
  },
  Resolved: {
    icon: CheckCircle2,
    className: "bg-status-resolved-bg text-status-resolved border-status-resolved-border",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ComplaintStatus;
  className?: string;
}) {
  const { icon: Icon, className: tone } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tone,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {status}
    </span>
  );
}