import { renderIdle, renderActive } from "./render";
import { createRound } from "../shared/state";
import { encode } from "../shared/codec";

declare const window: Window & {
  meet: {
    addon: {
      createAddonSession(options: { cloudProjectNumber: string }): Promise<MeetAddonSession>;
    };
  };
};

interface MeetAddonSession {
  createMeetSidePanelClient(): Promise<MeetSidePanelClient>;
}

interface MeetSidePanelClient {
  getParticipantId(): Promise<string>;
  startActivity(options: { mainStageUrl: string; additionalData?: string }): Promise<void>;
}

const CLOUD_PROJECT_NUMBER = import.meta.env.VITE_CLOUD_PROJECT_NUMBER as string;
const MAIN_STAGE_URL = `${location.origin}${location.pathname.replace("side-panel", "main-stage")}/index.html`;

async function main() {
  const container = document.getElementById("app")!;

  const session = await window.meet.addon.createAddonSession({ cloudProjectNumber: CLOUD_PROJECT_NUMBER });
  const sidePanelClient = await session.createMeetSidePanelClient();
  const moderatorId = await sidePanelClient.getParticipantId();

  renderIdle(container, {
    onStart: async ({ ticket, deckKey }) => {
      const state = createRound({ ticket, moderatorId });
      await sidePanelClient.startActivity({
        mainStageUrl: MAIN_STAGE_URL,
        additionalData: JSON.stringify({ deckKey, initialState: encode(state) }),
      });
      renderActive(container, {
        ticket,
        onNewRound: () => renderIdle(container, { onStart: () => {} }),
      });
    },
  });
}

main();
