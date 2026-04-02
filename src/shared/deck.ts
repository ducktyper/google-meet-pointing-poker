export type DeckKey = "fibonacci" | "tshirt" | "powers2";

export interface Deck {
  label: string;
  cards: string[];
}

export const DECKS: Record<DeckKey, Deck> = {
  fibonacci: {
    label: "Fibonacci",
    cards: ["1", "2", "3", "5", "8", "13", "21", "?", "∞"],
  },
  tshirt: {
    label: "T-Shirt",
    cards: ["XS", "S", "M", "L", "XL", "?", "∞"],
  },
  powers2: {
    label: "Powers of 2",
    cards: ["1", "2", "4", "8", "16", "32", "?", "∞"],
  },
};

export function getDeck(key: DeckKey): Deck {
  return DECKS[key];
}
