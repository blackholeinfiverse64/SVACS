import { AlertTriangle } from "lucide-react";
import type { Alert } from "@/domain/types";
import { fmtUtc } from "@/lib/time";
import SeverityChip from "@/components/primitives/SeverityChip";
import clsx from "clsx";

const sevColor = (s: string) =>
  s === "CRITICAL" || s === "HIGH"
    ? "text-err"
    : s === "MEDIUM"
      ? "text-warn"
      : "text-info";

export default function AlertSummary({ alerts }: { alerts: Alert[] }) {
  return (
    <ul className="divide-y divide-line/60">
      {alerts.map((a) => (
        <li
          key={a.id}
          className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-bg-2/40"
        >
          <AlertTriangle size={14} className={clsx("shrink-0", sevColor(a.severity))} />
          <span className="font-mono text-xs tabular-nums text-fg-1">
            {fmtUtc(a.ts_utc)}
          </span>
          <span className="font-mono text-xs text-fg-0">{a.vessel_id}</span>
          <span className="flex-1 truncate text-xs text-fg-1">{a.kind}</span>
          <SeverityChip severity={a.severity} />
        </li>
      ))}
    </ul>
  );
}
