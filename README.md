# N8N Workflow Dashboard

A personal dashboard to trigger and manage N8N workflows via webhooks. Built with Next.js, React, Redux, and Tailwind CSS.

**100% Local Storage** — No account required. All data is stored in your browser's localStorage.

![N8N Workflow Dashboard](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=flat-square&logo=redux)

## Features

- **Workflow Management** — Create, edit, and delete workflow configurations
- **Dynamic Request Builder** — Build custom request bodies with key-value pairs
- **Webhook Triggering** — Trigger N8N workflows and view responses in real-time
- **Execution History** — Track all workflow executions with status and response data
- **Response Parsing** — JSON responses are parsed and displayed in a structured tree view
- **Local Persistence** — All data stored locally in your browser - no account needed
- **Portrait-Optimized UI** — Designed for vertical/portrait displays

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/trouthouse-tech/n8n-dashboard.git
   cd n8n-workflow-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it! No environment variables or backend setup required.

## Usage

### Creating a Workflow

1. Click **"+ Add Workflow"** on the home page
2. Enter a name for your workflow
3. Paste your N8N webhook URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/xxx`)
4. Optionally add default body parameters
5. Click **"Create Workflow"**

### Triggering a Workflow

1. Click **"Run"** on any workflow card
2. Modify the request body parameters if needed
3. Click **"Trigger Workflow"**
4. View the response in real-time

### Viewing Execution History

- Each workflow detail page shows the last 10 executions
- Click on any execution to see full details including:
  - Request URL and body
  - Parsed JSON response
  - Error messages (if any)

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Persistence**: Browser localStorage (no backend required)

## Architecture Overview

- **Next.js App Router** — Landing page at root; main app lives under `app/(app)`
- **Feature Packages** — UI organized by feature in `src/packages` (workflow list/detail, execution detail, workflow modal, signup)
- **Redux Toolkit Store** — `builders` (UI flags), `current` (selected entities), and `dumps` (collections) hydrated via async thunks
- **API Layer** — `src/api/service` provides localStorage-backed CRUD for workflows, executions, responses, and users; webhook calls proxy through `app/api/trigger-webhook`
- **N8N Parsing** — `src/lib/n8n` handles workflow parsing, validation, and extraction helpers
- **Shared UI** — Layout, navigation, and marketing components in `src/components`; app context in `src/context/app`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root shell
│   ├── page.tsx            # Marketing landing
│   ├── signup/             # Optional profile setup
│   ├── api/trigger-webhook # Proxy to call N8N webhook
│   └── (app)/              # Main app shell
│       ├── layout.tsx
│       ├── workflows/                  # Workflow list page
│       ├── workflow/[id]/              # Workflow detail page
│       ├── workflow-execution/[id]/    # Execution detail page
│       └── welcome/                    # Onboarding
├── api/
│   └── service/            # localStorage-backed services
├── components/             # Shared layout/navigation/marketing UI
├── context/                # App context + hook
├── lib/
│   ├── storage/            # localStorage utilities
│   └── n8n/                # Workflow parsing, validators, extractors
├── model/                  # Domain types
├── packages/               # Feature modules (one component/hook per file)
│   ├── workflow-list/              # List view + header/actions
│   ├── workflow-detail/            # Detail view, steps, triggers, history
│   ├── workflow-modal/             # Creation/import modal
│   ├── workflow-execution-detail/  # Response & execution details
│   └── signup/                     # Profile setup form + inputs
├── store/                  # Redux store configuration
│   ├── builders/           # UI state slices
│   ├── current/            # Current entity slices
│   ├── dumps/              # Cached collections
│   └── thunks/             # Async calls to localStorage + webhook proxy
└── app/globals.css         # Global Tailwind setup
```

## How It Works

1. **Workflows** are saved in browser localStorage with webhook URL, defaults, agent prompts, and path steps
2. Triggering a workflow sends the request through the `api/trigger-webhook` route to avoid CORS issues
3. Executions and responses are written to localStorage and hydrated into Redux via thunks
4. UI reads from Redux selectors; localStorage is the persistence layer

## Data Storage

All data is stored in your browser's localStorage under these keys:
- `n8n_workflows` — Your workflow configurations
- `n8n_workflow_executions` — Execution history
- `n8n_workflow_responses` — Webhook responses
- `n8n_user` — Your profile (optional)
- `n8n_app_state` — App state (onboarding completion, etc.)

To reset all data, use the "Reset App" button in the sidebar, or clear your browser's localStorage.

## N8N Webhook Setup

To use this dashboard, you need N8N workflows with webhook triggers:

1. In N8N, create a workflow with a **Webhook** node as the trigger
2. Set the webhook to accept POST requests
3. Copy the **Production** webhook URL (not the test URL)
4. Make sure your workflow is **activated**

> **Note**: Test webhook URLs (`/webhook-test/...`) only work when the workflow editor is open. Use production URLs for the dashboard.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License — see [LICENSE](LICENSE) for details.
