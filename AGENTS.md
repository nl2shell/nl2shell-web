# AGENTS.md — nl2shell-web

Agent context for AI coding assistants. Read this before modifying any code in this repo.

---

## What this repo is

nl2shell-web is the Next.js 16 website and MCP server for [nl2shell.com](https://nl2shell.com). It provides a browser UI and a JSON-RPC 2.0 MCP endpoint that lets any AI agent translate natural language to shell commands, execute them in an isolated Docker sandbox, and get plain-English explanations of shell commands.

The model itself is not in this repo. It lives at [AryaYT/nl2shell-demo](https://huggingface.co/spaces/AryaYT/nl2shell-demo) on HuggingFace as a Gradio Space.

---

## Organization repos

| Repo | Purpose | URL |
|------|---------|-----|
| **nl2shell** | ML model training (QLoRA fine-tune) | https://github.com/nl2shell/nl2shell |
| **nl2shell-web** (this) | Next.js website + MCP server | https://github.com/nl2shell/nl2shell-web |
| **vox** | Voice CLI for terminal | https://github.com/nl2shell/vox |
| **sandbox-bash-mcp** | Docker sandbox MCP server | https://github.com/nl2shell/sandbox-bash-mcp |
| **collab** | Desktop app | https://github.com/nl2shell/collab |

---

## Architecture

```
Browser (React 19 + Next.js 16)
  |
  |-- /api/translate  →  Gradio Client  →  HuggingFace Space (AryaYT/nl2shell-demo)
  |                        Qwen3.5-0.8B + QLoRA fine-tune (CPU, free tier)
  |
  |-- /api/execute  ──┐
  |-- /api/session  ──┤→  Hono Relay Server (relay/)  →  Docker sandbox container
  |-- /api/mcp      ──┘        port 4000 (default)         (leshell-sandbox image)
  |
  |-- /api/feedback  →  Supabase (optional, best-effort)
```

The relay server is a separate Node.js process in the `relay/` subdirectory. It manages Docker container lifecycle and proxies exec requests. In production it runs on Railway; locally it runs on `localhost:4000`.

---

## MCP server

The MCP endpoint is at `/api/mcp` and implements the [MCP Streamable HTTP transport](https://spec.modelcontextprotocol.io/) (JSON-RPC 2.0).

### Connecting

Add to your MCP client config:

```json
{
  "mcpServers": {
    "leshell": {
      "url": "https://nl2shell.com/api/mcp"
    }
  }
}
```

For local development:

```json
{
  "mcpServers": {
    "leshell": {
      "url": "http://localhost:3000/api/mcp"
    }
  }
}
```

### Protocol

`GET /api/mcp` returns server metadata and tool list (for discovery).

`POST /api/mcp` handles all JSON-RPC 2.0 methods:

| Method | Description |
|--------|-------------|
| `initialize` | Handshake. Returns protocol version `2024-11-05`, server name `leshell`. |
| `tools/list` | Returns all three tool definitions with input schemas. |
| `tools/call` | Calls a named tool with `arguments`. |

### Tools

#### `leshell_translate`

Translate natural language to a shell command.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "leshell_translate",
    "arguments": {
      "query": "find all Python files modified in the last 7 days",
      "os_context": "OS: macOS 15.3 (arm64)"
    }
  }
}
```

- `query` (required, string): Natural language description.
- `os_context` (optional, string): OS hint for platform-specific commands.

Returns `{ "command": "find . -name '*.py' -mtime -7" }`.

Internally calls `POST /api/translate`, which calls the Gradio Space.

#### `leshell_execute`

Execute a shell command inside an isolated Docker sandbox. Requires an active session.

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "leshell_execute",
    "arguments": {
      "sessionId": "uuid-from-session-create",
      "command": "ls -la /tmp",
      "timeout_ms": 10000
    }
  }
}
```

- `sessionId` (required, string): UUID from `POST /api/session`.
- `command` (required, string): Shell command to run.
- `timeout_ms` (optional, number): Max execution time. Default 30000, max 60000.

Returns `{ "stdout": "...", "stderr": "...", "exitCode": 0 }`.

Session must be created first via `POST /api/session` (see API endpoints below). Create a session, get the `id`, pass it here.

#### `leshell_explain`

Explain what a shell command does in plain English.

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "leshell_explain",
    "arguments": {
      "command": "find . -name '*.log' -mtime +30 -delete"
    }
  }
}
```

Returns `{ "explanation": "Deletes all .log files older than 30 days..." }`.

Implemented by re-prompting the translate model with `"explain what this command does: <command>"`. The fine-tuned model interprets this as an explanation request.

---

## API endpoints

All endpoints are Next.js Route Handlers in `app/api/`. All return JSON.

### `POST /api/translate`

Translate a natural language query to a shell command.

Request:
```json
{ "query": "list all running docker containers", "temperature": 0.1, "maxTokens": 128 }
```

- `query` (required): 1–500 characters.
- `temperature` (optional): 0–2, default 0.1.
- `maxTokens` (optional): 1–512, default 128.

Response: `{ "command": "docker ps", "meta": "..." }`

Rate limit: **30 requests/min per IP**.

Connects to the Gradio Space at `AryaYT/nl2shell-demo` via `@gradio/client`. The client is cached at module level to avoid reconnecting per request. On connection error the cache is cleared so the next request reconnects.

### `POST /api/feedback`

Submit thumbs-up or thumbs-down feedback on a translation.

Request:
```json
{
  "query": "list files",
  "command": "ls",
  "rating": "up",
  "correction": "ls -la"
}
```

- `rating`: `"up"` or `"down"`.
- `correction` (optional): The correct command if rating is down.

Response: `{ "ok": true }`

Rate limit: **10 requests/min per IP**. Persists to Supabase if configured, otherwise logs to stdout.

### `POST /api/mcp` / `GET /api/mcp`

MCP endpoint. See MCP server section above.

Rate limit: **20 requests/min per IP**.

### `POST /api/session`

Create a new Docker sandbox session.

Response: `{ "id": "uuid", "status": "running", "createdAt": "ISO8601" }`

Proxies to the relay server at `SANDBOX_RELAY_URL/session`.

### `GET /api/session`

List active sessions from the relay server.

### `GET /api/session/[id]`

Get metadata for a specific session: `{ "id", "status", "containerName", "createdAt", "lastActive" }`.

### `DELETE /api/session/[id]`

Stop and remove a sandbox container. Cleans up Docker resources.

### `POST /api/execute`

Execute a command in an existing session's container.

Request:
```json
{ "sessionId": "uuid", "command": "echo hello", "timeout_ms": 5000 }
```

- `command` max length: 4096 characters.
- `timeout_ms` default: 30000.

Response: `{ "stdout": "hello\n", "stderr": "", "exitCode": 0, "durationMs": 12, "auditId": "..." }`

Rate limit: **10 requests/min per IP**.

---

## Security model

### Dangerous command detection (browser UI)

`lib/safety.ts` defines 21 regex patterns checked client-side before displaying a command to the user. Dangerous commands are flagged with a warning badge but not blocked — the user can still copy them. The detector identifies:

- Recursive/forced deletion (`rm -rf`, `rm -R`)
- Privilege escalation (`sudo`)
- Raw disk operations (`dd if=`, `mkfs`, `shred`, `wipefs`, `fdisk`, `parted`, `> /dev/sd*`)
- Fork bombs (`: () { : | : & }; :`)
- World-writable permissions (`chmod 777`, `chmod +s`)
- System control (`systemctl stop/disable/mask`, `killall`, `reboot`, `shutdown`, `poweroff`)
- Piped remote execution (`curl ... | sh`, `wget ... | sh`)
- Root filesystem manipulation (`mv / `)

### Relay server blocklist (sandbox execution)

`relay/security.ts` defines 16 patterns enforced server-side on every exec request. Blocked commands return HTTP 400 with a reason string and an audit record. The blocklist covers similar patterns to the browser detector but is enforced unconditionally — there is no override path.

Key relay-specific additions: `nsenter`, `mount`, `umount`, `docker`, `kubectl`, `chown root`.

### Sandbox isolation

Each session runs in a dedicated Docker container built from `relay/sandbox.Dockerfile`. Containers are isolated from the host filesystem. The relay manages container lifecycle: create on session start, stop and remove on session delete.

Rate limiting inside the relay: **10 exec/min per session ID** (in addition to the API-layer limit of 10/min per IP).

All exec calls are written to an in-memory audit log (`relay/audit.ts`) with session ID, command, output, status, and duration.

### Rate limiting summary

| Endpoint | Limit | Scope |
|----------|-------|-------|
| `/api/translate` | 30/min | Per IP |
| `/api/feedback` | 10/min | Per IP |
| `/api/mcp` | 20/min | Per IP |
| `/api/execute` | 10/min | Per IP |
| Relay `/exec` | 10/min | Per session |

All rate limiters use in-memory Maps. On Vercel serverless each cold start resets the counter. For persistent cross-instance limiting, replace with Upstash Redis (`@upstash/ratelimit`).

IP detection uses `x-real-ip` (set by Vercel, not spoofable by clients). The code explicitly avoids `x-forwarded-for`.

---

## Build and dev commands

### Next.js app

```bash
# Install dependencies
bun install

