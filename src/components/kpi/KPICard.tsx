import clsx from "clsx";
import { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export interface KPICardProps {
  label: string;
  value: string;
  delta?: { kind: "up" | "down" | "flat"; text: string };
  icon?: ReactNode;
  accent?: "cyan" | "violet" | "green" | "amber" | "rose" | "info";
}

const accentMap: Record<NonNullable<KPICardProps["accent"]>, string> = {
  cyan: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30",
  violet: "text-accent-violet bg-accent-violet/10 border-accent-violet/30",
  green: "text-accent-green bg-accent-green/10 border-accent-green/30",
  amber: "text-accent-amber bg-accent-amber/10 border-accent-amber/30",
  rose: "text-accent-rose bg-accent-rose/10 border-accent-rose/30",
  info: "text-info bg-info/10 border-info/30",
};

export default function KPICard({
  label,
  value,
  delta,
  icon,
  accent = "cyan",
}: KPICardProps) {
  const DeltaIcon = delta?.kind === "up" ? ArrowUp : delta?.kind === "down" ? ArrowDown : Minus;
  const deltaCls =
    delta?.kind === "up"
      ? "text-ok"
      : delta?.kind === "down"
        ? "text-err"
        : "text-fg-2";

  return (
    <div className="panel relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="kpi-label">{label}</div>
        {icon && (
          <div
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-md border",
              accentMap[accent],
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-value mt-2">{value}</div>
      {delta && (
        <div className={clsx("mt-1 flex items-center gap-1 text-xs", deltaCls)}>
          <DeltaIcon size={12} />
          <span className="font-mono tabular-nums">{delta.text}</span>
        </div>
      )}
    </div>
  );
}
