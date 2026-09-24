import { Prenumeration } from "@/types/prenumeration";
import { getToday, parseDate } from "@/utils/date";

export function formatPrice(price: number) {
  const value = Number.isInteger(price) ? String(price) : price.toFixed(2).replace(".", ",");
  return `${value} kr/mån`;
}

export function formatAmount(amount: number) {
  return `${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} kr`;
}

function countPayments(startDate: string, endDate: string) {
  if (startDate > endDate) return 0;
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  return months + 1;
}

export function getPaymentCount(prenumeration: Prenumeration) {
  if (!prenumeration.startDate) return 0;
  const today = getToday();
  const end = prenumeration.endDate && prenumeration.endDate < today ? prenumeration.endDate : today;
  return countPayments(prenumeration.startDate, end);
}

export function getPaidSoFar(prenumeration: Prenumeration, price: number) {
  return getPaymentCount(prenumeration) * price;
}
