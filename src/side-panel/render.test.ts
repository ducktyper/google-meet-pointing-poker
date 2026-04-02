// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { renderIdle, renderActive } from "./render";
import { DECKS } from "../shared/deck";

describe("renderIdle", () => {
  it("renders a ticket input", () => {
    const el = document.createElement("div");
    renderIdle(el, { onStart: vi.fn() });
    expect(el.querySelector("input[type=text]")).not.toBeNull();
  });

  it("renders a deck selector with all decks", () => {
    const el = document.createElement("div");
    renderIdle(el, { onStart: vi.fn() });
    const select = el.querySelector("select");
    expect(select).not.toBeNull();
    const options = select!.querySelectorAll("option");
    expect(options.length).toBe(Object.keys(DECKS).length);
  });

  it("renders a disabled start button when ticket is empty", () => {
    const el = document.createElement("div");
    renderIdle(el, { onStart: vi.fn() });
    const btn = el.querySelector("button");
    expect(btn!.disabled).toBe(true);
  });

  it("enables start button when ticket is typed", () => {
    const el = document.createElement("div");
    renderIdle(el, { onStart: vi.fn() });
    const input = el.querySelector("input")!;
    input.value = "AUTH-42";
    input.dispatchEvent(new Event("input"));
    expect(el.querySelector("button")!.disabled).toBe(false);
  });

  it("calls onStart with ticket and deckKey when submitted", () => {
    const el = document.createElement("div");
    const onStart = vi.fn();
    renderIdle(el, { onStart });
    const input = el.querySelector("input")!;
    input.value = "AUTH-42";
    input.dispatchEvent(new Event("input"));
    el.querySelector("button")!.click();
    expect(onStart).toHaveBeenCalledWith({ ticket: "AUTH-42", deckKey: "fibonacci" });
  });
});

describe("renderActive", () => {
  it("shows the current ticket name", () => {
    const el = document.createElement("div");
    renderActive(el, { ticket: "AUTH-42" });
    expect(el.textContent).toContain("AUTH-42");
  });

  it("renders a new round button", () => {
    const el = document.createElement("div");
    renderActive(el, { ticket: "AUTH-42" });
    expect(el.querySelector("button")).not.toBeNull();
  });

  it("calls onNewRound when new round button is clicked", () => {
    const el = document.createElement("div");
    const onNewRound = vi.fn();
    renderActive(el, { ticket: "AUTH-42", onNewRound });
    el.querySelector("button")!.click();
    expect(onNewRound).toHaveBeenCalled();
  });
});
