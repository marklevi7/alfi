# ALFI — MUI v5.14.0 Accessibility Compliance (Israeli MOE)

Gap analysis: is **MUI v5.14.0** (React) 100% compliant with **Israeli Ministry of Education** accessibility requirements?
Project is **Hebrew / RTL-only**, no language switching.

## Compliance base
- Israeli MOE: https://sapakim.education.gov.il/accessibility/tech-adjustments/
- Standard: **SI 5568 Part 1 & 2 = WCAG 2.0 A/AA** (not 2.1/2.2 unless the tender says so — confirm with client).
- MUI RTL docs: https://mui.com/material-ui/customization/right-to-left/
- Figma kit (visual): https://www.figma.com/community/file/1339536974199353550

## Project facts
- Hebrew / RTL-only, no language switching → RTL auto-flip risks largely moot; build native RTL.
- MUI version pinned: **v5.14.0**.

## Verdict
MUI v5.14.0 is a **good base, but not 100% compliant out of the box**. Every gap below is fixable — roughly half in the design phase, half one-time dev setup. **No architectural blockers.**

## Open question for client
WCAG **2.0** or **2.1** in the contract? If **2.1** → also non-text / border contrast (1.4.11); MUI default input borders (~1.6:1) fail it.

---

## Findings — problems only (biggest → smallest)

### ❌ Blockers (red)

**1. RTL package wrong for this version**
v5.14.0 needs `stylis-plugin-rtl@^2`, **not** `@mui/stylis-plugin-rtl` (current MUI docs are wrong for this version).
**Fix:** `npm i stylis stylis-plugin-rtl@^2`; Emotion cache `stylisPlugins: [prefixer, rtlPlugin]`; pin the version. One-time dev setup.

**2. Contrast (WCAG 1.4.3)**
Placeholder ~2.8:1; focused filled-label <4.5:1 (MUI #24947, #40841, mui-x #20238).
**Fix:** Theme override `MuiInputBase` → `input::placeholder { color:#666; opacity:1 }`; recheck filled-on-focus. Design: text ≥ `#666` on white.

**3. `IconButton` has no accessible name**
**Fix:** Add `aria-label` (Hebrew) to every icon-only button; enable ESLint `jsx-a11y`.

### ⚠️ Should-fix (yellow)

**4. RTL portals don't inherit `dir`**
Dialog / Menu / Tooltip / Select.
**Fix:** Set `dir="rtl"` on `<html>`; verify each popup.

**5. Directional icons don't mirror**
Arrows / chevrons.
**Fix:** Flip via `sx={{ transform: 'scaleX(-1)' }}` or swap icon; design marks which.

**6. `/* @noflip */` fails in `sx`; inline `marginLeft` won't mirror**
**Fix:** Use `sx` / `styled` or logical props (`marginInlineStart`). Low risk in an RTL-only project.

**7. Headings: `variant` ≠ tag**
**Fix:** `<Typography variant="h4" component="h1">`; one H1, no skipped levels.

**8. Color as sole meaning (WCAG 1.4.1)**
**Fix:** Add icon + text to statuses; fill `helperText` on errors.

**9. Roboto weak for Hebrew**
**Fix:** `theme.typography.fontFamily` = Assistant / Rubik / Heebo / Arial; load the font.

**10. Auto-motion (WCAG 2.2.2)**
Spinners / Skeleton animate always.
**Fix:** Add `@media (prefers-reduced-motion: reduce)`; no autoplay carousels.

**11. Image `alt` not enforced**
**Fix:** Meaningful `alt`; decorative `alt=""`; check via `jsx-a11y`.

---

## Buckets (for non-tech stakeholders)
- **Design phase (designer):** #2, #8, #9, #11
- **One-time dev setup / discipline (programmer):** #1, #3, #4, #5, #6, #7, #10
