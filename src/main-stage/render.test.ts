// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { renderVoting, renderRevealed } from "./render";
import { createRound, castVote, reveal } from "../shared/state";
import { summarize } from "../shared/results";

const baseState = createRound({ ticket: "AUTH-42", moderatorId: "user-1" });

describe("renderVoting", () => {
  it("renders a button for each card in the deck", () => {
    const el = document.createElement("div");
    renderVoting(el, {
      state: baseState,
      cards: ["1", "2", "3", "5"],
      participantId: "user-2",
      isModerator: false,
      onVote: vi.fn(),
      onReveal: vi.fn(),
    });
    const buttons = el.querySelectorAll("[data-card]");
    expect(buttons.length).toBe(4);
  });

  it("shows the ticket name", () => {
    const el = document.createElement("div");
    renderVoting(el, {
      state: baseState,
      cards: ["1", "2"],
      participantId: "user-2",
      isModerator: false,
      onVote: vi.fn(),
      onReveal: vi.fn(),
    });
    expect(el.textContent).toContain("AUTH-42");
  });

  it("highlights the participant's current vote", () => {
    const el = document.createElement("div");
    const state = castVote(baseState, "user-2", "5");
    renderVoting(el, {
      state,
      cards: ["1", "2", "3", "5"],
      participantId: "user-2",
      isModerator: false,
      onVote: vi.fn(),
      onReveal: vi.fn(),
    });
    const selected = el.querySelector("[data-card='5']");
    expect(selected!.classList.contains("selected")).toBe(true);
  });

  it("calls onVote when a card is clicked", () => {
    const el = document.createElement("div");
    const onVote = vi.fn();
    renderVoting(el, {
      state: baseState,
      cards: ["1", "2", "3"],
      participantId: "user-2",
      isModerator: false,
      onVote,
      onReveal: vi.fn(),
    });
    (el.querySelector("[data-card='3']") as HTMLButtonElement).click();
    expect(onVote).toHaveBeenCalledWith("3");
  });

  it("shows Reveal button only for moderator", () => {
    const moderatorEl = document.createElement("div");
    renderVoting(moderatorEl, {
      state: baseState,
      cards: ["1"],
      participantId: "user-1",
      isModerator: true,
      onVote: vi.fn(),
      onReveal: vi.fn(),
    });
    expect(moderatorEl.querySelector("[data-action='reveal']")).not.toBeNull();

    const participantEl = document.createElement("div");
    renderVoting(participantEl, {
      state: baseState,
      cards: ["1"],
      participantId: "user-2",
      isModerator: false,
      onVote: vi.fn(),
      onReveal: vi.fn(),
    });
    expect(participantEl.querySelector("[data-action='reveal']")).toBeNull();
  });

  it("calls onReveal when Reveal button is clicked", () => {
    const el = document.createElement("div");
    const onReveal = vi.fn();
    renderVoting(el, {
      state: baseState,
      cards: ["1"],
      participantId: "user-1",
      isModerator: true,
      onVote: vi.fn(),
      onReveal,
    });
    (el.querySelector("[data-action='reveal']") as HTMLButtonElement).click();
    expect(onReveal).toHaveBeenCalled();
  });

  it("shows how many participants have voted", () => {
    const el = document.createElement("div");
    const state = castVote(castVote(baseState, "user-2", "5"), "user-3", "8");
    renderVoting(el, {
      state,
      cards: ["1", "2", "5", "8"],
      participantId: "user-2",
      isModerator: false,
      onVote: vi.fn(),
      onReveal: vi.fn(),
    });
    expect(el.textContent).toContain("2");
  });
});

describe("renderRevealed", () => {
  it("shows the ticket name", () => {
    const el = document.createElement("div");
    const state = reveal(castVote(baseState, "user-2", "5"));
    renderRevealed(el, {
      state,
      summary: summarize(state.votes),
      isModerator: false,
      onNewRound: vi.fn(),
    });
    expect(el.textContent).toContain("AUTH-42");
  });

  it("shows each participant's vote", () => {
    const el = document.createElement("div");
    const state = reveal(castVote(baseState, "user-2", "5"));
    renderRevealed(el, {
      state,
      summary: summarize(state.votes),
      isModerator: false,
      onNewRound: vi.fn(),
    });
    expect(el.textContent).toContain("5");
  });

  it("shows average when numeric votes exist", () => {
    const el = document.createElement("div");
    const state = reveal(castVote(castVote(baseState, "u1", "3"), "u2", "5"));
    renderRevealed(el, {
      state,
      summary: summarize(state.votes),
      isModerator: false,
      onNewRound: vi.fn(),
    });
    expect(el.textContent).toContain("4");
  });

  it("shows consensus indicator when all votes match", () => {
    const el = document.createElement("div");
    const state = reveal(castVote(castVote(baseState, "u1", "5"), "u2", "5"));
    renderRevealed(el, {
      state,
      summary: summarize(state.votes),
      isModerator: false,
      onNewRound: vi.fn(),
    });
    expect(el.querySelector("[data-consensus]")).not.toBeNull();
  });

  it("shows New Round button only for moderator", () => {
    const modEl = document.createElement("div");
    const state = reveal(baseState);
    renderRevealed(modEl, {
      state,
      summary: summarize(state.votes),
      isModerator: true,
      onNewRound: vi.fn(),
    });
    expect(modEl.querySelector("[data-action='new-round']")).not.toBeNull();

    const partEl = document.createElement("div");
    renderRevealed(partEl, {
      state,
      summary: summarize(state.votes),
      isModerator: false,
      onNewRound: vi.fn(),
    });
    expect(partEl.querySelector("[data-action='new-round']")).toBeNull();
  });

  it("calls onNewRound when button is clicked", () => {
    const el = document.createElement("div");
    const onNewRound = vi.fn();
    const state = reveal(baseState);
    renderRevealed(el, {
      state,
      summary: summarize(state.votes),
      isModerator: true,
      onNewRound,
    });
    (el.querySelector("[data-action='new-round']") as HTMLButtonElement).click();
    expect(onNewRound).toHaveBeenCalled();
  });
});