# Dev server (localhost:3000)
bun dev

# Production build
bun run build

# Type check
npx tsc --noEmit

# Lint
bun run lint
```

### Relay server

The relay is a separate package in `relay/` with its own `package.json`.

```bash
cd relay
npm install

# Dev server with hot reload (localhost:4000)
npm run dev

# Build sandbox Docker image (required for sandbox execution)
npm run docker:build-sandbox
# Equivalent to: docker build -t leshell-sandbox -f sandbox.Dockerfile .

# Production start
npm run start
```

The relay requires Docker to be running locally. Without it, session creation and exec calls will fail. The Next.js app works without the relay — translate, feedback, and MCP translate/explain all function. Only sandbox execution requires the relay.

### Full local setup

```bash
# Terminal 1: relay server
cd /path/to/nl2shell-web/relay
npm install
docker build -t leshell-sandbox -f sandbox.Dockerfile .
npm run dev

# Terminal 2: Next.js app
cd /path/to/nl2shell-web
bun install
bun dev
```

---

## Environment variables

Create `.env.local` in the repo root:

```bash
# HuggingFace token — avoids anonymous rate limits on the Gradio Space
# Get one at: https://huggingface.co/settings/tokens
HF_TOKEN=hf_your_token_here

# Supabase — enables feedback persistence and usage analytics
# Optional: without this, feedback is logged to stdout only
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Privacy salt for IP hashing in logs
IP_SALT=your-random-salt-here

