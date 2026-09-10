import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Bell,
  Info,
  LayoutDashboard,
  ListChecks,
  Menu,
  PlusCircle,
  Search,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/complaints", label: "Complaints", icon: ListChecks },
  { to: "/submit", label: "Submit Complaint", icon: PlusCircle },
] as const;

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="relative flex size-10 items-center justify-center rounded-xl bg-deep-teal text-white shadow-md transition-transform duration-200 group-hover:scale-105 dark:bg-card dark:border dark:border-border/70">
        <Building2 aria-hidden="true" className="size-5.5 text-terracotta" />
      </span>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          HostelFix
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          Resident Portal
        </span>
      </div>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-1.5">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          activeProps={{
            className: "bg-secondary font-semibold text-primary shadow-xs border border-border/40",
            "aria-current": "page",
          }}
        >
          <Icon aria-hidden="true" className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarFooterLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/about"
      onClick={onNavigate}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "bg-secondary text-primary font-semibold" }}
    >
      <Info aria-hidden="true" className="size-3.5" />
      About / Project Overview
    </Link>
  );
}

function LiveOperationsBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs",
        className
      )}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      <span>Hostel Operations Live</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate({
        to: "/complaints",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Fixed Left Navigation Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/95 px-4 py-6 backdrop-blur-md lg:flex shadow-xs">
        <Logo />
        <div className="mt-8 flex-1">
          <p className="px-3 pb-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Menu
          </p>
          <NavLinks />
        </div>

        {/* Bottom utility dock */}
        <div className="flex flex-col gap-2 border-t border-sidebar-border/80 pt-4">
          <ThemeToggle showLabel className="h-9 text-xs" />
          <SidebarFooterLink />
        </div>
      </aside>

      {/* Main Content Area with Sticky Top Header Bar */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md transition-colors">
          <div className="flex items-center gap-3 md:gap-5 flex-1 max-w-2xl">
            {/* Mobile Sheet Trigger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu" className="rounded-xl lg:hidden size-9">
                  <Menu className="size-4.5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="mb-6">
                  <Logo />
                </div>
                <NavLinks onNavigate={() => setOpen(false)} />
                <div className="mt-8 flex flex-col gap-2 border-t border-sidebar-border pt-4">
                  <ThemeToggle showLabel onNavigate={() => setOpen(false)} className="text-xs" />
                  <SidebarFooterLink onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Live Operations Badge on Desktop */}
            <div className="hidden sm:flex">
              <LiveOperationsBadge />
            </div>

            {/* Global Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints, rooms, categories..."
                className="h-9.5 w-full rounded-xl border border-border/80 bg-card/90 pl-9.5 pr-4 text-xs text-foreground placeholder:text-muted-foreground/70 shadow-2xs transition-all focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </form>
          </div>

          {/* Right utility items: Notifications, ThemeToggle, User Profile Chip */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-2xs"
            >
              <Bell className="size-4.5" />
              <span className="absolute top-1.5 right-1.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-terracotta" />
              </span>
            </button>

            {/* Desktop Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* User Avatar Profile Chip */}
            <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card p-1 sm:px-2.5 sm:py-1.5 shadow-2xs transition-colors hover:border-border">
              <div className="flex size-7.5 items-center justify-center rounded-lg bg-deep-teal text-[11px] font-bold text-white shadow-xs dark:bg-terracotta">
                AR
              </div>
              <div className="hidden flex-col text-left sm:flex pr-1">
                <span className="text-xs font-semibold leading-tight text-foreground">Ahmed R.</span>
                <span className="text-[10px] text-muted-foreground leading-tight">Room 204 • Block A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}