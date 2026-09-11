import type { Complaint } from "@/types/complaint";
import { formatDateTime } from "@/lib/format";

/**
 * Escapes a cell value for standard CSV formatting (RFC 4180).
 */
function escapeCSVCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value);
  // Escape double quotes by doubling them
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Converts an array of complaints into a CSV string.
 */
export function convertComplaintsToCSV(complaints: Complaint[]): string {
  const headers = [
    "ID",
    "Title",
    "Category",
    "Location",
    "Priority",
    "Status",
    "Created At",
    "Updated At",
    "Description",
  ];

  const rows = complaints.map((c) => [
    c.id,
    c.title,
    c.category,
    c.location,
    c.priority,
    c.status,
    formatDateTime(c.created_at),
    formatDateTime(c.updated_at),
    c.description,
  ]);

  const csvContent = [
    headers.map(escapeCSVCell).join(","),
    ...rows.map((row) => row.map(escapeCSVCell).join(",")),
  ].join("\r\n");

  return csvContent;
}

/**
 * Generates and downloads a CSV file containing the provided complaints.
 */
export function exportComplaintsToCSV(
  complaints: Complaint[],
  fileNamePrefix: string = "hostel-complaints",
): boolean {
  if (!complaints || complaints.length === 0) {
    return false;
  }

  const csv = convertComplaintsToCSV(complaints);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `${fileNamePrefix}-${dateStr}.csv`;

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
