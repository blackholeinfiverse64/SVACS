import clsx from "clsx";
import type { Validation } from "@/domain/types";

const map: Record<Validation, string> = {
  ALLOW: "border-ok/40 text-ok bg-ok/10",
  FLAG: "border-warn/50 text-warn bg-warn/10",
  DENY: "border-err/50 text-err bg-err/10",
};

export default function ValidationChip({ validation }: { validation: Validation }) {
  return <span className={clsx("chip uppercase", map[validation])}>{validation}</span>;
}
