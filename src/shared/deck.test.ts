import { describe, it, expect } from "vitest";
import { DECKS, getDeck } from "./deck";

describe("DECKS", () => {
  it("fibonacci contains expected cards", () => {
    expect(DECKS.fibonacci.cards).toEqual(["1", "2", "3", "5", "8", "13", "21", "?", "∞"]);
  });

  it("tshirt contains expected cards", () => {
    expect(DECKS.tshirt.cards).toEqual(["XS", "S", "M", "L", "XL", "?", "∞"]);
  });

  it("powers2 contains expected cards", () => {
    expect(DECKS.powers2.cards).toEqual(["1", "2", "4", "8", "16", "32", "?", "∞"]);
  });
});

describe("getDeck", () => {
  it("returns the correct deck by key", () => {
    expect(getDeck("fibonacci").cards[0]).toBe("1");
    expect(getDeck("tshirt").cards[0]).toBe("XS");
    expect(getDeck("powers2").cards[0]).toBe("1");
  });

  it("each deck has a label", () => {
    expect(getDeck("fibonacci").label).toBeTruthy();
    expect(getDeck("tshirt").label).toBeTruthy();
    expect(getDeck("powers2").label).toBeTruthy();
  });
});
