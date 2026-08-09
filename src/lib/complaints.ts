import { supabase } from "@/integrations/supabase/client";
import type { Complaint, ComplaintInput, ComplaintUpdate } from "@/types/complaint";

/** Human-readable message for any database failure. Raw errors never reach the UI. */
function friendly(action: string): string {
  return `We couldn't ${action} right now. Please check your connection and try again.`;
}

function updateErrorMessage(error: { code?: string; message?: string } | null): string {
  if (error?.code === "P0001" && error.message?.startsWith("invalid complaint status transition")) {
    return "This complaint can only move to the next stage in its lifecycle.";
  }
  return friendly("save your changes");
}

export async function fetchComplaints(): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(friendly("load the complaints"));
  return (data ?? []) as Complaint[];
}

export async function fetchComplaint(id: string): Promise<Complaint> {
  const { data, error } = await supabase.from("complaints").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(friendly("load this complaint"));
  if (!data) throw new Error("This complaint no longer exists. It may have been removed.");
  return data as Complaint;
}

export async function createComplaint(input: ComplaintInput): Promise<Complaint> {
  const { data, error } = await supabase
    .from("complaints")
    .insert({
      title: input.title.trim(),
      category: input.category,
      location: input.location.trim(),
      description: input.description.trim(),
      priority: input.priority,
    })
    .select()
    .single();

  if (error || !data) throw new Error(friendly("submit your complaint"));
  return data as Complaint;
}

export async function updateComplaint(id: string, patch: ComplaintUpdate): Promise<Complaint> {
  const payload: {
    title?: string;
    category?: string;
    location?: string;
    description?: string;
    priority?: string;
    status?: string;
  } = {};
  if (patch.title !== undefined) payload.title = patch.title.trim();
  if (patch.category !== undefined) payload.category = patch.category;
  if (patch.location !== undefined) payload.location = patch.location.trim();
  if (patch.description !== undefined) payload.description = patch.description.trim();
  if (patch.priority !== undefined) payload.priority = patch.priority;
  if (patch.status !== undefined) payload.status = patch.status;

  const { data, error } = await supabase
    .from("complaints")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw new Error(updateErrorMessage(error));
  return data as Complaint;
}
