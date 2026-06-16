# CLAUDE.md

Project memory for ALFI. Read this before any design/build work.

## RULE #0 — Never invent

NEVER invent anything — names, values, components, APIs, content, data — unless explicitly asked.
Use what exists (MUI defaults, the design system, provided specs). When unsure, ask. Do not assume.
Read Mark's text exactly. Don't paraphrase or "improve" his copy. Word for word, slide for slide.

## How to talk to Mark

- Brutally concise. No preamble, no recap, no "Great question", no summary of what you did.
- Plain language. Mark is non-technical. No jargon.
- One sentence beats three. 5 words if 5 words do it.
- Never narrate reasoning unless asked. Just do it.
- One acknowledgement max if you screw up. Then fix it.
- He swears when frustrated. Don't apologize in paragraphs. Fix the thing.
- If he repeats himself, you didn't listen. Re-read his last message.

## How to work

- Batch all changes in one pass. Don't ask "one by one?".
- Verify visually before showing. Screenshot/check yourself. Compare to previous version + any reference image. Don't make Mark QA.
- Don't double-confirm. "Do X" → do X.
- Iterative tweaks ("25% wider", "brighter") are relative to current state.

## Version & deploy workflow (CRITICAL — every code/web change)

1. Every request bumps version by 1 (footer tag `vN`). Increment after each change.
2. Build, commit, push.
3. ALWAYS give a LIVE githack link, every time: `https://rawcdn.githack.com/marklevi7/alfi/{full-SHA}/dist/index.html`. Triple-check it loads (200 + renders) before sending. NO PNG screenshots in chat — Mark wants the live app link.
4. One link per response. Nothing else.
5. Commit messages: `vN: short description`.

## Branch rules

- Dev branch: `claude/new-session-n35oug`. Never push main unless told.
- After push, create PR if none exists.

## Design

- Use `/impeccable` skill for design decisions.
- Compare output to reference images. Don't ship mismatches.

## CRITICAL RULE — Canonical MUI only (never violate)

All UI is built with **canonical MUI v5.14**. No exceptions.

- ✅ MUI components only (`Button`, `TextField`, `Card`, `Dialog`, ...).
- ✅ `theme` tokens, palette, spacing, typography, breakpoints, shape — via `sx`, `styled`, or theme.
- ❌ NO custom components.
- ❌ NO custom colors.
- ❌ NO raw hex values (`#ababab`) anywhere.
- ❌ Do NOT invent a palette or tokens. MUI defaults already define everything.

Enforced by ESLint (`.eslintrc.cjs`) + CI — hex/CSS-file = build fails.

## Copy / content rules (sales/presentation context)

- Currency ILS (₪). Never convert to USD.
- Frame savings as recovered waste/revenue, never replaced salary/headcount. Banned words: replace, fire, lay off, FTE, headcount, salary.
- Audience: 50+ enterprise decision-makers. Warm, simple, professional.
- No em dashes. Use commas, colons, semicolons, periods, parentheses.
- No AI-writing tells (no rule-of-three, no stacked short sentences, no self-narration).

## Project facts

- Hebrew-first, RTL only (no language switching).
- MUI v5.14, React, Emotion with RTL cache (`stylis` + `stylis-plugin-rtl@^2`).
- Accessibility target: WCAG 2.0 A/AA (Israeli SI 5568). See `docs/`.
