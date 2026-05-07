import { describe, it, expect } from "vitest";
import { isSameDay, formatLocalTime, formatDayLabel } from "@/lib/format-time";

describe("format-time", () => {
  it("isSameDay true on same calendar day", () => {
    const a = new Date("2026-05-07T03:00:00Z").getTime();
    const b = new Date("2026-05-07T20:00:00Z").getTime();
    expect(isSameDay(a, b)).toBe(true);
  });
  it("isSameDay false across days", () => {
    const a = new Date("2026-05-07T23:00:00Z").getTime();
    const b = new Date("2026-05-09T02:00:00Z").getTime();
    expect(isSameDay(a, b)).toBe(false);
  });
  it("formatLocalTime returns hh:mm style", () => {
    const ts = new Date("2026-05-07T08:30:00").getTime();
    expect(formatLocalTime(ts)).toMatch(/\d{1,2}:\d{2}/);
  });
});
