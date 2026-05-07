export const FOLIO_STATE_KEY = "folio_state";

type Persisted = {
  currentUserId: string | null;
  users: Record<string, unknown>;
  books: Record<string, unknown>;
  posts: Record<string, unknown>;
  applications: Record<string, unknown>;
  rooms: Record<string, unknown>;
  notes: Record<string, unknown>;
  progress: Record<string, unknown>;
  messages: Record<string, unknown>;
};

export function saveState(state: Persisted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FOLIO_STATE_KEY, JSON.stringify(state));
}

export function loadState(): Persisted | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(FOLIO_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Persisted;
  } catch {
    return null;
  }
}
