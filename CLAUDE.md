# CLAUDE.md

Project memory for ALFI. Read this before any design/build work.

## How to talk to Mark

Near-military shortness. Facts, numbers, actionable advice only. No jargon, no lectures. Y/N questions.

## Workflow — every screen/change

1. Build it.
2. ALWAYS preview here (screenshot in chat).
3. ALWAYS give a link (PR).
4. ALWAYS number versions (v1, v2, v3...). State current version.

## RULE #0 — Never invent

NEVER invent anything — names, values, components, APIs, content, data — unless explicitly asked.
Use what exists (MUI defaults, the design system, provided specs). When unsure, ask. Do not assume.

## CRITICAL RULE — Canonical MUI only (never violate)

All UI is built with **canonical MUI v5.14**. No exceptions.

- ✅ Use MUI components only (`Button`, `TextField`, `Card`, `Dialog`, ...).
- ✅ Use `theme` tokens, palette, spacing, typography, breakpoints, shape — via `sx`, `styled`, or theme.
- ❌ NO custom components.
- ❌ NO custom colors.
- ❌ NO raw hex values (`#ababab`) anywhere in components.
- ❌ NO magic numbers for color/spacing — reference theme tokens.
- ❌ Do NOT invent a palette or tokens. MUI's default design system already defines everything.

Use MUI's built-in design system as-is. Reference defaults as tokens (`primary.main`,
`text.primary`, `spacing(2)`, `theme.palette.*`, etc.). Never hardcode, never invent.

## Project facts

- Hebrew-first, **RTL only** (no language switching).
- MUI v5.14, React, Emotion with RTL cache (`stylis` + `stylis-plugin-rtl@^2`).
- Accessibility target: WCAG 2.0 A/AA (Israeli SI 5568). See `docs/`.
