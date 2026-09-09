import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock, MapPin, Tag } from "lucide-react";

import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Complaint } from "@/types/complaint";

export function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <Link
      to="/complaints/$id"
      params={{ id: complaint.id }}
      className="group relative block overflow-hidden rounded-2xl border border-border/80 bg-card p-4.5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-card-hover)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={complaint.priority} />
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {formatDate(complaint.created_at)}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {complaint.title}
          </h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
        {complaint.description}
      </p>

      <div className="mt-3.5 flex items-center justify-between border-t border-border/60 pt-3">
        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-2 py-0.5 font-medium text-secondary-foreground">
            <dt className="sr-only">Category</dt>
            <Tag aria-hidden="true" className="size-3 text-muted-foreground" />
            <dd>{complaint.category}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <dt className="sr-only">Location</dt>
            <MapPin aria-hidden="true" className="size-3" />
            <dd>{complaint.location}</dd>
          </div>
        </dl>

        <span className="flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Details
          <ChevronRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}