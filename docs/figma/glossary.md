# ALFI — Figma Kit Arabic→Hebrew Glossary

Private (gitignored). Source of truth for translating the MUI v5.14 RTL kit to Hebrew.
Font for all UI text: **Heebo** (brand wordmark stays Suez One / Fredoka-fallback).

Two layers:
- **A. Canonical ALFI terms** — real product copy, verbatim from the app. Use these exactly.
- **B. Generic MUI sample strings** — for kit specimens/demos (not real product copy).

---

## A. Canonical ALFI terms (verbatim from repo — do not paraphrase)

### Brand / logo
| Element | Hebrew |
|---|---|
| Wordmark | אלפי |
| Logo letter | א |
| Tagline | הלמידה החכמה שמתאימה לכל תלמיד |
| Brand name (Latin) | ALFI |
| Sub-tagline | עוזר הלמידה החכם שלך |

### Login
| Element | Hebrew |
|---|---|
| Title | ברוכים השבים 👋 |
| Subtitle | התחברו כדי להמשיך מהנקודה שבה הפסקתם. |
| Tab — login | התחברות |
| Tab — signup | הרשמה |
| Field — email (label) | אימייל |
| Field — email (placeholder) | הזינו כתובת אימייל |
| Field — password (label) | סיסמה |
| Field — password (placeholder) | הזינו סיסמה |
| Show password (aria) | הצג סיסמה |
| Hide password (aria) | הסתר סיסמה |
| Checkbox | זכור אותי |
| Forgot link | שכחת את הסיסמה? |
| Submit button | התחברות |
| Features divider | למה אלפי? |
| Feature 1 | תובנות מבוססות AI למורים ולתלמידים |
| Feature 2 | תרגול מותאם לתוכנית הלימודים עם משוב מיידי |
| Feature 3 | מעקב התקדמות בזמן אמת |
| Feature 4 | מותאם לתהליכי למידה מודרניים |
| Footer | פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות |

### Dashboard
| Element | Hebrew |
|---|---|
| Nav — home | מסך ראשי |
| Nav — assignments | תרגולים ומבחנים מהמורה |
| Nav — grades | הציונים שלי |
| Nav — logout | התנתקות |
| Welcome | שלום, student! 👋 |
| Subheading | בואו נמשיך להתקדם היום |
| Streak chip | 1 ימים רצוף |
| Notifications (tooltip/aria) | התראות |
| Stat — streak label | רצף תרגול |
| Stat — streak sub | ימים רצופים |
| Stat — weekly label | תרגילים השבוע |
| Stat — weekly sub | משימות שהושלמו |
| Stat — avg label | ציון ממוצע |
| Stat — avg sub | אין עדיין ציונים |
| Card — grades title | הציונים שלי |
| Card — grades desc | צפו בכל המבחנים והתרגולים שלכם, עם פידבק מפורט לכל שאלה. |
| Card — grades link | ← לחץ לצפייה |
| Card — AI title | תובנת AI שלך |
| Card — AI msg | אין הערכה על התלמיד ברגע זה. לאחר ביצוע התרגיל או המבחן הראשון תתבצע ההערכה. |
| Refresh (tooltip/aria) | רענון תובנה |
| Mastery heading | מפת השליטה בנושאים · מתמטיקה |
| AI explain (tooltip/aria) | הסבר מבוסס AI |
| Topic — functions | חקירת פונקציות |
| Topic — algebra | אלגברה |
| Topic — analytic geometry | גיאומטריה אנליטית |
| Topic — trigonometry | טריגונומטריה |
| Topic — probability | הסתברות |
| Topic — sequences | סדרות |

---

## B. Generic MUI sample strings (kit specimens / demos)

Used where the kit shows placeholder/demo content, not real ALFI copy.

| Purpose | Hebrew |
|---|---|
| Typography specimen word ("تايبوغرافي") | טיפוגרפיה |
| Lorem paragraph | טקסט לדוגמה: הנמלים נוהגות לשבת ולגעת בכבישים. השועל החום קפץ מעל הכלב העצלן. |
| Lorem short line | טקסט לדוגמה קצר |
| Generic button | כפתור |
| Primary / Secondary / Disabled | ראשי / משני / מושבת |
| Submit / Cancel / Confirm / Delete | שליחה / ביטול / אישור / מחיקה |
| Save / Edit / Back / Next | שמירה / עריכה / חזרה / הבא |
| Field label (generic) | תווית |
| Placeholder (generic) | הזינו ערך |
| Helper text | טקסט עזר |
| Error text | שדה חובה |
| Search | חיפוש |
| Select / Choose | בחירה |
| Option 1 / 2 / 3 | אפשרות 1 / אפשרות 2 / אפשרות 3 |
| Checkbox / Radio label | אפשרות |
| Switch on/off | פעיל / כבוי |
| Alert — success | הפעולה בוצעה בהצלחה |
| Alert — info | לידיעתכם |
| Alert — warning | שימו לב |
| Alert — error | אירעה שגיאה |
| Snackbar | ההודעה נשלחה |
| Dialog title | כותרת חלון |
| Dialog body | תוכן החלון מוצג כאן. |
| Tooltip | מידע נוסף |
| List item | פריט ברשימה |
| Table header — name/date/status | שם / תאריך / סטטוס |
| Avatar fallback initials | א |
| Chip | תגית |
| Breadcrumb — home/section/page | בית / מדור / עמוד |
| Tab 1 / 2 / 3 | לשונית 1 / לשונית 2 / לשונית 3 |
| Stepper — step 1/2/3 | שלב 1 / שלב 2 / שלב 3 |
| Pagination / Page | עמוד |
| Menu item | פריט תפריט |
| Card title / subtitle | כותרת כרטיס / כותרת משנה |

---

## Notes
- Page-specific Arabic strings not covered above are matched to Hebrew during Phase 3 (per page),
  and appended here so terms stay consistent.
- Numbers, icons, English brand tokens (ALFI, AI, MUI) stay as-is.
- RTL: all text right-aligned; keep fixed-width tiles fixed to avoid one-letter-per-line wrap.