# Relay server URL — defaults to http://localhost:4000
# In production on Railway: https://leshell-relay.up.railway.app
SANDBOX_RELAY_URL=http://localhost:4000

# Relay server API key — optional, enables Bearer token auth on the relay
# Set the same value in the relay process as RELAY_API_KEY
RELAY_API_KEY=your-relay-key-here
```

None of these are required for the app to start. The translate and explain flows work with zero environment variables (hitting HuggingFace anonymously). Supabase integration is opt-in.

### Relay-specific env vars

Set in the relay process (not `.env.local`):

```bash
RELAY_PORT=4000          # Default: 4000
CORS_ORIGIN=*            # Restrict in production: https://nl2shell.com
RELAY_API_KEY=           # Optional Bearer token for auth
```

---

## Project structure

```
app/
  api/
    translate/route.ts   # POST — NL to shell via Gradio
    feedback/route.ts    # POST — thumbs rating + correction
    mcp/route.ts         # GET/POST — MCP JSON-RPC endpoint
    session/
      route.ts           # POST (create), GET (list)
      [id]/route.ts      # GET (metadata), DELETE (destroy)
    execute/route.ts     # POST — exec in sandbox container

components/              # React 19 UI components (shadcn/ui + custom)
hooks/                   # Custom React hooks (inference state, history, voice)
lib/
  clean-response.ts      # Strips model artifacts from output
  logger.ts              # Structured JSON logger (Vercel-compatible)
  safety.ts              # 21 dangerous command patterns (browser-side)
  sandbox-client.ts      # Fetch helpers for session/execute API
  supabase.ts            # Supabase client (optional persistence)
  utils.ts               # Shared utilities

relay/                   # Separate Node.js process
  server.ts              # Hono HTTP server — session and exec routes
  container-manager.ts   # Docker CLI wrapper (create/exec/stop/remove)
  session-store.ts       # better-sqlite3 session persistence
  security.ts            # 16 blocked patterns (relay-side enforcement)
  audit.ts               # In-memory exec audit log
  sandbox.Dockerfile     # Minimal Alpine image for sandbox containers

supabase/
  schema.sql             # Tables: translations, feedback

types/                   # Shared TypeScript types
```

---

## Dependency notes

- **@gradio/client ^2.x**: Used to call the HuggingFace Gradio Space. The `Client.connect` call uses the space slug `AryaYT/nl2shell-demo` and the `/generate` prediction endpoint.
- **better-sqlite3**: The relay uses SQLite (via better-sqlite3) for session persistence. Sessions survive relay restarts.
- **hono + @hono/node-server**: The relay HTTP framework. Not Next.js — it is a plain Node.js server.
- **motion**: Framer Motion v12 (renamed to `motion`). Used for hero terminal animation and bento grid.
- **next-themes**: Dark/light mode toggle.

---

## Known constraints

- **HuggingFace cold starts**: The free CPU Space sleeps after 48 hours of inactivity and takes ~30 seconds to wake. The translate endpoint returns HTTP 503 with a message during wake-up.
- **In-memory rate limits**: Reset on Vercel cold starts. Use Upstash Redis for production cross-instance limits.
- **Relay not on Vercel**: Vercel serverless functions cannot manage Docker containers. The relay must run on a persistent server (Railway, Fly.io, a VPS). See `NEXT-STEPS.md` for Railway deploy instructions.
- **Session state is local to relay**: Sessions are stored in SQLite on the relay host. They are not replicated. Multiple relay instances would create split session state.
- **leshell_explain via translate model**: The explain tool re-prompts the translate model with an "explain ..." prefix. The fine-tune includes explanation examples, but quality may vary for unusual commands.
