import { renderVoting, renderRevealed } from "./render";
import { castVote, reveal, newRound, type PokerState } from "../shared/state";
import { encode, decode } from "../shared/codec";
import { getDeck, type DeckKey } from "../shared/deck";
import { summarize } from "../shared/results";

declare const window: Window & {
  meet: {
    addon: {
      createAddonSession(options: { cloudProjectNumber: string }): Promise<MeetAddonSession>;
    };
  };
};

interface MeetAddonSession {
  createMeetMainStageClient(): Promise<MeetMainStageClient>;
}

interface MeetMainStageClient {
  getParticipantId(): Promise<string>;
  getActivityStartingState(): Promise<{ additionalData?: string }>;
  createCoDoingClient(options: {
    activityTitle: string;
    onGlobalStateChanged(state: { bytes: Uint8Array }): void;
  }): Promise<CoDoingClient>;
}

interface CoDoingClient {
  broadcastStateUpdate(state: { bytes: Uint8Array }): Promise<void>;
}

const CLOUD_PROJECT_NUMBER = import.meta.env.VITE_CLOUD_PROJECT_NUMBER as string;

async function main() {
  const container = document.getElementById("app")!;

  const session = await window.meet.addon.createAddonSession({ cloudProjectNumber: CLOUD_PROJECT_NUMBER });
  const mainStageClient = await session.createMeetMainStageClient();

  const [participantId, startingState] = await Promise.all([
    mainStageClient.getParticipantId(),
    mainStageClient.getActivityStartingState(),
  ]);

  const { deckKey, initialState } = JSON.parse(startingState.additionalData ?? "{}") as {
    deckKey: DeckKey;
    initialState: number[];
  };

  const cards = getDeck(deckKey).cards;
  let state: PokerState = decode(new Uint8Array(initialState));

  const coDoingClient = await mainStageClient.createCoDoingClient({
    activityTitle: "Planning Poker",
    onGlobalStateChanged({ bytes }) {
      state = decode(bytes);
      render();
    },
  });

  async function broadcast(next: PokerState) {
    state = next;
    await coDoingClient.broadcastStateUpdate({ bytes: encode(next) });
  }

  function render() {
    const isModerator = participantId === state.moderatorId;
    if (state.revealed) {
      renderRevealed(container, {
        state,
        summary: summarize(state.votes),
        isModerator,
        onNewRound: () => {
          const ticket = prompt("Next ticket name:") ?? "";
          if (ticket) broadcast(newRound(state, ticket));
        },
      });
    } else {
      renderVoting(container, {
        state,
        cards,
        participantId,
        isModerator,
        onVote: (card) => broadcast(castVote(state, participantId, card)),
        onReveal: () => broadcast(reveal(state)),
      });
    }
  }

  render();
}

main();
