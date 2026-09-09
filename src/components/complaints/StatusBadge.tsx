import { CircleDot, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/types/complaint";

const config: Record<
  ComplaintStatus,
  { icon: typeof CircleDot; className: string; pulseClass?: string }
> = {
  Open: {
    icon: CircleDot,
    className: "bg-status-open-bg text-status-open border-status-open-border shadow-xs",
    pulseClass: "bg-status-open",
  },
  "In Progress": {
    icon: Loader2,
    className: "bg-status-progress-bg text-status-progress border-status-progress-border shadow-xs",
    pulseClass: "bg-status-progress",
  },
  Resolved: {
    icon: CheckCircle2,
    className: "bg-status-resolved-bg text-status-resolved border-status-resolved-border shadow-xs",
  },
};

export function StatusBadge({
  status,
  className,
  showPulse = true,
}: {
  status: ComplaintStatus;
  className?: string;
  showPulse?: boolean;
}) {
  const { icon: Icon, className: tone, pulseClass } = config[status];
  const isSpinning = status === "In Progress";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200",
        tone,
        className
      )}
    >
      {showPulse && pulseClass && (
        <span className="relative flex size-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              pulseClass
            )}
          />
          <span className={cn("relative inline-flex size-2 rounded-full", pulseClass)} />
        </span>
      )}
      <Icon
        aria-hidden="true"
        className={cn("size-3.5", isSpinning && "animate-spin")}
      />
      <span>{status}</span>
    </span>
  );
}