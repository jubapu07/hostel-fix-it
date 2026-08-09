import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchX, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { ComplaintTable } from "@/components/complaints/ComplaintTable";
import { defaultFilters, FilterBar, filterComplaints } from "@/components/complaints/FilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useComplaints } from "@/hooks/use-complaints";

export const Route = createFileRoute("/complaints/")({
  head: () => ({
    meta: [
      { title: "Complaints — HostelFix" },
      {
        name: "description",
        content:
          "Search, filter and manage every hostel complaint by status, category and location.",
      },
      { property: "og:title", content: "Complaints — HostelFix" },
      {
        property: "og:description",
        content: "View, search and manage hostel complaints.",
      },
    ],
  }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const { data: complaints, isPending, isError, error, refetch } = useComplaints();
  const [filters, setFilters] = useState(defaultFilters);

  const locations = useMemo(
    () => Array.from(new Set((complaints ?? []).map((c) => c.location))).sort(),
    [complaints],
  );

  const visible = useMemo(
    () => filterComplaints(complaints ?? [], filters),
    [complaints, filters],
  );
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "All" ||
    filters.category !== "All" ||
    filters.location !== "All" ||
    filters.priority !== "All" ||
    filters.sort !== "newest";

  return (
    <AppShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Complaints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, search and manage hostel complaints.
          </p>
        </div>
        <Button asChild>
          <Link to="/submit">
            <Plus aria-hidden="true" className="size-4" />
            Submit Complaint
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <FilterBar
          filters={filters}
          locations={locations}
          onChange={setFilters}
          onClear={() => setFilters(defaultFilters)}
        />
      </div>

      <div className="mt-5">
        {isPending ? (
          <LoadingState label="Loading complaints..." />
        ) : isError ? (
          <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />
        ) : complaints?.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <EmptyState
              icon={SearchX}
              title="No complaints yet"
              description="Submit your first complaint to start tracking hostel issues."
              action={
                <Button asChild>
                  <Link to="/submit">Submit Your First Complaint</Link>
                </Button>
              }
            />
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <EmptyState
              icon={SearchX}
              title="No complaints match your filters"
              description="Try changing your search or filters to find a complaint."
              action={
                <Button variant="outline" onClick={() => setFilters(defaultFilters)}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
              <span>Showing {visible.length} of {complaints?.length ?? 0} complaints</span>
              {hasActiveFilters ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                  Filters active
                </span>
              ) : null}
            </div>
            <ComplaintTable complaints={visible} />
            <div className="grid gap-3 lg:hidden">
              {visible.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
