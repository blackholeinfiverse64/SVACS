import { useQuery } from "@tanstack/react-query";
import { Radio, Eye, Brain, Flag, Ship, AlertTriangle } from "lucide-react";
import { adapter } from "@/api/adapter";
import KPICard from "@/components/kpi/KPICard";
import Panel from "@/components/primitives/Panel";
import PipelineFlow from "@/components/pipeline/PipelineFlow";
import EventsOverTime from "@/components/charts/EventsOverTime";
import ValidationDonut from "@/components/charts/ValidationDonut";
import BucketSyncDonut from "@/components/charts/BucketSyncDonut";
import TopVesselsTable from "@/components/tables/TopVesselsTable";
import RecentStateTable from "@/components/tables/RecentStateTable";
import AlertSummary from "@/components/alerts/AlertSummary";
import { Link } from "react-router-dom";

export default function Overview() {
  const stageQ = useQuery({ queryKey: ["stages"], queryFn: () => adapter.fetchStageMetrics(), refetchInterval: 4000 });
  const eotQ = useQuery({ queryKey: ["eot"], queryFn: () => adapter.fetchEventsOverTime(), refetchInterval: 8000 });
  const valQ = useQuery({ queryKey: ["validation"], queryFn: () => adapter.fetchValidationBreakdown(), refetchInterval: 6000 });
  const vesselsQ = useQuery({ queryKey: ["vessels"], queryFn: () => adapter.fetchVessels(), refetchInterval: 6000 });
  const stateQ = useQuery({ queryKey: ["state"], queryFn: () => adapter.fetchStateEvents(), refetchInterval: 4000 });
  const alertsQ = useQuery({ queryKey: ["alerts"], queryFn: () => adapter.fetchAlerts(), refetchInterval: 4000 });
  const bucketQ = useQuery({ queryKey: ["bucket"], queryFn: () => adapter.fetchBucketStatus(), refetchInterval: 6000 });

  const m = (k: string) => stageQ.data?.find((s) => s.stage === k);

  return (
    <div className="space-y-4">
      {/* KPI ROW */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KPICard
          label="Total Signal Chunks"
          value={(m("signal")?.total_events ?? 12842).toLocaleString()}
          delta={{ kind: "up", text: "8.7% vs yesterday" }}
          icon={<Radio size={16} />}
          accent="cyan"
        />
        <KPICard
          label="Perception Events"
          value={(m("perception")?.total_events ?? 12618).toLocaleString()}
          delta={{ kind: "up", text: "8.3% vs yesterday" }}
          icon={<Eye size={16} />}
          accent="green"
        />
        <KPICard
          label="Intelligence Events"
          value={(m("intelligence")?.total_events ?? 12356).toLocaleString()}
          delta={{ kind: "up", text: "7.9% vs yesterday" }}
          icon={<Brain size={16} />}
          accent="violet"
        />
        <KPICard
          label="State Events"
          value={(m("state")?.total_events ?? 12210).toLocaleString()}
          delta={{ kind: "up", text: "7.4% vs yesterday" }}
          icon={<Flag size={16} />}
          accent="amber"
        />
        <KPICard
          label="Active Vessels"
          value={String(vesselsQ.data?.length ?? 23)}
          delta={{ kind: "flat", text: "No change" }}
          icon={<Ship size={16} />}
          accent="info"
        />
        <KPICard
          label="Alerts (Today)"
          value={String(alertsQ.data?.filter((a) => !a.acknowledged).length ?? 7)}
          delta={{ kind: "up", text: "2 vs yesterday" }}
          icon={<AlertTriangle size={16} />}
          accent="rose"
        />
      </div>

      {/* PIPELINE FLOW + EVENTS CHART + VALIDATION DONUT */}
      <div className="grid grid-cols-12 gap-3">
        <Panel
          title="Pipeline Flow (Live)"
          className="col-span-12 lg:col-span-5"
          bodyClassName="p-3"
        >
          <PipelineFlow
            metrics={stageQ.data ?? []}
            bucketSyncPct={bucketQ.data?.sync_percent ?? 1}
          />
        </Panel>

        <Panel
          title="Events Over Time (All Stages)"
          className="col-span-12 lg:col-span-4"
        >
          {eotQ.data && <EventsOverTime data={eotQ.data} />}
        </Panel>

        <Panel
          title="Validation Status (NICAI)"
          className="col-span-12 lg:col-span-3"
        >
          {valQ.data && (
            <ValidationDonut
              total={valQ.data.total}
              allow={valQ.data.allow}
              flag={valQ.data.flag}
              deny={valQ.data.deny}
            />
          )}
        </Panel>
      </div>

      {/* BOTTOM ROW: TOP VESSELS + RECENT STATE + BUCKET + ALERTS */}
      <div className="grid grid-cols-12 gap-3">
        <Panel
          title="Top Vessels (By Events)"
          className="col-span-12 lg:col-span-4"
          noPad
          right={
            <Link to="/vessels" className="text-2xs text-fg-2 hover:text-fg-0">
              View all vessels →
            </Link>
          }
        >
          <TopVesselsTable rows={(vesselsQ.data ?? []).slice(0, 5)} />
        </Panel>

        <Panel
          title="Recent State Outputs"
          className="col-span-12 lg:col-span-3"
          noPad
          right={
            <Link to="/state" className="text-2xs text-fg-2 hover:text-fg-0">
              View all state events →
            </Link>
          }
        >
          <RecentStateTable rows={(stateQ.data ?? []).slice(0, 5)} />
        </Panel>

        <Panel title="Bucket Sync Status" className="col-span-12 lg:col-span-2">
          {bucketQ.data && <BucketSyncDonut status={bucketQ.data} />}
        </Panel>

        <Panel
          title="Alert Summary"
          className="col-span-12 lg:col-span-3"
          noPad
          right={
            <Link to="/alerts" className="text-2xs text-fg-2 hover:text-fg-0">
              View all alerts →
            </Link>
          }
        >
          <AlertSummary alerts={(alertsQ.data ?? []).slice(0, 5)} />
        </Panel>
      </div>
    </div>
  );
}
