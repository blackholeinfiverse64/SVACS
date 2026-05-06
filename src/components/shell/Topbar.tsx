import { useLocation } from "react-router-dom";
import { ChevronDown, Calendar, RefreshCw, X } from "lucide-react";
import StatusDot from "./StatusDot";
import { useFilterStore } from "@/store/filterStore";
import { useHealthStore } from "@/store/healthStore";

const titleFor = (path: string): { title: string; subtitle: string } => {
  const map: Record<string, { title: string; subtitle: string }> = {
    "/": {
      title: "SVACS Dashboard Reference",
      subtitle: "Signal → Intelligence → State Execution",
    },
    "/pipeline": {
      title: "Live Pipeline",
      subtitle: "End-to-end stage flow with latency telemetry",
    },
    "/signals": { title: "Signals", subtitle: "Raw signal_chunk stream" },
    "/perception": { title: "Perception", subtitle: "Layer-2 detections + confidence" },
    "/intelligence": { title: "Intelligence (NICAI)", subtitle: "Validation + reasoning" },
    "/state": { title: "State Engine", subtitle: "State transitions + execution" },
    "/vessels": { title: "Vessels", subtitle: "Per-vessel activity + last known state" },
    "/alerts": { title: "Alerts", subtitle: "Anomaly + validation failures" },
    "/trace": { title: "Trace Explorer", subtitle: "Inspect lifecycle by trace_id" },
    "/bucket": { title: "Bucket Status", subtitle: "Truth Store sync + verification" },
    "/health": {
      title: "System Health",
      subtitle: "Throughput, latency, ingestion, errors",
    },
    "/settings": { title: "Settings", subtitle: "Operator preferences" },
  };
  return map[path] ?? map["/"];
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { vesselId, fromUtc, toUtc, setVessel, setRange } = useFilterStore();
  const wsConnected = useHealthStore((s) => s.wsConnected);
  const { title, subtitle } = titleFor(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-bg-1/40 px-6 backdrop-blur-xl">
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-wide text-fg-0">{title}</span>
        <span className="text-[11px] text-fg-2">{subtitle}</span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <div className="relative">
          <select
            value={vesselId}
            onChange={(e) => setVessel(e.target.value)}
            className="input appearance-none pr-8"
          >
            <option value="ALL">All Vessels</option>
            {Array.from({ length: 24 }).map((_, i) => {
              const id = `Vessel_${String(i + 1).padStart(2, "0")}`;
              return (
                <option key={id} value={id}>
                  {id}
                </option>
              );
            })}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-fg-2"
          />
        </div>

        <div className="flex items-center gap-1 rounded-md border border-line bg-bg-2 px-2 py-1.5">
          <Calendar size={14} className="text-fg-2" />
          <input
            value={fromUtc}
            onChange={(e) => setRange(e.target.value, toUtc)}
            className="w-32 bg-transparent font-mono text-xs text-fg-0 focus:outline-none"
            placeholder="YYYY-MM-DD HH:mm"
          />
          <span className="px-1 text-fg-2">to</span>
          <input
            value={toUtc}
            onChange={(e) => setRange(fromUtc, e.target.value)}
            className="w-32 bg-transparent font-mono text-xs text-fg-0 focus:outline-none"
            placeholder="YYYY-MM-DD HH:mm"
          />
          <button
            type="button"
            onClick={() => setRange("", "")}
            className="ml-1 text-fg-2 hover:text-fg-0"
            title="Clear range"
          >
            <X size={14} />
          </button>
        </div>

        <button type="button" className="btn" title="Refresh now">
          <RefreshCw size={14} />
        </button>

        <div className="flex items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-1.5">
          <StatusDot status={wsConnected ? "live" : "down"} />
          <span className="text-2xs font-semibold uppercase tracking-[0.18em] text-fg-1">
            {wsConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
