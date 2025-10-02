# Codex CLI Setup for Better Being

This guide replaces the legacy Claude-specific workflow so you can run the same
MCP-enabled design tooling with the Codex CLI.

## 1. Install or update Codex CLI

```bash
npm install -g @openai/codex
# or: brew install codex
```

Verify the version:

```bash
codex --version
```

## 2. Configure Codex

1. Copy `codex-config.example.toml` into `~/.codex/config.toml` (merge with your
   existing config if you already have one).
2. Set your OpenAI auth: `codex login` and choose ChatGPT or provide an API key.
3. Confirm Codex sees the MCP servers:

   ```bash
   codex mcp list
   ```

   You should see entries for the Playwright workflow tools.

## 3. Run Codex with MCP helpers

From the repository root:

```bash
codex --cd "$(pwd)" "Run the AI design iteration workflow"
```

Codex will automatically start the configured MCP servers when it needs them.
Keep the Next.js dev server running (`npm run dev`) so Playwright can reach
`http://localhost:5173`.

## 4. Troubleshooting tips

- If Codex cannot launch a server, run `codex mcp get <server-name>` to inspect
  the command and environment.
- Ensure Playwright dependencies are installed: `npm run playwright:install`.
- For clean runs, delete any stale output folders referenced in the env vars
  inside `codex-config.example.toml`.
- Use `codex --sandbox danger-full-access` only in a containerized environment.

This setup keeps the existing MCP-powered design automation available while you
develop with Codex as your primary agent.
