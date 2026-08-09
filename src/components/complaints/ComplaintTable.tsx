import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { StatusBadge } from "@/components/complaints/StatusBadge";
import { formatDate } from "@/lib/format";
import type { Complaint } from "@/types/complaint";

export function ComplaintTable({ complaints }: { complaints: Complaint[] }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] md:block">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">List of hostel complaints</caption>
        <thead>
          <tr className="border-b border-border bg-secondary/60">
            <th scope="col" className="px-5 py-3 font-medium text-muted-foreground">
              Complaint
            </th>
            <th scope="col" className="px-5 py-3 font-medium text-muted-foreground">
              Category
            </th>
            <th scope="col" className="px-5 py-3 font-medium text-muted-foreground">
              Location
            </th>
            <th scope="col" className="px-5 py-3 font-medium text-muted-foreground">
              Status
            </th>
            <th scope="col" className="px-5 py-3 font-medium text-muted-foreground">
              Submitted
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr
              key={complaint.id}
              className="border-b border-border transition-colors last:border-0 hover:bg-secondary/50"
            >
              <td className="max-w-[22rem] px-5 py-4">
                <Link
                  to="/complaints/$id"
                  params={{ id: complaint.id }}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {complaint.title}
                </Link>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {complaint.description}
                </p>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                {complaint.category}
              </td>
              <td className="px-5 py-4 text-muted-foreground">{complaint.location}</td>
              <td className="px-5 py-4">
                <StatusBadge status={complaint.status} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                {formatDate(complaint.created_at)}
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  to="/complaints/$id"
                  params={{ id: complaint.id }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View
                  <ChevronRight aria-hidden="true" className="size-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}