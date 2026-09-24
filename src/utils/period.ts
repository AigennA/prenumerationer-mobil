import { Prenumeration } from "@/types/prenumeration";
import { daysBetween, getToday } from "@/utils/date";

export type Period = {
  percent: number;
  text: string;
};

function formatDays(days: number) {
  return `${days} ${days === 1 ? "dag" : "dagar"}`;
}

export function getPeriod(prenumeration: Prenumeration): Period | null {
  const { startDate, endDate } = prenumeration;
  if (!startDate || !endDate) return null;
  const today = getToday();
  const total = daysBetween(startDate, endDate);
  const passed = daysBetween(startDate, today);
  const percent = total > 0 ? Math.min(100, Math.max(0, Math.round((passed / total) * 100))) : 100;

  let text = `${formatDays(daysBetween(today, endDate))} kvar`;
  if (today < startDate) text = `Startar om ${formatDays(daysBetween(today, startDate))}`;
  else if (today > endDate) text = "Utgången";
  else if (today === endDate) text = "Slutar i dag";

  return { percent, text };
}
