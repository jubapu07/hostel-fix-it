import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createComplaint,
  fetchComplaint,
  fetchComplaints,
  updateComplaint,
} from "@/lib/complaints";
import type { ComplaintInput, ComplaintUpdate } from "@/types/complaint";

export const complaintKeys = {
  all: ["complaints"] as const,
  detail: (id: string) => ["complaints", id] as const,
};

export function useComplaints() {
  return useQuery({
    queryKey: complaintKeys.all,
    queryFn: fetchComplaints,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: complaintKeys.detail(id),
    queryFn: () => fetchComplaint(id),
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ComplaintInput) => createComplaint(input),
    onSuccess: (complaint) => {
      queryClient.setQueryData(complaintKeys.detail(complaint.id), complaint);
      void queryClient.invalidateQueries({ queryKey: complaintKeys.all });
    },
  });
}

export function useUpdateComplaint(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: ComplaintUpdate) => updateComplaint(id, patch),
    onSuccess: (complaint) => {
      queryClient.setQueryData(complaintKeys.detail(complaint.id), complaint);
      void queryClient.invalidateQueries({ queryKey: complaintKeys.all });
    },
  });
}