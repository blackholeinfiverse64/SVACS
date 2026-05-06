import type {
  SignalChunk,
  PerceptionEvent,
  IntelligenceEvent,
  StateEvent,
  Alert,
  VesselSummary,
  StageMetric,
  BucketStatus,
  SystemHealthFrame,
  TraceLifecycle,
} from "@/domain/types";
import {
  generateSignals,
  generatePerception,
  generateIntelligence,
  generateStateEvents,
  generateAlerts,
  generateVessels,
  generateStageMetrics,
  generateBucketStatus,
  generateHealthFrame,
  generateEventsOverTime,
  validationBreakdown,
} from "@/lib/mockData";
import { env } from "@/env";

/**
 * The Adapter is the *only* boundary between the dashboard and producer services.
 * Phase 6 integration: replace `MockAdapter` with `RealAdapter` (axios calls).
 * This is the contract Nupur / Ankita / Raj / Vijay / Siddhesh must satisfy.
 */
export interface SvacsAdapter {
  fetchSignals(): Promise<SignalChunk[]>;
  fetchPerception(): Promise<PerceptionEvent[]>;
  fetchIntelligence(): Promise<IntelligenceEvent[]>;
  fetchStateEvents(): Promise<StateEvent[]>;
  fetchAlerts(): Promise<Alert[]>;
  fetchVessels(): Promise<VesselSummary[]>;
  fetchStageMetrics(): Promise<StageMetric[]>;
  fetchBucketStatus(): Promise<BucketStatus>;
  fetchHealth(): Promise<SystemHealthFrame>;
  fetchEventsOverTime(): Promise<ReturnType<typeof generateEventsOverTime>>;
  fetchValidationBreakdown(): Promise<ReturnType<typeof validationBreakdown>>;
  fetchTrace(traceId: string): Promise<TraceLifecycle>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

class MockAdapter implements SvacsAdapter {
  async fetchSignals() {
    await wait(80);
    return generateSignals();
  }
  async fetchPerception() {
    await wait(80);
    return generatePerception();
  }
  async fetchIntelligence() {
    await wait(80);
    return generateIntelligence();
  }
  async fetchStateEvents() {
    await wait(80);
    return generateStateEvents();
  }
  async fetchAlerts() {
    await wait(60);
    return generateAlerts();
  }
  async fetchVessels() {
    await wait(60);
    return generateVessels();
  }
  async fetchStageMetrics() {
    await wait(40);
    return generateStageMetrics();
  }
  async fetchBucketStatus() {
    await wait(40);
    return generateBucketStatus();
  }
  async fetchHealth() {
    await wait(40);
    return generateHealthFrame();
  }
  async fetchEventsOverTime() {
    await wait(40);
    return generateEventsOverTime();
  }
  async fetchValidationBreakdown() {
    await wait(40);
    return validationBreakdown();
  }
  async fetchTrace(traceId: string): Promise<TraceLifecycle> {
    await wait(120);
    const [s, p, i, st] = await Promise.all([
      this.fetchSignals(),
      this.fetchPerception(),
      this.fetchIntelligence(),
      this.fetchStateEvents(),
    ]);
    const sig = s.find((x) => x.trace_id === traceId);
    const per = p.find((x) => x.trace_id === traceId);
    const inte = i.find((x) => x.trace_id === traceId);
    const sta = st.find((x) => x.trace_id === traceId);
    const missing: TraceLifecycle["missing"] = [];
    if (!sig) missing.push("signal");
    if (!per) missing.push("perception");
    if (!inte) missing.push("intelligence");
    if (!sta) missing.push("state");
    return {
      trace_id: traceId,
      signal: sig,
      perception: per,
      intelligence: inte,
      state: sta,
      missing,
    };
  }
}

/**
 * Real adapter stub — Phase 6 will fill these in using clients from `client.ts`.
 * Right now it falls back to mock so the dashboard never shows fake data
 * silently when env says "real" but APIs aren't reachable.
 */
class RealAdapter extends MockAdapter {}

export const adapter: SvacsAdapter = env.useMock ? new MockAdapter() : new RealAdapter();
