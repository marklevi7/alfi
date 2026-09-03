# ALFI

AI-powered educational web platform for high-school math students (Hebrew-first).

## Tech stack

- **React** (SPA)
- **MUI v5.14** (Material UI) as the component library
- **RTL** (right-to-left) — Hebrew is the only UI language; build native RTL, no language switching
- **Emotion** for styling (MUI default), with an RTL-configured cache
- **Figma** for design; design system mirrors MUI component names, variables, and colors 1:1 for clean handoff

## RTL setup notes

For MUI v5.14, configure the Emotion cache with `stylis` + `stylis-plugin-rtl@^2`:

```js
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const cache = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });
```

Set `dir="rtl"` on `<html>` and wrap the app in a theme with `direction: 'rtl'`. Verify portalled components (Dialog, Menu, Tooltip, Select) inherit direction.

## Accessibility

Target: **WCAG 2.0 A/AA** (Israeli SI 5568). Gap analysis and fixes for MUI v5.14:

- `docs/MUI-v5.14.0-MOE-Israel-accessibility-compliance.md`

Key recurring items: input/placeholder contrast, accessible names on icon-only buttons, heading semantics (`variant` ≠ tag), reduced-motion handling, meaningful image `alt`.

## Roles

Student (desktop + mobile), Teacher, Content Creator, Admin.

## Docs

See `docs/` for the accessibility compliance analysis.
