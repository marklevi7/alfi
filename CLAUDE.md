# CLAUDE.md

Project memory for ALFI. Read this before any design/build work.

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
