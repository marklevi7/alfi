---
description: Instantly run the local ALFI preview and open it in the browser (no questions)
allowed-tools: Bash(npm install), Bash(npm run dev:*), Bash(npm run preview:*), Bash(npm run build:*), Bash(open:*), Bash(xdg-open:*), Bash(cmd /c start:*)
---

Immediately, and WITHOUT asking any questions or waiting for confirmation, start the ALFI local
preview and open it in the default browser.

Steps:
1. If `node_modules/` does not exist, run `npm install` first (silently).
2. Start the Vite dev server in the background with the browser auto-opening:
   `npm run dev -- --open --host`
   (Vite prints a Local URL, default http://localhost:5173, and opens it automatically.)
3. If the browser did not open on its own, open the Local URL with the OS opener:
   - macOS: `open <url>`
   - Linux: `xdg-open <url>`
   - Windows: `cmd /c start <url>`
4. Reply with just the Local URL. Nothing else. Do not ask questions.

Notes:
- This is the live dev server (hot reload, reflects current `src/`). It runs locally only —
  it does not work in a remote/web session.
- Leave the server running in the background so the browser stays live.
