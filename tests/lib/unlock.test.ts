import { describe, it, expect } from "vitest";
import { canUnlockChat } from "@/lib/unlock";

describe("canUnlockChat", () => {
  const baseProgress = (a: number, b: number) => ({ a, b });
  const baseHas25 = (a: boolean, b: boolean) => ({ a, b });

  it("returns false when both < 25%", () => {
    expect(canUnlockChat(baseProgress(10, 5), baseHas25(false, false))).toBe(false);
  });
  it("returns false when only one side meets both", () => {
    expect(canUnlockChat(baseProgress(40, 10), baseHas25(true, false))).toBe(false);
  });
  it("returns false when both ≥ 25 but missing 心得", () => {
    expect(canUnlockChat(baseProgress(40, 30), baseHas25(false, true))).toBe(false);
  });
  it("returns true when both meet both", () => {
    expect(canUnlockChat(baseProgress(40, 30), baseHas25(true, true))).toBe(true);
  });
});
