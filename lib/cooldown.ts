const DAY = 86_400_000;

export function cooldownRemainingMs(lastChangedAt: number, days: number, now = Date.now()) {
  if (lastChangedAt <= 0) return 0;
  const end = lastChangedAt + days * DAY;
  return Math.max(0, end - now);
}

export function isOnCooldown(lastChangedAt: number, days: number, now = Date.now()) {
  return cooldownRemainingMs(lastChangedAt, days, now) > 0;
}

export function formatRemainingDays(ms: number): string {
  const days = Math.ceil(ms / DAY);
  return `剩 ${days} 天`;
}
