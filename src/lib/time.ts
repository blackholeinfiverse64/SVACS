import { format, formatDistanceStrict, parseISO } from "date-fns";

export const fmtUtc = (iso: string, pattern = "HH:mm:ss") =>
  format(parseISO(iso), pattern);

export const fmtUtcDate = (iso: string) =>
  format(parseISO(iso), "yyyy-MM-dd HH:mm:ss");

export const ageFrom = (iso: string, now: Date = new Date()) =>
  formatDistanceStrict(parseISO(iso), now, { addSuffix: false });

export const nowIso = () => new Date().toISOString();

export const nowUtcDisplay = () => format(new Date(), "yyyy-MM-dd HH:mm:ss");
