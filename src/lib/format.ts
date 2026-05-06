export const fmtNum = (n: number) => n.toLocaleString("en-US");

export const fmtPct = (v: number, digits = 1) =>
  `${(v * 100).toFixed(digits)}%`;

export const fmtMs = (ms: number) => `${ms.toFixed(0)} ms`;

export const fmtConfidence = (c: number) => c.toFixed(2);

export const truncId = (id: string, head = 6, tail = 4) =>
  id.length <= head + tail + 1 ? id : `${id.slice(0, head)}…${id.slice(-tail)}`;
