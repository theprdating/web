import { describe, it, expect, beforeEach } from "vitest";
import { useFolioStore } from "@/lib/store";

describe("FolioStore", () => {
  beforeEach(() => {
    useFolioStore.setState(useFolioStore.getInitialState());
  });

  it("starts with no current user", () => {
    expect(useFolioStore.getState().currentUserId).toBeNull();
  });

  it("setCurrentUser sets the id", () => {
    useFolioStore.getState().setCurrentUser("user-1");
    expect(useFolioStore.getState().currentUserId).toBe("user-1");
  });

  it("upsertUser adds a user to users map", () => {
    useFolioStore.getState().upsertUser({
      id: "u1", nickname: "Alice", gender: "female", age: 24,
      bookCategories: ["fiction"], qaAnswers: {}, stance: "純粹書友",
      stanceChangedAt: 0, nicknameChangedAt: 0,
    });
    expect(useFolioStore.getState().users["u1"].nickname).toBe("Alice");
  });
});
