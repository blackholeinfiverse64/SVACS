import { useQuery } from "@tanstack/react-query";
import { adapter } from "@/api/adapter";
import Panel from "@/components/primitives/Panel";
import StatusDot from "@/components/shell/StatusDot";
import EventsOverTime from "@/components/charts/EventsOverTime";
import { fmtMs } from "@/lib/format";
import { fmtUtcDate } from "@/lib/time";

const fmtUptime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
};

export default function SystemHealth() {
  const hQ = useQuery({ queryKey: ["health"], queryFn: () => adapter.fetchHealth(), refetchInterval: 2000 });
  const sQ = useQuery({ queryKey: ["stages"], queryFn: () => adapter.fetchStageMetrics(), refetchInterval: 3000 });
  const eQ = useQuery({ queryKey: ["eot"], queryFn: () => adapter.fetchEventsOverTime(), refetchInterval: 6000 });

  const h = hQ.data;
  const stages = sQ.data ?? [];
  const errors = stages.reduce((acc, s) => acc + s.error_rate * s.events_per_sec * 60, 0);
  const errCount = h?.error_count_60s ?? Math.round(errors);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-3">
        <Stat
          label="WS Connected"
          value={h?.ws_connected ? "yes" : "no"}
          ok={!!h?.ws_connected}
        />
        <Stat
          label="Ingestion Rate"
          value={h ? `${h.ingestion_rate.toFixed(1)} ev/s` : "—"}
        />
        <Stat
          label="Processing Latency"
          value={h ? fmtMs(h.processing_latency_ms) : "—"}
          ok={!h || h.processing_latency_ms < 80}
        />
        <Stat
          label="Errors (60s)"
          value={String(errCount)}
          bad={errCount > 5}
        />
        <Stat label="Uptime" value={h ? fmtUptime(h.uptime_seconds) : "—"} />
        <Stat
          label="Last Telemetry"
          value={h ? fmtUtcDate(h.last_telemetry_utc) : "—"}
          mono
        />
      </div>

      <Panel title="Stage Health">
        <ul className="space-y-2">
          {stages.map((s) => (
            <li key={s.stage} className="flex items-center gap-3 text-sm">
              <StatusDot status={s.status} />
              <span className="w-28 capitalize text-fg-0">{s.stage}</span>
              <span className="font-mono text-fg-1">
                {s.events_per_sec.toFixed(1)} ev/s
              </span>
              <span className="font-mono text-fg-2">
                p50 {fmtMs(s.p50_latency_ms)} · p95 {fmtMs(s.p95_latency_ms)}
              </span>
              <span
                className={`ml-auto font-mono ${
                  s.error_rate > 0.01 ? "text-err" : "text-fg-1"
                }`}
              >
                err {(s.error_rate * 100).toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Throughput">
        {eQ.data && <EventsOverTime data={eQ.data} />}
      </Panel>
    </div>
  );
}

function Stat({
  label,
  value,
  ok,
  bad,
  mono,
}: {
  label: string;
  value: string;
  ok?: boolean;
  bad?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="panel col-span-6 p-4 md:col-span-4 xl:col-span-2">
      <div className="text-2xs uppercase tracking-[0.18em] text-fg-2">{label}</div>
      <div
        className={`mt-1 ${mono ? "text-base" : "text-2xl"} font-mono font-semibold tabular-nums ${
          bad ? "text-err" : ok ? "text-ok" : "text-fg-0"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
