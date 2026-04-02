export interface PokerState {
  ticket: string;
  moderatorId: string;
  votes: Record<string, string>;
  revealed: boolean;
  roundId: string;
}

export function createRound({
  ticket,
  moderatorId,
}: {
  ticket: string;
  moderatorId: string;
}): PokerState {
  return {
    ticket,
    moderatorId,
    votes: {},
    revealed: false,
    roundId: crypto.randomUUID(),
  };
}

export function castVote(
  state: PokerState,
  participantId: string,
  card: string
): PokerState {
  return { ...state, votes: { ...state.votes, [participantId]: card } };
}

export function reveal(state: PokerState): PokerState {
  return { ...state, revealed: true };
}

export function newRound(state: PokerState, ticket: string): PokerState {
  return {
    ...state,
    ticket,
    votes: {},
    revealed: false,
    roundId: crypto.randomUUID(),
  };
}
