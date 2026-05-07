import { describe, it, expect } from "vitest";
import { signApplication } from "@/lib/signature";

describe("signApplication", () => {
  it("prepends recipient name", () => {
    expect(signApplication("Alice", "我也想讀這本"))
      .toBe("Dear Alice，\n我也想讀這本");
  });
  it("trims input", () => {
    expect(signApplication("Ben", "  hi  ")).toBe("Dear Ben，\nhi");
  });
});
