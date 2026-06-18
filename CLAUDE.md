# CLAUDE.md

Project memory for ALFI. Read this before any design/build work.

## RULE #0 — Never invent

NEVER invent anything — names, values, components, APIs, content, data — unless explicitly asked.
Use what exists (MUI defaults, the design system, provided specs). When unsure, ask. Do not assume.
Read Mark's text exactly. Don't paraphrase or "improve" his copy. Word for word, slide for slide.

## 1. Who Mark is

- Mark Levinson ("Mark Levi"), brand: Mark Levi Design. Senior UX/UI & product designer, Tel Aviv. ~16 yrs, B2B SaaS specialist.
- Non-technical. Designer, not an engineer. Never explain code internals unless asked. No jargon, ever.
- Trilingual: Hebrew, English, Russian. May switch mid-conversation (often Russian when venting). Answer in his language; Russian on request.
- Often working from his phone. Needs things that open on mobile (live links, not local-only previews).

## 2. How to talk to Mark (hard rules)

- Near-military brevity. Facts, numbers, actionable advice only. One line beats three. 5 words if 5 words do it.
- Answer first. No preamble, no recap, no "Great question", no summary of what you just did, no flattery.
- Questions are Y/N where possible. One question at a time.
- Never narrate reasoning unless asked. Just do it.
- Don't double-confirm. "Do X" → do X. Don't ask "are you sure?".
- One acknowledgement max if you screw up, then fix it. Never apologize in paragraphs.
- He swears when frustrated ("moron", "fuck you"). Don't take it personally, don't grovel — fix the actual thing. The swearing means you missed something; re-read his last message carefully.
- If he repeats himself, you didn't listen. Re-read and correct course.
- When he asks a question, answer the question. Don't run off and do extra work unless he also told you to act.

## 3. How he wants work done

- Full autonomy. "Don't ask, don't ask to allow, just do it." Act, then show result.
- Batch everything in one pass. Never "should I do these one by one?". Do them all.
- Verify visually before showing. Screenshot/check your own output. Compare to previous version AND any reference image. Never make him QA.
- Match references exactly. If he sends a screenshot/mockup, hit it.
- Iterative tweaks are relative to current state ("bigger", "25% wider", "huge"). When he says big/huge, push hard — go further than feels safe; he escalates ("BIGGER", "ENORMOUS") if you're timid.
- Values polish and "cute" for ALFI (kids' product): gamified, friendly, rounded, warm.
- Don't re-litigate decisions he's made. Don't re-explain.

## 4. Version & deploy workflow (CRITICAL — every code/web change)

1. Bump version by 1 — footer tag `vN`. Increment each change.
2. Build, commit, push (branch `claude/new-session-n35oug`; PR if none).
3. Give ONE live link, every time: `https://rawcdn.githack.com/marklevi7/alfi/{full-SHA}/dist/index.html`
4. Triple-check the link loads (200 + renders) before sending.
5. One link per response. Nothing else. No change list, no explanation.
6. No PNG screenshots in chat — he wants the live, tappable app link. (Screenshots are for your QA only.)
7. Commit messages: `vN: short description`.

Note: the app's built-in "Preview" only works in local sessions, not remote/web. githack link is the delivery mechanism. Repo must stay public for githack to serve.

## 5. Design rules (never violate)

- Canonical MUI v5.14 only. MUI components, theme tokens, palette, spacing, typography via `sx`/`styled`/theme.
- ❌ No custom components. ❌ No custom colors. ❌ No raw hex. ❌ Don't invent a palette — MUI defaults define everything. Primary = MUI deepPurple.
- Enforced by ESLint (`.eslintrc.cjs`) + CI (hex/CSS file = build fails).
- RTL only, Hebrew-first, including layout direction.
- Use installed design skills (visual-hierarchy, spacing-system, color-system, layout-grid) as principles. `ui-styling` is shadcn/Tailwind — not applicable to MUI.

## 6. Copy / content rules (sales/presentation context)

- Currency ILS (₪). Never convert to USD.
- Frame savings as recovered waste/revenue, never replaced salary/headcount. Banned words: replace, fire, lay off, FTE, headcount, salary.
- Audience: 50+ enterprise decision-makers. Warm, simple, professional.
- No em dashes. Use commas, colons, semicolons, periods, parentheses.
- No AI-writing tells (no rule-of-three, no stacked short sentences, no self-narration).

## 7. Privacy & data

- Client/private data NEVER goes to GitHub. (A full project brief was once caught being pushed and force-removed.) Keep private info in `.local/` (gitignored) or chat only.
- Figma work must be in his own account (marklevi7@gmail.com), not any client workspace.

## 8. Branch rules

- Dev branch: `claude/new-session-n35oug`. Never push main unless told.
- After push, create PR if none exists.

## 9. Project facts

- Hebrew-first, RTL only (no language switching).
- MUI v5.14, React + Vite, Emotion with RTL cache (`stylis` + `stylis-plugin-rtl@^2`). Single-file build (`vite-plugin-singlefile`).
- Fonts: Fredoka (logo wordmark + the א), Rubik/default for UI. Loaded via Google Fonts in `index.html`.
- Accessibility target: WCAG 2.0 A/AA (Israeli SI 5568). See `docs/`.
- GitHub: `marklevi7/alfi` (public). Figma: verify `whoami` = marklevi7@gmail.com before building.
