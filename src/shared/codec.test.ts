import { describe, it, expect } from "vitest";
import { encode, decode } from "./codec";
import { createRound, castVote, reveal } from "./state";

describe("encode / decode", () => {
  it("round-trips a fresh state", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    expect(decode(encode(state))).toEqual(state);
  });

  it("round-trips state with votes", () => {
    const state = castVote(
      createRound({ ticket: "AUTH-42", moderatorId: "user-1" }),
      "user-2",
      "5"
    );
    expect(decode(encode(state))).toEqual(state);
  });

  it("round-trips revealed state", () => {
    const state = reveal(
      castVote(
        createRound({ ticket: "AUTH-42", moderatorId: "user-1" }),
        "user-2",
        "8"
      )
    );
    expect(decode(encode(state))).toEqual(state);
  });

  it("encode returns a Uint8Array", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    expect(encode(state)).toBeInstanceOf(Uint8Array);
  });
});
