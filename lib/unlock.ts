export function canUnlockChat(
  progress: { a: number; b: number },
  has25Note: { a: boolean; b: boolean },
): boolean {
  return progress.a >= 25 && progress.b >= 25 && has25Note.a && has25Note.b;
}
