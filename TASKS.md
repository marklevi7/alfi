# ALFI TODO — 13 Aug 2026, v127

Live: https://rawcdn.githack.com/marklevi7/alfi/4ff2e6ecd33908df6c32661abd864d71cd59e70f/dist/index.html
Figma: https://www.figma.com/design/94Zb2sWvFgwjmb8JgJSn7O/ALFI---MUI-v5.14.0-RTL
Deadline to Einav: end of week — items 1–3.

## Open

1. [ ] Four review states (תמונת מצב → row → צפה בסיכום)
   - [x] בוחן שבוצע: score + points per question
   - [ ] בוחן שפג תוקף: status "לא בוצע"/"פג תוקף", never a zero
   - [ ] תרגול שבוצע/חלקית: no score, traffic-light colour slot instead (rule undecided)
   - [ ] תרגול שפג תוקף
2. [ ] Mobile for תמונת מצב — timeline + review popup on phone
3. [ ] Mobile for assessment review — nested drill-in; fallback = message pointing to web if too complex
4. [ ] Small calculator variant (תרגולים ובחנים → בוחן → question → מחשבון) — 12-key + 20-key, editable per topic, drop lim/plus/equals, division as stacked fraction
5. [ ] New screens into Figma — review popup (list + open question) + mobile filter page, d-/m- pairs
6. [ ] v5 purple parity — recent work is v7 green only
7. [ ] Standing: tell Ori in WhatsApp on every Figma update (he doesn't check Trello daily)
8. [ ] Avatar redesign (on hold) — geometric 3D shape with eyes, keep floating hands, Ori leads

## Done (this session)

- [x] Assessment review popup rebuilt: neutral Alfi summary, question rows match task cards, 3-line fade + "ראה עוד", card grows into dialog, fixed dialog size, back arrow, X on list
- [x] Alfi question button on mobile: round top-left, flips to "?" ×3 then stays, opens chat
- [x] No grades in תרגול anywhere — points are בוחן-only
- [x] Question cards equal height, fade-out on overflow
- [x] Desktop תמונת מצב filters full inline; compact search+filter page is phone-only
- [x] Any menu tap returns to that section's main page from any depth
- [x] Figma: task + test flows synced, 12 frames, new m-alfi chat panel

## Standing rules

- Every screen → Figma as d-/m- pair, own frame, side by side, top aligned, short name (max 6 words, numbering at end)
- MUI v5.14 canonical only — no raw hex, no invented tokens
- RTL-first, Hebrew-first
- Never screenshot mobile with a hover state
- One live link per reply, nothing else
