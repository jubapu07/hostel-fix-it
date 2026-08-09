import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, STATUSES } from "@/types/complaint";

export interface Filters {
  search: string;
  status: string;
  category: string;
  location: string;
  sort: "newest" | "oldest";
}

export const defaultFilters: Filters = {
  search: "",
  status: "All",
  category: "All",
  location: "All",
  sort: "newest",
};

export function FilterBar({
  filters,
  locations,
  onChange,
  onClear,
}: {
  filters: Filters;
  locations: string[];
  onChange: (next: Filters) => void;
  onClear: () => void;
}) {
  const isFiltered =
    filters.search.trim() !== "" ||
    filters.status !== "All" ||
    filters.category !== "All" ||
    filters.location !== "All" ||
    filters.sort !== "newest";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Label htmlFor="complaint-search" className="sr-only">
          Search complaints
        </Label>
        <Input
          id="complaint-search"
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search complaints..."
          className="pl-9"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="filter-status" className="text-xs text-muted-foreground">
            Status
          </Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onChange({ ...filters, status: value })}
          >
            <SelectTrigger id="filter-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-category" className="text-xs text-muted-foreground">
            Category
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) => onChange({ ...filters, category: value })}
          >
            <SelectTrigger id="filter-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-location" className="text-xs text-muted-foreground">
            Location
          </Label>
          <Select
            value={filters.location}
            onValueChange={(value) => onChange({ ...filters, location: value })}
          >
            <SelectTrigger id="filter-location" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-sort" className="text-xs text-muted-foreground">
            Sort
          </Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => onChange({ ...filters, sort: value as Filters["sort"] })}
          >
            <SelectTrigger id="filter-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFiltered ? (
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X aria-hidden="true" className="size-3.5" />
            Clear filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function filterComplaints<
  T extends {
    title: string;
    description: string;
    location: string;
    category: string;
    status: string;
    created_at: string;
  },
>(complaints: T[], filters: Filters): T[] {
  const term = filters.search.trim().toLowerCase();

  const result = complaints.filter((complaint) => {
    const matchesSearch =
      term === "" ||
      complaint.title.toLowerCase().includes(term) ||
      complaint.description.toLowerCase().includes(term) ||
      complaint.location.toLowerCase().includes(term);
    const matchesStatus = filters.status === "All" || complaint.status === filters.status;
    const matchesCategory = filters.category === "All" || complaint.category === filters.category;
    const matchesLocation = filters.location === "All" || complaint.location === filters.location;
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  return result.sort((a, b) => {
    const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return filters.sort === "newest" ? diff : -diff;
  });
}