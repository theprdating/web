import { describe, it, expect } from "vitest";
import { canSeeEachOther } from "@/lib/filters";

describe("filter matrix", () => {
  it("純粹書友 ↔ 純粹書友 互看", () => {
    expect(canSeeEachOther("純粹書友", "純粹書友")).toBe(true);
  });
  it("純粹書友 ↔ 純粹找緣分 互不可見", () => {
    expect(canSeeEachOther("純粹書友", "純粹找緣分")).toBe(false);
    expect(canSeeEachOther("純粹找緣分", "純粹書友")).toBe(false);
  });
  it("不拘 對 任何人 都互看", () => {
    expect(canSeeEachOther("不拘", "純粹書友")).toBe(true);
    expect(canSeeEachOther("不拘", "純粹找緣分")).toBe(true);
    expect(canSeeEachOther("不拘", "不拘")).toBe(true);
  });
});
