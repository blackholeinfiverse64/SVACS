import { useQuery } from "@tanstack/react-query";
import { adapter } from "@/api/adapter";
import Panel from "@/components/primitives/Panel";
import PipelineFlow from "@/components/pipeline/PipelineFlow";
import EventsOverTime from "@/components/charts/EventsOverTime";
import StatusDot from "@/components/shell/StatusDot";
import { fmtMs } from "@/lib/format";

export default function LivePipeline() {
  const stagesQ = useQuery({ queryKey: ["stages"], queryFn: () => adapter.fetchStageMetrics(), refetchInterval: 2000 });
  const eotQ = useQuery({ queryKey: ["eot"], queryFn: () => adapter.fetchEventsOverTime(), refetchInterval: 6000 });
  const bucketQ = useQuery({ queryKey: ["bucket"], queryFn: () => adapter.fetchBucketStatus(), refetchInterval: 6000 });

  const stages = stagesQ.data ?? [];

  return (
    <div className="space-y-4">
      <Panel title="Pipeline Flow (Live)">
        <PipelineFlow metrics={stages} bucketSyncPct={bucketQ.data?.sync_percent ?? 1} />
      </Panel>

      <div className="grid grid-cols-12 gap-3">
        <Panel title="Stage Telemetry" className="col-span-12 lg:col-span-7" noPad>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-2xs uppercase tracking-[0.14em] text-fg-2">
                <th className="px-4 py-2">Stage</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Events/s</th>
                <th className="px-4 py-2 text-right">p50</th>
                <th className="px-4 py-2 text-right">p95</th>
                <th className="px-4 py-2 text-right">Errors</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {stages.map((s) => (
                <tr key={s.stage} className="border-t border-line/60">
                  <td className="px-4 py-2 capitalize text-fg-0">{s.stage}</td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-2">
                      <StatusDot status={s.status} />
                      <span className="text-fg-1">{s.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-fg-0">
                    {s.events_per_sec.toFixed(1)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-fg-1">
                    {fmtMs(s.p50_latency_ms)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-fg-1">
                    {fmtMs(s.p95_latency_ms)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-fg-1">
                    {(s.error_rate * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Throughput Over Time" className="col-span-12 lg:col-span-5">
          {eotQ.data && <EventsOverTime data={eotQ.data} />}
        </Panel>
      </div>
    </div>
  );
}
