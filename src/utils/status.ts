import { Prenumeration } from "@/types/prenumeration";

export type Status = "active" | "pending" | "inactive";

export function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getStatus(prenumeration: Prenumeration): Status {
  if (!prenumeration.isActive) return "inactive";
  if (prenumeration.startDate && prenumeration.startDate > getToday()) return "pending";
  return "active";
}
