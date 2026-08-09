export const CATEGORIES = [
  "Maintenance",
  "Electrical",
  "Plumbing",
  "Mess",
  "Cleaning",
  "Internet",
  "Furniture",
  "Other",
] as const;

export const STATUSES = ["Open", "In Progress", "Resolved"] as const;

export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type Category = (typeof CATEGORIES)[number];
export type ComplaintStatus = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface Complaint {
  id: string;
  title: string;
  category: Category;
  location: string;
  description: string;
  priority: Priority;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
}

export interface ComplaintInput {
  title: string;
  category: Category;
  location: string;
  description: string;
  priority: Priority;
}

export type ComplaintUpdate = Partial<ComplaintInput> & { status?: ComplaintStatus };