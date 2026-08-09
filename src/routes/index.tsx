import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CircleDot, ClipboardList, Inbox, Loader, Plus } from "lucide-react";

import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { ComplaintTable } from "@/components/complaints/ComplaintTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { CardsLoadingState, LoadingState } from "@/components/common/LoadingState";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useComplaints } from "@/hooks/use-complaints";
import { greeting } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — HostelFix" },
      {
        name: "description",
        content:
          "See open, in-progress and resolved hostel complaints at a glance and track what needs attention today.",
      },
      { property: "og:title", content: "Dashboard — HostelFix" },
      {
        property: "og:description",
        content: "Track and manage hostel complaints in one place.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: complaints, isPending, isError, error, refetch } = useComplaints();

  const total = complaints?.length ?? 0;
  const open = complaints?.filter((c) => c.status === "Open").length ?? 0;
  const inProgress = complaints?.filter((c) => c.status === "In Progress").length ?? 0;
  const resolved = complaints?.filter((c) => c.status === "Resolved").length ?? 0;
  const recent = complaints?.slice(0, 5) ?? [];
  const percent = (value: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

  return (
    <AppShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{greeting()}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage hostel complaints in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/submit">
            <Plus aria-hidden="true" className="size-4" />
            Submit Complaint
          </Link>
        </Button>
      </div>

      <section className="mt-7" aria-label="Complaint summary">
        {isPending ? (
          <CardsLoadingState />
        ) : isError ? (
          <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Complaints"
              value={total}
              hint="All complaints ever submitted"
              icon={ClipboardList}
            />
            <StatCard
              label="Open"
              value={open}
              hint={`${percent(open)}% awaiting first action`}
              icon={CircleDot}
              accentClassName="text-status-open"
            />
            <StatCard
              label="In Progress"
              value={inProgress}
              hint={`${percent(inProgress)}% currently being fixed`}
              icon={Loader}
              accentClassName="text-status-progress"
            />
            <StatCard
              label="Resolved"
              value={resolved}
              hint={`${percent(resolved)}% closed successfully`}
              icon={CheckCircle2}
              accentClassName="text-status-resolved"
            />
          </div>
        )}
      </section>

      {!isPending && !isError && total > 0 ? (
        <section className="mt-6" aria-label="Status overview">
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <h2 className="text-sm font-semibold text-foreground">Status overview</h2>
            <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="bg-status-open" style={{ width: `${percent(open)}%` }} />
              <div className="bg-status-progress" style={{ width: `${percent(inProgress)}%` }} />
              <div className="bg-status-resolved" style={{ width: `${percent(resolved)}%` }} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Open", value: open, dot: "bg-status-open" },
                { label: "In Progress", value: inProgress, dot: "bg-status-progress" },
                { label: "Resolved", value: resolved, dot: "bg-status-resolved" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span aria-hidden="true" className={`size-2 rounded-full ${item.dot}`} />
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium text-foreground tabular-nums">
                    {item.value} ({percent(item.value)}%)
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className="mt-8" aria-label="Recent complaints">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Complaints</h2>
          <Link
            to="/complaints"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-4">
          {isPending ? (
            <LoadingState label="Loading complaints..." />
          ) : isError ? (
            <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />
          ) : recent.length === 0 ? (
            <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
              <EmptyState
                icon={Inbox}
                title="No complaints yet"
                description="When someone reports an issue in the hostel, it will show up here."
                action={
                  <Button asChild>
                    <Link to="/submit">Submit the first complaint</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <ComplaintTable complaints={recent} />
              <div className="grid gap-3 lg:hidden">
                {recent.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
}
