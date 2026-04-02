import type { PokerState } from "../shared/state";
import type { Summary } from "../shared/results";

interface VotingOptions {
  state: PokerState;
  cards: string[];
  participantId: string;
  isModerator: boolean;
  onVote: (card: string) => void;
  onReveal: () => void;
}

interface RevealedOptions {
  state: PokerState;
  summary: Summary;
  isModerator: boolean;
  onNewRound: () => void;
}

export function renderVoting(container: HTMLElement, opts: VotingOptions): void {
  const { state, cards, participantId, isModerator, onVote, onReveal } = opts;
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = state.ticket;
  container.appendChild(title);

  const voteCount = document.createElement("p");
  voteCount.textContent = `${Object.keys(state.votes).length} voted`;
  container.appendChild(voteCount);

  const deck = document.createElement("div");
  for (const card of cards) {
    const btn = document.createElement("button");
    btn.textContent = card;
    btn.dataset.card = card;
    if (state.votes[participantId] === card) btn.classList.add("selected");
    btn.addEventListener("click", () => onVote(card));
    deck.appendChild(btn);
  }
  container.appendChild(deck);

  if (isModerator) {
    const revealBtn = document.createElement("button");
    revealBtn.textContent = "Reveal";
    revealBtn.dataset.action = "reveal";
    revealBtn.addEventListener("click", onReveal);
    container.appendChild(revealBtn);
  }
}

export function renderRevealed(container: HTMLElement, opts: RevealedOptions): void {
  const { state, summary, isModerator, onNewRound } = opts;
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = state.ticket;
  container.appendChild(title);

  const votes = document.createElement("ul");
  for (const [id, card] of Object.entries(state.votes)) {
    const li = document.createElement("li");
    li.textContent = `${id}: ${card}`;
    votes.appendChild(li);
  }
  container.appendChild(votes);

  if (summary.average !== null) {
    const avg = document.createElement("p");
    avg.textContent = `Average: ${summary.average}`;
    container.appendChild(avg);
  }

  if (summary.consensus) {
    const badge = document.createElement("p");
    badge.dataset.consensus = "";
    badge.textContent = "Consensus!";
    container.appendChild(badge);
  }

  if (isModerator) {
    const btn = document.createElement("button");
    btn.textContent = "New Round";
    btn.dataset.action = "new-round";
    btn.addEventListener("click", onNewRound);
    container.appendChild(btn);
  }
}
