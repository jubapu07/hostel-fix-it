import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Inbox,
  Plus,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";

import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { ComplaintTable } from "@/components/complaints/ComplaintTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { CardsLoadingState, LoadingState } from "@/components/common/LoadingState";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useComplaints } from "@/hooks/use-complaints";
import { fetchComplaints } from "@/lib/complaints";
import { greeting } from "@/lib/format";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await fetchComplaints();
    } catch {
      return [];
    }
  },
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
  const loaderData = Route.useLoaderData();
  const { data = loaderData, isPending: queryPending, isError, error, refetch } = useComplaints();
  const complaints = data ?? loaderData ?? [];
  const isPending = queryPending && complaints.length === 0;

  const total = complaints?.length ?? 0;
  const open = complaints?.filter((c) => c.status === "Open").length ?? 0;
  const inProgress = complaints?.filter((c) => c.status === "In Progress").length ?? 0;
  const resolved = complaints?.filter((c) => c.status === "Resolved").length ?? 0;
  const recent = complaints?.slice(0, 5) ?? [];
  const percent = (value: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

  return (
    <AppShell>
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-card p-6 shadow-xs sm:p-8 dark:border-border/70">
        <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-terracotta/5 blur-3xl" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-deep-teal dark:text-foreground sm:text-3xl">
              {greeting()}
            </h1>
            <p className="mt-1.5 text-sm text-slate-grey dark:text-muted-foreground sm:text-base">
              Track and resolve hostel issues seamlessly across all wings and blocks.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-terracotta px-6 py-2.5 font-bold text-white shadow-md shadow-terracotta/25 hover:bg-terracotta/90 hover:shadow-lg transition-all duration-200 shrink-0"
          >
            <Link to="/submit" className="gap-2">
              <Plus aria-hidden="true" className="size-4.5" />
              Submit Complaint
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards (4-Column Grid) */}
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
              icon={TrendingUp}
              pillLabel="All time"
              progressPercent={100}
              ringColor="stroke-slate-400 dark:stroke-slate-500"
              iconBgColor="bg-slate-100 dark:bg-slate-800"
              iconTextColor="text-slate-700 dark:text-slate-300"
            />
            <StatCard
              label="Pending Triage"
              value={open}
              hint={`${percent(open)}% awaiting inspection`}
              icon={AlertTriangle}
              pillLabel={`${percent(open)}%`}
              pillClassName="bg-amber-100/90 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              progressPercent={percent(open)}
              ringColor="stroke-amber-500"
              iconBgColor="bg-amber-50 dark:bg-amber-950/60"
              iconTextColor="text-amber-600 dark:text-amber-400"
            />
            <StatCard
              label="In Repair"
              value={inProgress}
              hint={`${percent(inProgress)}% actively assigned`}
              icon={Wrench}
              pillLabel={`${percent(inProgress)}%`}
              pillClassName="bg-cyan-teal/15 text-[#0A8E9F] dark:text-cyan-teal"
              progressPercent={percent(inProgress)}
              ringColor="stroke-cyan-teal"
              iconBgColor="bg-cyan-teal/15"
              iconTextColor="text-cyan-teal"
            />
            <StatCard
              label="Resolved"
              value={resolved}
              hint={`${percent(resolved)}% closed satisfactorily`}
              icon={CheckCircle2}
              pillLabel={`${percent(resolved)}%`}
              pillClassName="bg-emerald-green/15 text-[#1E824C] dark:text-emerald-green"
              progressPercent={percent(resolved)}
              ringColor="stroke-emerald-green"
              iconBgColor="bg-emerald-green/15"
              iconTextColor="text-emerald-green"
            />
          </div>
        )}
      </section>

      {/* Resolution Progress Bar */}
      {!isPending && !isError && total > 0 ? (
        <section className="mt-6" aria-label="Status overview">
          <div className="rounded-2xl border border-slate-200/70 bg-card p-5.5 shadow-xs dark:border-border/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-terracotta" />
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Resolution Progress
                </h2>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {resolved} of {total} Resolved ({percent(resolved)}%)
              </span>
            </div>

            {/* Segmented Multi-Color Progress Track */}
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-secondary p-0.5 shadow-inner">
              <div
                className="rounded-l-full bg-terracotta transition-all duration-500"
                style={{ width: `${percent(open)}%` }}
                title={`Open: ${percent(open)}%`}
              />
              <div
                className="bg-cyan-teal transition-all duration-500"
                style={{ width: `${percent(inProgress)}%` }}
                title={`In Progress: ${percent(inProgress)}%`}
              />
              <div
                className="rounded-r-full bg-emerald-green transition-all duration-500"
                style={{ width: `${percent(resolved)}%` }}
                title={`Resolved: ${percent(resolved)}%`}
              />
            </div>

            {/* Bottom Legend */}
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Open Issues", value: open, dot: "bg-terracotta" },
                { label: "In Progress", value: inProgress, dot: "bg-cyan-teal" },
                { label: "Resolved", value: resolved, dot: "bg-emerald-green" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/50 px-3.5 py-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className={`size-2.5 rounded-full ${item.dot}`} />
                    <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
                  </div>
                  <dd className="font-bold text-foreground tabular-nums text-sm">
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

      {/* Recent Complaints Section */}
      <section className="mt-8" aria-label="Recent complaints">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Recent Complaints</h2>
            <p className="text-xs text-muted-foreground">Latest reported maintenance issues</p>
          </div>
          <Link
            to="/complaints"
            className="group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-terracotta transition-colors hover:bg-terracotta/10"
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
            <div className="rounded-2xl border border-slate-200/70 bg-card p-8 shadow-xs dark:border-border/70">
              <EmptyState
                icon={Inbox}
                title="No complaints yet"
                description="When someone reports an issue in the hostel, it will show up here."
                action={
                  <Button asChild className="rounded-full bg-terracotta text-white font-bold px-5">
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
