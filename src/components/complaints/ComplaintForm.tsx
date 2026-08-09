import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  PRIORITIES,
  type Category,
  type ComplaintInput,
  type Priority,
} from "@/types/complaint";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Give the complaint a title of at least 5 characters." })
    .max(120, { message: "Keep the title under 120 characters." }),
  category: z.enum(CATEGORIES, { message: "Select a category." }),
  location: z
    .string()
    .trim()
    .min(3, { message: "Add a location, e.g. Block A, Room 204." })
    .max(120, { message: "Keep the location under 120 characters." }),
  description: z
    .string()
    .trim()
    .min(15, { message: "Describe the issue in at least 15 characters." })
    .max(1500, { message: "Keep the description under 1500 characters." }),
  priority: z.enum(PRIORITIES),
});

type FieldErrors = Partial<Record<keyof ComplaintInput, string>>;

export interface ComplaintFormProps {
  defaultValues?: Partial<ComplaintInput>;
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onSubmit: (values: ComplaintInput) => void;
  onCancel?: () => void;
}

export function ComplaintForm({
  defaultValues,
  submitLabel,
  pendingLabel,
  isPending,
  onSubmit,
  onCancel,
}: ComplaintFormProps) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [category, setCategory] = useState<Category | "">(defaultValues?.category ?? "");
  const [location, setLocation] = useState(defaultValues?.location ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [priority, setPriority] = useState<Priority>(defaultValues?.priority ?? "Medium");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = schema.safeParse({ title, category, location, description, priority });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ComplaintInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">
          Complaint title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Water leakage in bathroom"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title ? (
          <p id="title-error" className="text-sm text-destructive">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
            <SelectTrigger
              id="category"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : undefined}
              className={cn("w-full", errors.category && "border-destructive")}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? (
            <p id="category-error" className="text-sm text-destructive">
              {errors.category}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="e.g. Block A, Room 204"
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-error" : undefined}
            className={cn(errors.location && "border-destructive")}
          />
          {errors.location ? (
            <p id="location-error" className="text-sm text-destructive">
              {errors.location}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          rows={6}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the issue clearly..."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : "description-hint"}
          className={cn(errors.description && "border-destructive")}
        />
        {errors.description ? (
          <p id="description-error" className="text-sm text-destructive">
            {errors.description}
          </p>
        ) : (
          <p id="description-hint" className="text-xs text-muted-foreground">
            Mention when the issue started and anything the warden should know.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">
          Priority <span className="text-destructive">*</span>
        </Label>
        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <SelectTrigger id="priority" className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row-reverse sm:justify-start">
        <Button type="submit" disabled={isPending} className="sm:w-auto">
          {isPending ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
