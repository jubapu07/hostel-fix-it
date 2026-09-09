import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin } from "lucide-react";

import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Complaint } from "@/types/complaint";

export function ComplaintTable({ complaints }: { complaints: Complaint[] }) {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-card)]">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">List of hostel complaints</caption>
        <thead>
          <tr className="border-b border-border/80 bg-secondary/60">
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Complaint
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Priority
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Location
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Submitted
            </th>
            <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {complaints.map((complaint) => (
            <tr
              key={complaint.id}
              className="group transition-colors duration-150 hover:bg-secondary/40"
            >
              <td className="max-w-[20rem] px-5 py-4">
                <Link
                  to="/complaints/$id"
                  params={{ id: complaint.id }}
                  className="font-semibold text-foreground transition-colors group-hover:text-primary underline-offset-4 hover:underline"
                >
                  {complaint.title}
                </Link>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {complaint.description}
                </p>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="inline-flex rounded-lg bg-secondary/80 px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  {complaint.category}
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <PriorityBadge priority={complaint.priority} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground/80" />
                  {complaint.location}
                </span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap">
                <StatusBadge status={complaint.status} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                {formatDate(complaint.created_at)}
              </td>
              <td className="px-5 py-4 text-right whitespace-nowrap">
                <Link
                  to="/complaints/$id"
                  params={{ id: complaint.id }}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-all duration-150 hover:bg-primary/10"
                >
                  <span>View</span>
                  <ChevronRight aria-hidden="true" className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}