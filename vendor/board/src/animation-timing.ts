/** Pace real-time recording by elapsed time, never by display refresh rate. */
export function nextRealTimeFrame(index: number, elapsedMs: number, fps: number) {
  const step = 1000 / fps
  const next = Math.max(index + 1, Math.ceil(elapsedMs / step))
  return { index: next, waitMs: Math.max(0, next * step - elapsedMs) }
}
