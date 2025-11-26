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
- **Local Storage** — All data persists locally in your browser (no backend required)
- **Portrait-Optimized UI** — Designed for vertical/portrait displays

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mattruiz123/n8n-workflow-dashboard.git
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
- **Storage**: Browser localStorage

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (webhook proxy)
│   ├── workflow/[id]/      # Workflow detail page
│   └── workflow-execution/[id]/  # Execution detail page
├── components/             # Shared components
├── model/                  # TypeScript type definitions
├── packages/               # Feature components
│   ├── workflow-list/      # Workflow list & modal
│   ├── workflow-detail/    # Workflow execution UI
│   └── workflow-execution-detail/  # Execution details
└── store/                  # Redux store
    ├── builders/           # UI state slices
    ├── current/            # Current entity slices
    ├── dumps/              # Data collection slices
    └── thunks/             # Async actions
```

## How It Works

1. **Workflows** are saved configurations containing a webhook URL and default parameters
2. When you trigger a workflow, the request is proxied through a Next.js API route to avoid CORS issues
3. The execution (request + response) is saved to localStorage for history
4. All data is stored locally in your browser — no external database required

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
