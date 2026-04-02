import { DECKS, type DeckKey } from "../shared/deck";

interface IdleOptions {
  onStart: (params: { ticket: string; deckKey: DeckKey }) => void;
}

interface ActiveOptions {
  ticket: string;
  onNewRound?: () => void;
}

export function renderIdle(container: HTMLElement, { onStart }: IdleOptions): void {
  container.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ticket name";

  const select = document.createElement("select");
  for (const [key, deck] of Object.entries(DECKS)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = deck.label;
    select.appendChild(option);
  }

  const btn = document.createElement("button");
  btn.textContent = "Start Session";
  btn.disabled = true;

  input.addEventListener("input", () => {
    btn.disabled = input.value.trim() === "";
  });

  btn.addEventListener("click", () => {
    onStart({ ticket: input.value.trim(), deckKey: select.value as DeckKey });
  });

  container.appendChild(input);
  container.appendChild(select);
  container.appendChild(btn);
}

export function renderActive(container: HTMLElement, { ticket, onNewRound }: ActiveOptions): void {
  container.innerHTML = "";

  const label = document.createElement("p");
  label.textContent = ticket;

  const btn = document.createElement("button");
  btn.textContent = "New Round";
  btn.addEventListener("click", () => onNewRound?.());

  container.appendChild(label);
  container.appendChild(btn);
}
