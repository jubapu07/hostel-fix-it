import { Link } from "@tanstack/react-router";
import { MapPin, Tag } from "lucide-react";

import { StatusBadge } from "@/components/complaints/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Complaint } from "@/types/complaint";

export function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <Link
      to="/complaints/$id"
      params={{ id: complaint.id }}
      className="block rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{complaint.title}</h3>
        <StatusBadge status={complaint.status} />
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{complaint.description}</p>
      <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Category</dt>
          <Tag aria-hidden="true" className="size-3.5" />
          <dd>{complaint.category}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Location</dt>
          <MapPin aria-hidden="true" className="size-3.5" />
          <dd>{complaint.location}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Submitted</dt>
          <dd>{formatDate(complaint.created_at)}</dd>
        </div>
      </dl>
    </Link>
  );
}