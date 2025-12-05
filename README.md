# N8N Workflow Dashboard

A personal dashboard to trigger and manage N8N workflows via webhooks. Built with Next.js, React, Redux, and Tailwind CSS.

![N8N Workflow Dashboard](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=flat-square&logo=redux)

## Features

- **Workflow Management** — Create, edit, and delete workflow configurations
- **Dynamic Request Builder** — Build custom request bodies with key-value pairs
- **Webhook Triggering** — Trigger N8N workflows and view responses in real-time
- **Execution History** — Track all workflow executions with status and response data
- **Response Parsing** — JSON responses are parsed and displayed in a structured tree view
- **Cloud Persistence** — Workflows, executions, and responses are stored per user in Firebase
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

3. Set up Firebase (optional but recommended):
   
   Create a `.env.local` file with your Firebase configuration:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-your-measurement-id
   ```

   Get these values from: [Firebase Console](https://console.firebase.google.com/) > Project Settings > Your apps > Firebase SDK snippet

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- **Backend**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Functions)
- **Data**: Firebase Firestore (per-user collections)

## Architecture Overview

- **Next.js App Router** — Marketing/auth pages at the root; authenticated experience lives under `app/(app)`
- **Feature Packages** — UI is organized by feature in `src/packages` (workflow list/detail, execution detail, workflow modal, signup)
- **Redux Toolkit Store** — `builders` (UI flags), `current` (selected entities), and `dumps` (collections) hydrated via async thunks
- **API Layer** — `src/api/firestore` wraps Firestore CRUD for workflows, executions, responses, and users; webhook calls proxy through `app/api/trigger-webhook`
- **N8N Parsing** — `src/lib/n8n` handles workflow parsing, validation, and extraction helpers
- **Shared UI** — Layout, navigation, and marketing components live in `src/components`; auth context is in `src/context/auth`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root shell (marketing/auth)
│   ├── page.tsx            # Marketing landing
│   ├── login/ | signup/    # Auth pages
│   ├── api/trigger-webhook # Proxy to call N8N webhook
│   └── (app)/              # Authenticated shell
│       ├── layout.tsx
│       ├── workflows/                  # Workflow list page
│       ├── workflow/[id]/              # Workflow detail page
│       ├── workflow-execution/[id]/    # Execution detail page
│       └── welcome/                    # Onboarding
├── api/
│   └── firestore/          # Firestore services, mutators, retrievers
├── components/             # Shared layout/navigation/marketing UI
├── context/                # Auth context + hook
├── lib/
│   ├── firebase/           # Firebase config
│   └── n8n/                # Workflow parsing, validators, extractors
├── model/                  # Domain types
├── packages/               # Feature modules (one component/hook per file)
│   ├── workflow-list/              # List view + header/actions
│   ├── workflow-detail/            # Detail view, steps, triggers, history
│   ├── workflow-modal/             # Creation/import modal
│   ├── workflow-execution-detail/  # Response & execution details
│   └── signup/                     # Signup form + inputs
├── store/                  # Redux store configuration
│   ├── builders/           # UI state slices
│   ├── current/            # Current entity slices
│   ├── dumps/              # Cached collections
│   └── thunks/             # Async calls to Firestore + webhook proxy
└── app/globals.css         # Global Tailwind setup
```

## How It Works

1. **Workflows** are saved per user in Firebase Firestore with webhook URL, defaults, agent prompts, and path steps
2. Triggering a workflow sends the request through the `api/trigger-webhook` route to avoid CORS issues
3. Executions and responses are written to Firestore and hydrated into Redux via thunks
4. UI reads from Redux selectors; Firestore is the source of truth for persistence

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
