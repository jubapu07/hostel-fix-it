import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { ComplaintForm } from "@/components/complaints/ComplaintForm";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateComplaint } from "@/hooks/use-complaints";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Complaint — HostelFix" },
      {
        name: "description",
        content:
          "Report a hostel issue in under a minute: add a title, category, location and description, and track it to resolution.",
      },
      { property: "og:title", content: "Submit a Complaint — HostelFix" },
      {
        property: "og:description",
        content: "Report a hostel issue and track it until it is resolved.",
      },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const navigate = useNavigate();
  const createComplaint = useCreateComplaint();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Submit a Complaint</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Give us the details and the hostel team will pick it up from here.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
          <ComplaintForm
            submitLabel="Submit Complaint"
            pendingLabel="Submitting..."
            isPending={createComplaint.isPending}
            onCancel={() => void navigate({ to: "/complaints" })}
            onSubmit={(values) => {
              createComplaint.mutate(values, {
                onSuccess: (complaint) => {
                  toast.success("Complaint submitted successfully.", {
                    description: "You can now track its progress.",
                  });
                  void navigate({ to: "/complaints/$id", params: { id: complaint.id } });
                },
                onError: (error: Error) => {
                  toast.error("Could not submit complaint", { description: error.message });
                },
              });
            }}
          />
        </div>
      </div>
    </AppShell>
  );
}
