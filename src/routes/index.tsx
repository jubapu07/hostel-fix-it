import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, CircleDot, ClipboardList, Inbox, Loader2, Plus, Sparkles } from "lucide-react";

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
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/30 p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-palette-seafoam/40 bg-palette-seafoam/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-palette-seafoam">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-palette-seafoam opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-palette-seafoam" />
              </span>
              Hostel Operations Live
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {greeting()}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              Track and resolve hostel issues seamlessly across all wings and blocks.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30">
            <Link to="/submit" className="gap-2 font-semibold">
              <Plus aria-hidden="true" className="size-4.5" />
              Submit Complaint
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="mt-7" aria-label="Complaint summary">
        {isPending ? (
          <CardsLoadingState />
        ) : isError ? (
          <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Issues"
              value={total}
              hint="All complaints submitted"
              icon={ClipboardList}
              accentClassName="text-primary bg-primary/10 border-primary/20"
              pillLabel="All time"
            />
            <StatCard
              label="Pending Triage"
              value={open}
              hint={`${percent(open)}% awaiting inspection`}
              icon={CircleDot}
              accentClassName="text-status-open bg-status-open-bg border-status-open-border"
              pillLabel={`${percent(open)}%`}
            />
            <StatCard
              label="In Repair"
              value={inProgress}
              hint={`${percent(inProgress)}% actively assigned`}
              icon={Loader2}
              accentClassName="text-status-progress bg-status-progress-bg border-status-progress-border"
              pillLabel={`${percent(inProgress)}%`}
            />
            <StatCard
              label="Resolved"
              value={resolved}
              hint={`${percent(resolved)}% closed satisfactorily`}
              icon={CheckCircle2}
              accentClassName="text-status-resolved bg-status-resolved-bg border-status-resolved-border"
              pillLabel={`${percent(resolved)}%`}
            />
          </div>
        )}
      </section>

      {/* Modern Status Progress Bar */}
      {!isPending && !isError && total > 0 ? (
        <section className="mt-6" aria-label="Status overview">
          <div className="rounded-2xl border border-border/80 bg-card p-5.5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Resolution Progress
                </h2>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {resolved} of {total} Resolved ({percent(resolved)}%)
              </span>
            </div>

            {/* Glowing Segmented Progress */}
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-secondary/80 p-0.5 shadow-inner">
              <div
                className="rounded-l-full bg-status-open transition-all duration-500"
                style={{ width: `${percent(open)}%` }}
                title={`Open: ${percent(open)}%`}
              />
              <div
                className="bg-status-progress transition-all duration-500"
                style={{ width: `${percent(inProgress)}%` }}
                title={`In Progress: ${percent(inProgress)}%`}
              />
              <div
                className="rounded-r-full bg-status-resolved transition-all duration-500"
                style={{ width: `${percent(resolved)}%` }}
                title={`Resolved: ${percent(resolved)}%`}
              />
            </div>

            {/* Legend Pills */}
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Open Issues", value: open, dot: "bg-status-open", textClass: "text-status-open" },
                { label: "In Progress", value: inProgress, dot: "bg-status-progress", textClass: "text-status-progress" },
                { label: "Resolved", value: resolved, dot: "bg-status-resolved", textClass: "text-status-resolved" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/40 px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className={`size-2.5 rounded-full ${item.dot}`} />
                    <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
                  </div>
                  <dd className="font-semibold text-foreground tabular-nums text-sm">
                    {item.value}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({percent(item.value)}%)
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* Recent Activity Section */}
      <section className="mt-8" aria-label="Recent complaints">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Recent Complaints</h2>
            <p className="text-xs text-muted-foreground">Latest reported maintenance issues</p>
          </div>
          <Link
            to="/complaints"
            className="group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <span>View all complaints</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-4">
          {isPending ? (
            <LoadingState label="Loading complaints..." />
          ) : isError ? (
            <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />
          ) : recent.length === 0 ? (
            <div className="rounded-2xl border border-border/80 bg-card p-8 shadow-[var(--shadow-card)]">
              <EmptyState
                icon={Inbox}
                title="No complaints yet"
                description="When someone reports an issue in the hostel, it will show up here."
                action={
                  <Button asChild className="rounded-xl shadow-xs">
                    <Link to="/submit">Submit the first complaint</Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              <ComplaintTable complaints={recent} />
              <div className="grid gap-3 md:hidden">
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
