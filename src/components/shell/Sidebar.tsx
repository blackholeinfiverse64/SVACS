import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Radio,
  Eye,
  Brain,
  Flag,
  Ship,
  AlertTriangle,
  Search,
  Database,
  HeartPulse,
  Settings as SettingsIcon,
} from "lucide-react";
import clsx from "clsx";
import StatusDot from "./StatusDot";
import { nowUtcDisplay } from "@/lib/time";
import { useEffect, useState } from "react";

const items = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/pipeline", label: "Live Pipeline", icon: Activity },
  { to: "/signals", label: "Signals", icon: Radio },
  { to: "/perception", label: "Perception", icon: Eye },
  { to: "/intelligence", label: "Intelligence", icon: Brain },
  { to: "/state", label: "State Engine", icon: Flag },
  { to: "/vessels", label: "Vessels", icon: Ship },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/trace", label: "Traces", icon: Search },
  { to: "/bucket", label: "Bucket Status", icon: Database },
  { to: "/health", label: "System Health", icon: HeartPulse },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const [now, setNow] = useState(nowUtcDisplay());
  useEffect(() => {
    const id = setInterval(() => setNow(nowUtcDisplay()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-line bg-bg-1/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent-cyan/40 bg-accent-cyan/10">
          <span className="font-mono text-[11px] font-bold tracking-wider text-accent-cyan">
            SV
          </span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-wide text-fg-0">SVACS</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-fg-2">
            Truth. Layered. Actionable.
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx("nav-item", isActive && "nav-item-active")
                }
              >
                <Icon size={16} strokeWidth={1.75} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-line px-4 py-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-fg-2">
          UTC Time
        </div>
        <div className="font-mono text-xs text-fg-0">{now}</div>
        <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.18em] text-fg-2">
          User
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-fg-0">
          <StatusDot status="live" size={6} />
          svacs_admin
        </div>
      </div>
    </aside>
  );
}
