import { supabase } from "@/integrations/supabase/client";
import type { Complaint, ComplaintInput, ComplaintUpdate } from "@/types/complaint";

const STORAGE_KEY = "hostelfix_complaints_v1";

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: "c1a89f2d-4e56-47b1-9b12-a1b2c3d4e5f1",
    title: "Ceiling fan not working",
    category: "Electrical",
    location: "Block A - Room 204",
    description:
      "The ceiling fan stopped working two days ago. It makes a humming noise but the blades do not rotate. Room gets very hot in the afternoon.",
    priority: "High",
    status: "Open",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c2b89f2d-4e56-47b1-9b12-a1b2c3d4e5f2",
    title: "Water leakage near washroom",
    category: "Plumbing",
    location: "Block B - First Floor",
    description:
      "There is continuous water leakage from the pipe outside the common washroom. The corridor floor stays wet and is slippery.",
    priority: "High",
    status: "In Progress",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c3c89f2d-4e56-47b1-9b12-a1b2c3d4e5f3",
    title: "Mess food quality issue",
    category: "Mess",
    location: "Main Hostel Mess",
    description:
      "Dinner has been served cold for the past week and the dal is watery. Requesting the mess committee to review the evening menu and serving times.",
    priority: "Medium",
    status: "Resolved",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c4d89f2d-4e56-47b1-9b12-a1b2c3d4e5f4",
    title: "Wi-Fi disconnects frequently at night",
    category: "Internet",
    location: "Block C - Second Floor",
    description:
      "The Wi-Fi drops every few minutes after 10 PM. Difficult to attend online classes and submit assignments.",
    priority: "Medium",
    status: "Open",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c5e89f2d-4e56-47b1-9b12-a1b2c3d4e5f5",
    title: "Broken study chair",
    category: "Furniture",
    location: "Block A - Room 118",
    description:
      "One leg of the study chair is cracked and it wobbles badly. Needs repair or replacement.",
    priority: "Low",
    status: "In Progress",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "c6f89f2d-4e56-47b1-9b12-a1b2c3d4e5f6",
    title: "Corridor not cleaned regularly",
    category: "Cleaning",
    location: "Block B - Ground Floor",
    description:
      "The corridor and staircase have not been swept for several days. Dust and wrappers are collecting near the entrance.",
    priority: "Low",
    status: "Open",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// In-memory store fallback for SSR
let memoryStore = [...SEED_COMPLAINTS];

function getLocalComplaints(): Complaint[] {
  if (typeof window === "undefined") {
    return memoryStore;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COMPLAINTS));
      return SEED_COMPLAINTS;
    }
    return JSON.parse(raw) as Complaint[];
  } catch {
    return SEED_COMPLAINTS;
  }
}

function saveLocalComplaints(complaints: Complaint[]): void {
  if (typeof window === "undefined") {
    memoryStore = complaints;
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (err) {
    console.error("Failed to persist complaints to localStorage", err);
  }
}

/**
 * Fetch complaints with graceful fallback to local persistent storage.
 */
export async function fetchComplaints(): Promise<Complaint[]> {
  try {
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 1500)
    );

    const fetchPromise = supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = (await Promise.race([fetchPromise, timeoutPromise])) as {
      data: Complaint[] | null;
      error: Error | null;
    };

    if (error || !data || data.length === 0) {
      return getLocalComplaints();
    }
    return data as Complaint[];
  } catch {
    return getLocalComplaints();
  }
}

/**
 * Fetch single complaint by ID with fallback.
 */
export async function fetchComplaint(id: string): Promise<Complaint> {
  try {
    const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 1500)
    );

    const fetchPromise = supabase.from("complaints").select("*").eq("id", id).maybeSingle();

    const { data, error } = (await Promise.race([fetchPromise, timeoutPromise])) as {
      data: Complaint | null;
      error: Error | null;
    };

    if (!error && data) {
      return data as Complaint;
    }
  } catch {
    // Fall back to local storage below
  }

  const local = getLocalComplaints().find((c) => c.id === id);
  if (!local) {
    throw new Error("This complaint no longer exists. It may have been removed.");
  }
  return local;
}

/**
 * Create a new complaint. Persists to local store immediately and syncs to Supabase if available.
 */
export async function createComplaint(input: ComplaintInput): Promise<Complaint> {
  const newComplaint: Complaint = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cmp_${Date.now()}`,
    title: input.title.trim(),
    category: input.category,
    location: input.location.trim(),
    description: input.description.trim(),
    priority: input.priority,
    status: "Open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const existing = getLocalComplaints();
  const updated = [newComplaint, ...existing];
  saveLocalComplaints(updated);

  // Background attempt to write to Supabase
  try {
    void supabase.from("complaints").insert({
      id: newComplaint.id,
      title: newComplaint.title,
      category: newComplaint.category,
      location: newComplaint.location,
      description: newComplaint.description,
      priority: newComplaint.priority,
      status: newComplaint.status,
    });
  } catch {
    // Supabase unavailable; local store has already been updated
  }

  return newComplaint;
}

/**
 * Update a complaint's fields or status.
 */
export async function updateComplaint(id: string, patch: ComplaintUpdate): Promise<Complaint> {
  const existing = getLocalComplaints();
  const target = existing.find((c) => c.id === id);

  if (!target) {
    throw new Error("Complaint not found.");
  }

  const updatedItem: Complaint = {
    ...target,
    ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
    ...(patch.category !== undefined ? { category: patch.category } : {}),
    ...(patch.location !== undefined ? { location: patch.location.trim() } : {}),
    ...(patch.description !== undefined ? { description: patch.description.trim() } : {}),
    ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    updated_at: new Date().toISOString(),
  };

  const nextList = existing.map((c) => (c.id === id ? updatedItem : c));
  saveLocalComplaints(nextList);

  // Background attempt to sync to Supabase
  try {
    void supabase.from("complaints").update(patch).eq("id", id);
  } catch {
    // Supabase unavailable; local store has already been updated
  }

  return updatedItem;
}