import { describe, it, expect } from "vitest";
import { cooldownRemainingMs, isOnCooldown } from "@/lib/cooldown";

const DAY = 86_400_000;

describe("cooldown", () => {
  it("returns 0 when never set", () => {
    expect(cooldownRemainingMs(0, 7, Date.now())).toBe(0);
  });

  it("returns full window when just set", () => {
    const now = 1_000_000_000;
    expect(cooldownRemainingMs(now, 7, now)).toBe(7 * DAY);
  });

  it("returns 0 after window has passed", () => {
    const now = 1_000_000_000;
    expect(cooldownRemainingMs(now - 8 * DAY, 7, now)).toBe(0);
  });

  it("isOnCooldown true within window", () => {
    const now = 1_000_000_000;
    expect(isOnCooldown(now - 3 * DAY, 7, now)).toBe(true);
  });

  it("isOnCooldown false past window", () => {
    const now = 1_000_000_000;
    expect(isOnCooldown(now - 8 * DAY, 7, now)).toBe(false);
  });
});
