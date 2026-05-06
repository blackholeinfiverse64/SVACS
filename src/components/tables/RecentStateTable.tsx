import type { StateEvent } from "@/domain/types";
import { fmtUtc } from "@/lib/time";
import { fmtConfidence } from "@/lib/format";
import ValidationChip from "@/components/primitives/ValidationChip";
import clsx from "clsx";

const stateColor = (s: string) => {
  if (s === "ALERT") return "text-err";
  if (s === "WATCH") return "text-warn";
  if (s === "NORMAL") return "text-ok";
  return "text-fg-1";
};

export default function RecentStateTable({ rows }: { rows: StateEvent[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-2xs font-semibold uppercase tracking-[0.14em] text-fg-2">
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Vessel ID</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Validation</th>
            <th className="px-4 py-2 text-right">Confidence</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {rows.map((r) => (
            <tr
              key={r.trace_id}
              className="border-t border-line/60 transition-colors hover:bg-bg-2/40"
            >
              <td className="px-4 py-2 tabular-nums text-fg-1">{fmtUtc(r.ts_utc)}</td>
              <td className="px-4 py-2 text-fg-0">{r.vessel_id}</td>
              <td className={clsx("px-4 py-2 font-semibold", stateColor(r.to_state))}>
                {r.to_state}
              </td>
              <td className="px-4 py-2">
                <ValidationChip validation={r.validation} />
              </td>
              <td className="px-4 py-2 text-right tabular-nums text-fg-0">
                {fmtConfidence(r.confidence)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
