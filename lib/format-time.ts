export function isSameDay(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  return da.getUTCFullYear() === db.getUTCFullYear() &&
         da.getUTCMonth() === db.getUTCMonth() &&
         da.getUTCDate() === db.getUTCDate();
}

export function formatLocalTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  if (isSameDay(ts, today.getTime())) return "今天";
  const y = new Date(today); y.setUTCDate(y.getUTCDate() - 1);
  if (isSameDay(ts, y.getTime())) return "昨天";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}
