# TaleMaker — Development Environment Setup

How to set up Claude Code with Chrome browser automation for this project.

## Prerequisites

- Windows 10/11
- Google Chrome installed
- An Anthropic API key or Claude subscription

## Step 1: Install Node.js

Download and install Node.js v25+ from https://nodejs.org (LTS is fine too, v20+).

Verify:
```
node --version
npm --version
```

## Step 2: Install Claude Code

```
npm install -g @anthropic-ai/claude-code
```

Verify:
```
claude --version
```

Then authenticate:
```
claude
```

Follow the prompts to log in with your Anthropic account.

## Step 3: Configure Claude Code settings

Set the default model and enable voice:

```
claude config set model opus
claude config set voiceEnabled true
```

Or manually create/edit `~/.claude/settings.json`:
```json
{
  "model": "opus",
  "autoUpdatesChannel": "latest",
  "voiceEnabled": true,
  "voice": {
    "enabled": true,
    "mode": "hold"
  }
}
```

## Step 4: Install the Chrome Extension (Claude in Chrome)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right)
3. Search the Chrome Web Store for **"Claude in Chrome"** (by Anthropic) and install it
4. After installing, run this in your terminal to set up the native messaging host:
   ```
   claude chrome install
   ```
   This creates the native host bridge at `~/.claude/chrome/chrome-native-host.bat` so the extension can communicate with Claude Code.
5. Restart Chrome after installation.

### Verify Chrome connection

1. Open Claude Code in a terminal: `claude`
2. The Chrome extension icon should show as connected
3. Test with: ask Claude to open a new tab or read a page

## Step 5: Clone and set up this project

```
git clone <your-repo-url>
cd TaleMaker
npm install
```

### Configure git identity

```
git config user.name "Gilad-Bron"
git config user.email "gilad.bron@gmail.com"
```

## Step 6: Run the project

```
npm run dev
```

Opens at http://localhost:5173

## Step 7: Start Claude Code

In the project directory:
```
claude
```

### Useful commands inside Claude Code

- **Hold Space** — voice input (dictate instead of type)
- `/help` — see all commands
- `/clear` — clear conversation context
- `/voice` — toggle voice mode
- Type normally to ask Claude to edit code, run commands, or control the browser

## Project permissions (auto-configured)

The project has a `.claude/settings.local.json` that pre-approves common commands (npm, git, etc.) so you don't get prompted every time. These are scoped to this project only.

## Tech Stack

- React + TypeScript
- Vite (dev server & build)
- Tailwind CSS v4 + ShadCN UI
- React Router (client-side routing)
- localStorage (persistence, no backend)
