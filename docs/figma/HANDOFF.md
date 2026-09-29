# ALFI — Figma Kit Translation HANDOFF (Arabic → Hebrew)

> Read this first. Then read `CLAUDE.md` (root) and `docs/figma/glossary.md`.
> This file is the complete brief to continue the Figma work in a new Claude Code chat.

---

## 0. READ THIS FIRST — why a new chat, and it MUST be desktop

The previous session ran on **Claude Code on the web**. Web can do Figma **reads** but every
Figma **write** (`mcp__Figma__use_figma`) is rejected with `MCP tool call requires approval`,
and no approval prompt appears on web. The Figma write tool also could not be self-allowed.

**=> Run this work from the Claude Code DESKTOP app (or VS Code / JetBrains extension).**
There the approval prompt appears. When `use_figma` first runs, approve it ("Always allow").
Then everything below is unblocked.

First thing the new session should do: confirm Figma auth, then test a write.

---

## 1. The task (one line)

Fully translate the **MUI for Figma v5.14.0 RTL** kit from **Arabic → Hebrew**, font **Heebo**,
in Mark's own editable copy. Then use that Hebrew kit to build ALFI's login screen
(desktop 1440×900 + mobile 390×844).

Decisions already locked by Mark:
- **Scope: FULL kit** (every component variant, specimen, example — not just what login uses).
- **Font: Heebo** for all UI text. (Brand wordmark stays Suez One / Fredoka-with-fallback.)

---

## 2. The Figma files

| What | File key | URL |
|---|---|---|
| **Mark's editable copy (USE THIS)** | `94Zb2sWvFgwjmb8JgJSn7O` | https://www.figma.com/design/94Zb2sWvFgwjmb8JgJSn7O/ALFI---MUI-v5.14.0-RTL |
| ALFI design file (login target, later) | `RafPr5t4J1wvnpdTztOh66` | https://www.figma.com/design/RafPr5t4J1wvnpdTztOh66 |

