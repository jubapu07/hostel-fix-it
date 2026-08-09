import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { StatusTimeline } from "@/components/complaints/StatusTimeline";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useComplaint, useUpdateComplaint } from "@/hooks/use-complaints";
import { formatDateTime, formatRelative } from "@/lib/format";

export const Route = createFileRoute("/complaints/$id")({
  head: () => ({
    meta: [
      { title: "Complaint Details — HostelFix" },
      {
        name: "description",
        content:
          "View the full details of a hostel complaint, follow its status timeline and update it as work progresses.",
      },
      { property: "og:title", content: "Complaint Details — HostelFix" },
      {
        property: "og:description",
        content: "Follow a hostel complaint from report to resolution.",
      },
    ],
  }),
  component: ComplaintDetailPage,
});

function ComplaintDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: complaint, isPending, isError, error, refetch } = useComplaint(id);
  const updateComplaint = useUpdateComplaint(id);
  const [isEditing, setIsEditing] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

  function moveToNextStatus(nextStatus: "In Progress" | "Resolved") {
    updateComplaint.mutate(
      { status: nextStatus },
      {
        onSuccess: () => {
          if (nextStatus === "Resolved") setIsResolveDialogOpen(false);
          toast.success(
            nextStatus === "In Progress"
              ? "Complaint moved to In Progress."
              : "Complaint resolved successfully.",
          );
        },
        onError: (mutationError: Error) =>
          toast.error("Could not update status", { description: mutationError.message }),
      },
    );
  }

  return (
    <AppShell>
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/complaints">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to complaints
        </Link>
      </Button>

      <div className="mt-4">
        {isPending ? (
          <LoadingState label="Loading complaint..." />
        ) : isError ? (
          <ErrorState message={(error as Error).message} onRetry={() => void refetch()} />
        ) : !complaint ? (
          <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <EmptyState
              icon={FileQuestion}
              title="Complaint not found"
              description="This complaint may have been removed or the link is incorrect."
              action={
                <Button asChild>
                  <Link to="/complaints">Back to complaints</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                {isEditing ? (
                  <>
                    <h1 className="text-lg font-semibold text-foreground">Edit complaint</h1>
                    <div className="mt-5">
                      <ComplaintForm
                        defaultValues={complaint}
                        submitLabel="Save changes"
                        pendingLabel="Saving..."
                        isPending={updateComplaint.isPending}
                        onCancel={() => setIsEditing(false)}
                        onSubmit={(values) => {
                          updateComplaint.mutate(values, {
                            onSuccess: () => {
                              toast.success("Complaint updated successfully.");
                              setIsEditing(false);
                            },
                            onError: (mutationError: Error) => {
                              toast.error("Could not update complaint", {
                                description: mutationError.message,
                              });
                            },
                          });
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />
                      <span className="text-xs text-muted-foreground">
                        Reported {formatRelative(complaint.created_at)}
                      </span>
                    </div>
                    <h1 className="mt-3 text-2xl font-bold text-foreground">{complaint.title}</h1>
                    <p className="mt-1 break-all text-xs text-muted-foreground">
                      Complaint ID: {complaint.id}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                      {complaint.description}
                    </p>
                    <div className="mt-6">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Pencil aria-hidden="true" className="size-4" />
                        Edit complaint
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
                <h2 className="text-sm font-semibold text-foreground">Progress</h2>
                <div className="mt-5">
                  <StatusTimeline status={complaint.status} />
                </div>
              </div>
            </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <h2 className="text-sm font-semibold text-foreground">Update status</h2>
                  {complaint.status === "Resolved" ? (
                    <Button className="mt-2 w-full" disabled>
                      Complaint Resolved
                    </Button>
                  ) : complaint.status === "In Progress" ? (
                    <AlertDialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button className="mt-2 w-full" disabled={updateComplaint.isPending}>
                          Resolve Complaint
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Resolve this complaint?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Once resolved, this complaint cannot be moved back to an earlier stage.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={updateComplaint.isPending}>Cancel</AlertDialogCancel>
                          <Button
                            onClick={() => moveToNextStatus("Resolved")}
                            disabled={updateComplaint.isPending}
                          >
                            {updateComplaint.isPending ? "Resolving..." : "Resolve Complaint"}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      className="mt-2 w-full"
                      disabled={updateComplaint.isPending}
                      onClick={() => moveToNextStatus("In Progress")}
                    >
                      {updateComplaint.isPending ? "Updating..." : "Mark In Progress"}
                    </Button>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {complaint.status === "Resolved"
                      ? "This complaint has completed its lifecycle."
                      : complaint.status === "In Progress"
                        ? "Resolve this complaint when the issue has been fixed."
                        : "The next status is saved immediately and visible to everyone."}
                  </p>
                </div>

              <dl className="space-y-4 rounded-xl border border-border bg-card p-5 text-sm shadow-[var(--shadow-card)]">
                <div>
                  <dt className="text-xs text-muted-foreground">Category</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{complaint.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Location</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{complaint.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Submitted</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {formatDateTime(complaint.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Last updated</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {formatDateTime(complaint.updated_at)}
                  </dd>
                </div>
              </dl>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => void navigate({ to: "/submit" })}
              >
                Submit another complaint
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
