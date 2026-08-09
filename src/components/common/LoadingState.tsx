import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex items-center gap-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CardsLoadingState({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl" />
      ))}
    </div>
  );
}