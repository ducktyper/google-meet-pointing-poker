import type { PokerState } from "./state";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function encode(state: PokerState): Uint8Array {
  return encoder.encode(JSON.stringify(state));
}

export function decode(bytes: Uint8Array): PokerState {
  return JSON.parse(decoder.decode(bytes)) as PokerState;
}
