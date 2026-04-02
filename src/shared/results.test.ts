import { describe, it, expect } from "vitest";
import { summarize } from "./results";

describe("summarize", () => {
  it("returns empty summary when no votes", () => {
    const result = summarize({});
    expect(result.average).toBeNull();
    expect(result.distribution).toEqual({});
    expect(result.consensus).toBe(false);
  });

  it("computes average from numeric votes", () => {
    const result = summarize({ "u1": "3", "u2": "5" });
    expect(result.average).toBe(4);
  });

  it("ignores ? and ∞ in average calculation", () => {
    const result = summarize({ "u1": "3", "u2": "?", "u3": "∞" });
    expect(result.average).toBe(3);
  });

  it("returns null average when no numeric votes", () => {
    const result = summarize({ "u1": "?", "u2": "∞" });
    expect(result.average).toBeNull();
  });

  it("computes distribution across all votes", () => {
    const result = summarize({ "u1": "5", "u2": "5", "u3": "8" });
    expect(result.distribution).toEqual({ "5": 2, "8": 1 });
  });

  it("detects consensus when all votes match", () => {
    const result = summarize({ "u1": "5", "u2": "5", "u3": "5" });
    expect(result.consensus).toBe(true);
  });

  it("no consensus when votes differ", () => {
    const result = summarize({ "u1": "5", "u2": "8" });
    expect(result.consensus).toBe(false);
  });

  it("no consensus with a single voter", () => {
    const result = summarize({ "u1": "5" });
    expect(result.consensus).toBe(false);
  });
});
