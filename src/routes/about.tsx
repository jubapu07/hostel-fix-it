import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, ListChecks, Send, Wrench } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HostelFix — How It Works" },
      {
        name: "description",
        content:
          "Learn how HostelFix helps hostel residents report issues and helps wardens resolve maintenance, mess and cleanliness complaints faster.",
      },
      { property: "og:title", content: "About HostelFix — How It Works" },
      {
        property: "og:description",
        content: "How HostelFix helps residents and wardens resolve complaints faster.",
      },
    ],
  }),
  component: AboutPage,
});

const steps = [
  {
    icon: Send,
    title: "Report the issue",
    body: "Residents submit a complaint with a category, exact location and a clear description.",
  },
  {
    icon: ListChecks,
    title: "Warden reviews",
    body: "The hostel team sees every open complaint in one list and moves it to In Progress.",
  },
  {
    icon: Wrench,
    title: "Work happens",
    body: "Maintenance staff act on the issue while the status stays visible to everyone.",
  },
  {
    icon: ClipboardList,
    title: "Resolved and tracked",
    body: "Once fixed, the complaint is marked Resolved and stays on record for accountability.",
  },
];

function AboutPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">About HostelFix</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          HostelFix replaces paper registers and scattered WhatsApp messages with a single, shared
          record of every hostel issue. Residents always know where their complaint stands, and
          wardens always know what needs attention first.
        </p>

        <h2 className="mt-10 text-lg font-semibold text-foreground">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <step.icon aria-hidden="true" className="size-4.5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-10 text-lg font-semibold text-foreground">What you can report</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Electrical faults, plumbing and water problems, cleanliness, mess and food quality,
          furniture damage, internet issues, security concerns and anything else that affects daily
          hostel life.
        </p>

        <div className="mt-10 rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold text-foreground">Something broken right now?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            It takes less than a minute to file a complaint.
          </p>
          <Button asChild className="mt-4">
            <Link to="/submit">Submit a Complaint</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
