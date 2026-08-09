import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { STATUSES, type ComplaintStatus } from "@/types/complaint";

export function StatusTimeline({ status }: { status: ComplaintStatus }) {
  const currentIndex = STATUSES.indexOf(status);

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
      {STATUSES.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <li key={step} className="flex flex-1 gap-3 sm:flex-col sm:gap-2">
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                  done && "border-status-resolved-border bg-status-resolved-bg text-status-resolved",
                  current && "border-primary bg-primary text-primary-foreground",
                  !done && !current && "border-border bg-secondary text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "my-1 w-px flex-1 sm:my-0 sm:mx-2 sm:h-px sm:w-full sm:flex-1",
                  index === STATUSES.length - 1 && "sm:hidden",
                  done ? "bg-status-resolved-border" : "bg-border",
                  index === STATUSES.length - 1 && "hidden",
                )}
              />
            </div>
            <div className="pb-5 sm:pb-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
                {current ? <span className="sr-only"> (current status)</span> : null}
              </p>
              <p className="text-xs text-muted-foreground">
                {current ? "Current stage" : done ? "Completed" : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}