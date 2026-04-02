# Planning Poker — Google Meet Add-on

A planning poker add-on for Google Meet. Real-time sync is handled by the Meet Co-Doing API — no backend required.

## Prerequisites

- Node.js 20+
- A [Google Cloud project](https://console.cloud.google.com) (free)
- A GitHub repository with GitHub Pages enabled

---

## 1. Google Cloud Setup

### Create the project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project (e.g. `planning-poker`)
2. Note the **Project Number** (visible on the project dashboard — not the Project ID)

### Enable APIs

In **APIs & Services → Library**, enable:
- `Google Workspace Marketplace SDK`
- `Google Workspace Add-ons API`

### Configure the Marketplace SDK

Go to **APIs & Services → Google Workspace Marketplace SDK → App Configuration**:

- **App Visibility**: Private
- **Installation Settings**: Admin Only or User-installable (your preference)
- **App Name**: Planning Poker
- Under **Meet Add-on**, create an HTTP deployment with this manifest (fill in your GitHub Pages URL):

```json
{
  "addOns": {
    "common": {
      "name": "Planning Poker",
      "logoUrl": "https://<your-org>.github.io/<repo>/logo.png"
    },
    "meet": {
      "web": {
        "sidePanelUrl": "https://<your-org>.github.io/<repo>/side-panel/index.html",
        "addOnOrigins": [
          "https://<your-org>.github.io"
        ]
      }
    }
  }
}
```

---

## 2. Local Development

```sh
cp .env.example .env
# edit .env and set VITE_CLOUD_PROJECT_NUMBER
npm install
npm run dev
```

**.env.example**
```
VITE_CLOUD_PROJECT_NUMBER=123456789012
```

Run tests:
```sh
npm test
```

---

## 3. Deploy to GitHub Pages

Build the app:
```sh
npm run build
```

Push the `dist/` folder to the `gh-pages` branch:
```sh
git subtree push --prefix dist origin gh-pages
```

The first time, you may need to initialize the branch:
```sh
git checkout --orphan gh-pages
git rm -rf .
git checkout main -- dist/
git mv dist/* .
git commit -m "Initial gh-pages deploy"
git push origin gh-pages
git checkout main
```

Then enable GitHub Pages in your repo settings: **Settings → Pages → Source: `gh-pages` branch, root folder**.

Your add-on will be live at `https://<your-org>.github.io/<repo>/`.

---

## 4. Install for Your Team

After deploying, share the direct install URL with teammates. Find it in the GCP console:

**Marketplace SDK → App Configuration → Actions → Install App**

Copy and share that URL. Each teammate opens it and clicks Install.

Alternatively, a Google Workspace admin can push the add-on to all users in the domain via **Admin Console → Apps → Google Workspace Marketplace Apps**.

---

## 5. Using the Add-on in a Meeting

1. Start or join a Google Meet call
2. Click the add-on icon in the Meet toolbar and open **Planning Poker**
3. The moderator (whoever opens it first) types a ticket name, selects a deck, and clicks **Start Session**
4. All participants see a prompt to join — once accepted, the voting board opens
5. Each participant clicks a card to vote
6. The moderator clicks **Reveal** to show all votes simultaneously
7. The moderator clicks **New Round** to start the next ticket

---

## Project Structure

```
src/
  shared/
    state.ts      — PokerState: createRound, castVote, reveal, newRound
    codec.ts      — encode/decode state to Uint8Array (Co-Doing API format)
    deck.ts       — Card decks: Fibonacci, T-shirt, Powers of 2
    results.ts    — Vote summary: average, distribution, consensus
  side-panel/
    render.ts     — renderIdle (form), renderActive (session in progress)
    side-panel.ts — Meet SDK wiring: createAddonSession, startActivity
    index.html
  main-stage/
    render.ts     — renderVoting, renderRevealed
    main-stage.ts — Meet SDK wiring: createCoDoingClient, broadcastStateUpdate
    index.html
```
