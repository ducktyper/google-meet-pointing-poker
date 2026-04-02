import { describe, it, expect } from "vitest";
import { createRound, castVote, reveal, newRound } from "./state";

describe("createRound", () => {
  it("creates initial state with ticket and moderator", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    expect(state.ticket).toBe("AUTH-42");
    expect(state.moderatorId).toBe("user-1");
    expect(state.votes).toEqual({});
    expect(state.revealed).toBe(false);
  });
});

describe("castVote", () => {
  it("records a vote for a participant", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    const next = castVote(state, "user-2", "5");
    expect(next.votes["user-2"]).toBe("5");
  });

  it("does not mutate the original state", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    castVote(state, "user-2", "5");
    expect(state.votes).toEqual({});
  });

  it("allows overwriting a vote before reveal", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    const next = castVote(castVote(state, "user-2", "5"), "user-2", "8");
    expect(next.votes["user-2"]).toBe("8");
  });
});

describe("reveal", () => {
  it("sets revealed to true", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    const next = reveal(state);
    expect(next.revealed).toBe(true);
  });

  it("does not mutate the original state", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    reveal(state);
    expect(state.revealed).toBe(false);
  });
});

describe("newRound", () => {
  it("resets votes and revealed, updates ticket", () => {
    const state = reveal(castVote(
      createRound({ ticket: "AUTH-42", moderatorId: "user-1" }),
      "user-2", "5"
    ));
    const next = newRound(state, "AUTH-43");
    expect(next.votes).toEqual({});
    expect(next.revealed).toBe(false);
    expect(next.ticket).toBe("AUTH-43");
    expect(next.moderatorId).toBe("user-1");
  });

  it("generates a new roundId", () => {
    const state = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });
    const next = newRound(state, "AUTH-43");
    expect(next.roundId).not.toBe(state.roundId);
  });
});
