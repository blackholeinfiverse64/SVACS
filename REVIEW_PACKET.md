# SVACS Dashboard — Review Packet

> Operational visibility layer for the SVACS pipeline.
> Dashboard owner: **Nikhil Jadhav** — Frontend + Dashboard Layer.

---

## 1. Entry point

| What | Where |
|---|---|
| HTML root | `index.html` |
| App bootstrap | `src/main.tsx` |
| Root component | `src/App.tsx` |
| Routing table | `src/App.tsx` (Routes) |
| Env loader | `src/env.ts` |
| Query client | `src/api/queryClient.ts` |
| API boundary | `src/api/adapter.ts` (`SvacsAdapter` interface) |

---

## 2. API map

The dashboard talks to **five upstream producer services** through one
adapter (`SvacsAdapter`). Each producer is owned by a different teammate.

| Producer | Owner | Surface | Schema | Used by |
|---|---|---|---|---|
| Signal / Perception | **Nupur Gavane** | `GET /signals?since=`, `GET /perception?since=` | `SignalChunk`, `PerceptionEvent` | `/signals`, `/perception`, `/trace`, Overview |
| Intelligence (NICAI) | **Ankita** | `GET /intelligence?since=` | `IntelligenceEvent` | `/intelligence`, `/trace`, Overview |
| State Engine | **Raj Prajapati** | `GET /state-events?since=` | `StateEvent` | `/state`, `/trace`, Overview |
| InsightBridge | **Vijay Dhawan** | `WS /telemetry` (or fallback `GET /telemetry`) | `SystemHealthFrame`, `StageMetric[]` | `/health`, `/pipeline`, all status dots |
| Bucket | **Siddhesh Narkar** | `GET /bucket/status` | `BucketStatus` | `/bucket`, Overview |

All schemas live in `src/domain/types.ts` and are validated with **Zod**.
Producers must keep `trace_id` field name consistent — that is the join key
for the Trace Explorer's lifecycle view.

---

## 3. Page architecture

```
AppShell (Sidebar + Topbar)
├── /              Overview         KPIs · Pipeline · Events chart · Validation donut · Top vessels · Recent state · Bucket · Alerts
├── /pipeline      LivePipeline     Stage flow · Stage telemetry table · Throughput
├── /signals       Signals          Live signal_chunk table, source/trace filters
├── /perception    Perception       Confidence histogram + perception_event table
├── /intelligence  Intelligence     NICAI donut + top reasons + intelligence_event table
├── /state         StateEngine      Top transitions + recent state_event table
├── /vessels       Vessels          Per-vessel activity, status chips, last seen
├── /alerts        Alerts           Severity / kind / vessel filtering
├── /trace         TraceExplorer    Trace search + lifecycle (with continuity gap detection)
├── /bucket        BucketStatus     Sync %, pending / failed writes, last sync
├── /health        SystemHealth     WS state, ingestion, latency, error count, stage health
└── /settings      Settings         Runtime config readout
```

State management:

- **Server state** — TanStack Query (`useQuery`), stale time 5s, periodic
  `refetchInterval` per page (2–8s depending on freshness requirements).
- **Client state** — Zustand:
  - `filterStore` — global vessel filter + UTC date range (Topbar).
  - `healthStore` — websocket connectivity truth.

---

## 4. Live flow

```
Producer service ──HTTP/WS──▶ axios / WebSocket
        │                          │
        │                          ▼
        │                  src/api/adapter.ts        (Zod-validated)
        │                          │
        ▼                          ▼
  React Query cache  ◀──────  store hooks (Zustand)
        │                          │
        ▼                          ▼
                Page selectors / components
                          │
                          ▼
                      Render (UTC, dark theme)
```

Failure handling:

- WS disconnect → `healthStore.wsConnected=false` → topbar shows `OFFLINE`,
  status dots flip to `down`, polling fallback engages.
- Schema mismatch → Zod throws → React Query `error` state → panel renders
  an error chip rather than fake data.
- Missing stage event for a known `trace_id` → Trace Explorer renders a
  red continuity-gap row. Never hidden.

---

## 5. Screenshots

> Capture before submission. Each should be a 1280-wide PNG.

- `docs/screens/01-overview.png` — full overview at peak load
- `docs/screens/02-pipeline.png` — live pipeline with degraded stage
- `docs/screens/03-trace-pass.png` — trace lifecycle, all stages present
- `docs/screens/04-trace-gap.png` — trace lifecycle, missing perception stage
- `docs/screens/05-alerts-critical.png` — alerts page, CRITICAL filter
- `docs/screens/06-health-ws-down.png` — system health with WS disconnected
- `docs/screens/07-bucket-failed-writes.png` — bucket page with non-zero failed writes

---

## 6. Failure cases demonstrated

| Failure | UX behaviour | Verified by |
|---|---|---|
| WS disconnect | Topbar `OFFLINE` chip; poll fallback runs | Drop network → reload |
| Producer 5xx | Page shows error state, last-good cache visible | Stop one backend |
| Schema drift | Zod parse error → page shows degraded notice | Send malformed payload |
| Missing perception_event | Trace Explorer red gap row | Drop a perception write |
| NICAI `DENY` | Validation donut shows red wedge; alert appears | Backend emits `DENY` |
| Bucket sync lag | Bucket page red, System Health flags it | Pause bucket writer |

---

## 7. Build & run

See `README.md` for full instructions.

```bash
npm install
cp .env.example .env.local
npm run dev          # development with mock
# integration:
# set VITE_USE_MOCK=false in .env.local, fill producer endpoints
npm run build
```

---

## 8. Demo video outline (5–7 min)

1. **0:00 – 0:30** — System context: SVACS pipeline + dashboard's role.
2. **0:30 – 1:30** — Overview page walkthrough: KPIs, pipeline, validation.
3. **1:30 – 2:30** — Live Pipeline + System Health: latency / errors visible.
4. **2:30 – 4:00** — Trace Explorer: paste trace_id, lifecycle reconstruction,
   continuity-gap demo with one stage paused.
5. **4:00 – 5:00** — Alerts + Vessels: filtering, severity, vessel drilldown.
6. **5:00 – 6:00** — Bucket Status + failure scenarios: WS drop, NICAI deny,
   bucket lag.
7. **6:00 – 7:00** — Closing: how an operator goes from anomaly → trace →
   resolution in under a minute.

---

## 9. Open integration questions

These must be answered before Phase 6 lands:

1. Confirmed `trace_id` field name across all four event types? (assumed `trace_id`).
2. Single multiplexed WS via InsightBridge or per-producer transports?
3. Auth model in production? (`Authorization` header? cookie? mTLS?)
4. SLA windows for continuity-gap detection per stage transition?
5. CORS allow-list for the dashboard origin in dev / staging / prod?
6. Pagination contract for `/signals`, `/perception`, etc. (since-cursor vs. offset).