- The kit was originally a **read-only Community** file ("MUI for Figma v5.14.0 - RTL - Community").
  Mark already **duplicated it into his account** and renamed it "ALFI - MUI v5.14.0 RTL".
  It is now editable. (A community file cannot be duplicated via the API — that's why Mark did it.)
- **Figma account MUST be marklevi7@gmail.com.** Verify with `mcp__Figma__whoami` before any write.
  (Earlier `whoami` confirmed handle "Mark Levinson", email marklevi7@gmail.com, with team "MLD Projects" Pro.)
- Do NOT work in any client workspace. Mark's own account only.

---

## 3. The critical finding (font)

The kit's text styles are bound to font **`IRANYekanFN`** (Persian/Arabic only — **no Hebrew glyphs**).
Type Hebrew into it and you get empty boxes (tofu). So:

> **Step 1 is the FONT, not the words.** Swap the font first; then translate strings.

Verified example — Typography h1 style:
`Font(family: "IRANYekanFN", style: Light, size: 96, weight: 300, lineHeight: 1.167, letterSpacing: -1.5)`.
Style/variable NAMES are English/numeric (body1, h1…h6, caption, overline) — language-neutral.
Only the text **content** is Arabic.

---

## 4. The 5-step plan

1. **(done by Mark)** Duplicate kit → his account. ✅ Already done (file `94Zb2sWvFgwjmb8JgJSn7O`).
2. **Font swap:** rebind every local text style `IRANYekanFN → Heebo`. One change Hebraizes the
   whole system. Keep size / weight / line-height / letter-spacing identical — only family changes.
3. **Glossary:** already built → `docs/figma/glossary.md` (in this repo). ✅
4. **Translate page by page** (~50 pages, priority order below). Screenshot + fix each before moving on.
5. **QA sweep:** no Arabic, no tofu boxes, RTL + layout intact, variants still linked to masters.

Tooling-risk gate: validate the font swap + the Typography page FIRST. If `use_figma` can't reliably
batch-edit existing components at scale, STOP and tell Mark — don't grind through 50 pages blindly.

---

## 5. Font swap — how (technical recipe for `use_figma`)

Heebo weights to use (confirm availability with `figma.listAvailableFontsAsync()` first):
Thin, Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black.

Weight mapping IRANYekanFN → Heebo:
- Light/Thin → Light (or Regular for body)
- Regular → Regular
- Medium → Medium
- (Demi)Bold → Bold

Approach:
1. `const styles = await figma.getLocalTextStylesAsync();`
2. For each Heebo style you will use: `await figma.loadFontAsync({ family:"Heebo", style:"Regular" })` (etc.).
3. For each text style: set `style.fontName = { family:"Heebo", style: <mapped> }`.
   (Updating a shared text style cascades to every node that uses it.)
4. Some nodes carry **direct font overrides** (not the shared style). Sweep all text nodes too:
   `node.fontName` — if family is `IRANYekanFN`, load the mapped Heebo weight and set
   `node.fontName`. Must `loadFontAsync` the node's CURRENT font before mutating mixed/range text.
5. For mixed-font text nodes, handle ranges via `getRangeFontName` / `setRangeFontName`.

Then translate: set `node.characters = <hebrew from glossary>` (load font first).

Gotchas (learned):
- `use_figma` returns no value to the agent. **Capture results with `console.log(JSON.stringify(...))`**,
  or verify visually with `get_screenshot` of the page node.
- Always `loadFontAsync` every font you read OR write on a node, before changing characters/fontName.
- `figma.createImageAsync(url)` FAILED to fetch external PNGs in the past. To place an image:
  use `mcp__Figma__upload_assets`, POST the bytes to the returned `submitUrl`, then use the returned
  `imageHash` as an `IMAGE` paint fill.
- Fixed-width text frames must STAY fixed width, or Hebrew wraps one-letter-per-line.
- Setting `figma.currentPage` is not supported in some contexts — operate by node id.
- For font "Inter": style is "Semi Bold" (with space). Heebo uses "SemiBold" — verify exact style
  strings from `listAvailableFontsAsync()` and use them verbatim.

---

## 6. Page work queue (kit top-level pages, with node IDs)

Do in this priority order. Screenshot each after translating.

**Foundation first:**
- Typography `6605:52433`  ← do with the font swap, validate here first
- Overview `4662:14`

**Inputs (high use):**
- Button `6543:36648`, Button Group `6543:39713`, Text Field `6570:46740`, Checkbox `6543:43023`,
  Radio Group `6558:39248`, Select `6569:39888`, Switch `6564:39109`, Slider `6562:38897`,
  Autocomplete `6570:49843`, Rating `6562:39536`, Forms `6569:39787`, Toggle Button `6601:50950`,
  Transfer List `6560:39527`, Floating Action Button `6556:38207`, Stack `11084:151828`

**Feedback / display:**
- Alert `6595:48177`, Backdrop `6586:47112`, Progress `6586:46832`, Skeleton `6596:49007`,
  Snackbar `6586:47073`, Dialog `6586:47137`, Tooltip `6590:48756`
- Avatar `6587:47387`, Badge `6587:47476`, Chip `6588:47646`, Divider `6589:48662`,
  Icons `6594:47638`, List `6591:48829`, Table `6594:46294`, Typography (see above)

**Navigation / surfaces:**
- Accordion `6583:45995`, App Bar `6583:46303`, Card `6583:46474`, Paper `6584:46700`,
  Bottom Navigation `6572:50270`, Breadcrumbs `6572:50395`, Drawer `6574:50653`, Link `6574:50673`,
  Menu `6576:50713`, Pagination `6598:49047`, Speed Dial `6599:50806`, Stepper `6576:50917`,
  Tabs `6579:45052`, Timeline `6602:51369`, Tree View `6601:51109`

**Rest:**
- Spacing `8991:87924`, Date / Time `6569:39384`, Headings `9056:89836`, Misc `10024:111516`

---

## 7. Glossary (already in repo)

`docs/figma/glossary.md` — two layers:
- **A. Canonical ALFI terms** — real product copy, verbatim from the app code. Use exactly, never paraphrase.
- **B. Generic MUI sample strings** — Hebrew for kit demos/specimens (typography word, lorem, generic
  labels, alerts, dialog, etc.).
- Append any new page-specific Arabic→Hebrew pairs as you go, so terms stay consistent.

---

## 8. Figma MCP tools available

- Reads: `whoami`, `get_libraries`, `get_metadata`, `get_screenshot`, `get_design_context`,
  `get_variable_defs`.
- Writes: `use_figma` (general JS via Figma Plugin API — **load the `figma-use` skill FIRST**, it's
  mandatory; fallback resource `skill://figma/figma-use/SKILL.md`), `upload_assets`, `create_new_file`.
- `get_screenshot` returns a short-lived URL; `curl -o file.png "<url>"` then Read the PNG to inspect.
- `get_variable_defs` requires a selected/targeted node id (it errored with "nothing selected" when
  given a bare page id — target a concrete node).

---

## 9. Repo / git facts

- GitHub: **`marklevi7/alfi`** (public).
- Working branch: **`claude/new-session-n35oug`** (PR #1). All this work is committed here.
  (Note: an automated task brief mentioned branch `claude/affectionate-ritchie-03cv8d`; Mark
  directed work to `new-session-n35oug` — the branch that holds the real app + v18.)
- Latest app version: **v18**, SHA `263dbd2`. Live link pattern (web app only):
  `https://rawcdn.githack.com/marklevi7/alfi/{full-SHA}/dist/index.html`.
- **Figma work does NOT use the version-bump / githack-link workflow.** That workflow is for the
  React web app only. No `vN` bump, no githack link for Figma changes.

This handoff lives at `docs/figma/HANDOFF.md`. Glossary at `docs/figma/glossary.md`.

---

## 10. App design facts (context for matching the kit to the code)

- Stack: React + Vite, **MUI v5.14**, Emotion RTL cache (`stylis` + `stylis-plugin-rtl@^2`),
  single-file build (`vite-plugin-singlefile`). RTL only, Hebrew-first.
- Theme (`src/theme.ts`): `direction:'rtl'`, `palette.primary = deepPurple`
  (main `#673AB7`, dark `#512DA8`, light `#9575CD`, contrastText white). No custom typography variants.
- Brand gradient: `linear-gradient(150deg, primary.dark 0%, primary.main 60%, primary.light 100%)`.
- Fonts loaded in `index.html`: **Fredoka** (500/600/700) + **Suez One**. Rubik is NOT loaded.
  Brand wordmark uses `FANCY = '"Fredoka","Suez One",sans-serif'` (Hebrew letters fall back to Suez One).
- Key string files: `src/login/parts.tsx`, `src/dashboard/Dashboard.tsx`, `src/components/Logo.tsx`,
  `src/login/variants.tsx`, `src/App.tsx`.

### Login layout to build later ("5A")
Gradient bg (deepPurple); big **mirrored Alfi** robot bottom-left facing the card; glass card (right)
with: huge logo, tabs (`התחברות` active / `הרשמה`), email + password (eye = endAdornment, RTL-correct),
`זכור אותי` + `שכחת את הסיסמה?`, login button `התחברות`, `למה אלפי?` divider, 2×2 feature grid, footer.
Assets: `public/alfi.png` (right-facing ¾), `public/alfi-mirror.png` (front, mirrored), both transparent 1024².

---

## 11. How to talk to Mark (summary — full rules in CLAUDE.md)

- Near-military brevity. Facts/numbers/actionable only. One line beats three. Answer first, no preamble.
- Y/N questions, one at a time. Full autonomy: don't ask permission, act then show. Batch everything.
- Verify visually before showing (screenshot your own output). Never make him QA.
- He's non-technical, often on his phone, trilingual (HE/EN/RU). No jargon. He swears when you miss
  something — re-read his last message and fix the actual thing.
- Don't write private client data to GitHub (keep client individuals' names out of the repo).

---

## 12. Immediate next actions for the new (desktop) session

1. `whoami` → confirm marklevi7@gmail.com.
2. Load the `figma-use` skill. Run a tiny `use_figma` write to confirm writes work; approve the prompt.
3. `listAvailableFontsAsync` → confirm Heebo + its exact weight style strings.
4. Do the **font swap** on all local text styles + direct-override text nodes (Section 5).
5. Screenshot Typography page `6605:52433` → confirm Hebrew renders, no tofu. Report to Mark.
6. Proceed through the page work queue (Section 6), translating from the glossary, screenshot-verifying each.
