import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveState, loadState, FOLIO_STATE_KEY } from "@/lib/persistence";

describe("persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveState writes JSON to localStorage", () => {
    saveState({ currentUserId: "u1", users: {}, books: {}, posts: {}, applications: {}, rooms: {}, notes: {}, progress: {}, messages: {} });
    const raw = localStorage.getItem(FOLIO_STATE_KEY);
    expect(JSON.parse(raw!).currentUserId).toBe("u1");
  });

  it("loadState returns null when no key", () => {
    expect(loadState()).toBeNull();
  });

  it("loadState parses stored JSON", () => {
    localStorage.setItem(FOLIO_STATE_KEY, JSON.stringify({ currentUserId: "u2" }));
    expect(loadState()!.currentUserId).toBe("u2");
  });
});
