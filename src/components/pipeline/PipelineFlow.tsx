import { Radio, Eye, Brain, Flag, Database } from "lucide-react";
import StatusDot from "@/components/shell/StatusDot";
import type { StageMetric } from "@/domain/types";
import { fmtNum } from "@/lib/format";
import clsx from "clsx";

const stageStyle: Record<
  string,
  { icon: typeof Radio; ring: string; text: string; glow: string; label: string; sub: string }
> = {
  signal: {
    icon: Radio,
    ring: "border-stage-signal/60",
    text: "text-stage-signal",
    glow: "shadow-[0_0_30px_-8px] shadow-stage-signal/60",
    label: "Signal Ingestion",
    sub: "",
  },
  perception: {
    icon: Eye,
    ring: "border-stage-perception/60",
    text: "text-stage-perception",
    glow: "shadow-[0_0_30px_-8px] shadow-stage-perception/60",
    label: "Perception",
    sub: "Layer 2",
  },
  intelligence: {
    icon: Brain,
    ring: "border-stage-intelligence/60",
    text: "text-stage-intelligence",
    glow: "shadow-[0_0_30px_-8px] shadow-stage-intelligence/60",
    label: "Intelligence",
    sub: "NICAI",
  },
  state: {
    icon: Flag,
    ring: "border-stage-state/60",
    text: "text-stage-state",
    glow: "shadow-[0_0_30px_-8px] shadow-stage-state/60",
    label: "State Engine",
    sub: "Execution",
  },
  bucket: {
    icon: Database,
    ring: "border-stage-bucket/60",
    text: "text-stage-bucket",
    glow: "shadow-[0_0_30px_-8px] shadow-stage-bucket/60",
    label: "Bucket",
    sub: "Truth Store",
  },
};

interface Props {
  metrics: StageMetric[];
  bucketSyncPct?: number;
}

export default function PipelineFlow({ metrics, bucketSyncPct = 1 }: Props) {
  const order: StageMetric["stage"][] = ["signal", "perception", "intelligence", "state", "bucket"];
  const map = new Map(metrics.map((m) => [m.stage, m]));

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        {order.map((stageId, idx) => {
          const m = map.get(stageId);
          const def = stageStyle[stageId];
          const Icon = def.icon;
          const value =
            stageId === "bucket"
              ? `${(bucketSyncPct * 100).toFixed(0)}% Sync`
              : fmtNum(m?.total_events ?? 0);
          return (
            <div key={stageId} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={clsx(
                    "relative flex h-20 w-20 items-center justify-center rounded-full border-2 bg-bg-2",
                    def.ring,
                    def.glow,
                  )}
                >
                  <Icon size={28} strokeWidth={1.6} className={def.text} />
                  <span
                    className={clsx(
                      "absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-bg-1 bg-bg-2 text-[9px] font-bold",
                      def.text,
                    )}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-fg-0">{def.label}</div>
                  {def.sub && (
                    <div className="text-[10px] uppercase tracking-[0.16em] text-fg-2">
                      {def.sub}
                    </div>
                  )}
                  <div className="mt-1 font-mono text-sm tabular-nums text-fg-1">{value}</div>
                </div>
              </div>
              {idx < order.length - 1 && <PipeArrow color={def.text} />}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2 px-2 text-xs">
        <StatusDot status="live" />
        <span className="text-fg-2">Pipeline Status:</span>
        <span className="font-medium text-ok">Healthy</span>
      </div>
    </div>
  );
}

function PipeArrow({ color }: { color: string }) {
  return (
    <div className="relative mx-1 flex flex-1 items-center">
      <div
        className={clsx(
          "h-px flex-1 bg-gradient-to-r from-transparent via-current to-current opacity-60",
          color,
        )}
      />
      <svg
        className={clsx("h-3 w-3 -ml-[2px]", color)}
        viewBox="0 0 12 12"
        fill="currentColor"
      >
        <path d="M0 1 L10 6 L0 11 Z" opacity="0.85" />
      </svg>
    </div>
  );
}
