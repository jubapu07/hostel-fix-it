import { Link } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, Menu, PlusCircle, Info, Building2, Sparkles } from "lucide-react";
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
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
        <Building2 aria-hidden="true" className="size-5" />
        <span className="absolute -top-1 -right-1 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-palette-peach opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-palette-peach" />
        </span>
      </span>
      <div className="flex flex-col">
        <span className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          HostelFix
        </span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <Sparkles className="size-3 text-palette-peach" />
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
          className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-xs",
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
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" }}
    >
      <Info aria-hidden="true" className="size-3.5" />
      About / Project Overview
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar/95 px-4 py-6 backdrop-blur-md lg:flex">
        <Logo />
        <div className="mt-8 flex-1">
          <p className="px-3 pb-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Menu
          </p>
          <NavLinks />
        </div>
        
        <div className="flex flex-col gap-2 border-t border-sidebar-border/80 pt-4">
          <ThemeToggle showLabel className="h-9 text-xs" />
          <SidebarFooterLink />
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu" className="rounded-lg">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-sidebar p-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mb-6">
                <Logo />
              </div>
              <NavLinks onNavigate={() => setOpen(false)} />
              <div className="mt-6 flex flex-col gap-2 border-t border-sidebar-border pt-4">
                <ThemeToggle showLabel onNavigate={() => setOpen(false)} className="text-xs" />
                <SidebarFooterLink onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className={cn("lg:pl-64")}>
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}