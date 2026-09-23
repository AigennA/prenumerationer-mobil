import { Prenumeration } from "@/types/prenumeration";
import { getToday } from "@/utils/date";

export type Status = "active" | "pending" | "inactive";

export function getStatus(prenumeration: Prenumeration): Status {
  if (!prenumeration.isActive) return "inactive";
  if (prenumeration.startDate && prenumeration.startDate > getToday()) return "pending";
  return "active";
}
