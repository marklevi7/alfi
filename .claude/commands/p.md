---
description: Instantly run the local ALFI preview for whichever project is the current subject (student or teacher), and show it (no questions)
---

Immediately, and WITHOUT asking any questions or waiting for confirmation:

1. Decide the subject from the conversation so far — which project has Mark actually been
   talking about / working on most recently:
   - **Teacher app** ("ALFI for Teachers") if that's the recent subject.
   - **Student app** ("ALFI") otherwise — this is the default when it's unclear or the
     conversation hasn't touched either project yet.
2. `preview_start` with the matching launch.json config (reuses the server if already running):
   - Student → `{ name: "alfi-dev" }` — `Claude Alfi/app`, port 5173.
   - Teacher → `{ name: "alfi-teachers-dev" }` — `Claude Alfi Teachers/app`, port 5174.
3. Reload the tab (`javascript_tool` → `location.reload()`) so the latest code shows.
4. `computer` screenshot on that tab and show it.

Do it silently. No questions, no explanation of which one you picked — just the screenshot.

Notes:
- Local dev server only — doesn't work in a remote/web session.
- Leave the server running in the background so the browser stays live.
- Both launch.json configs already exist at the root `.claude/launch.json`.
