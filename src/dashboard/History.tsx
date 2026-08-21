import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { type Kind } from './KindIcon';
import { useNav } from '../nav';
import { TaskCard, type TaskStatus } from './Practice';
import { SummaryDialog, type Summary, type SummaryQuestion, type SummaryTurn } from './SummaryDialog';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { green, amber, grey, brown, blueGrey, red, deepOrange, blue } from '@mui/material/colors';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import TaskAltTwoToneIcon from '@mui/icons-material/TaskAltTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import { Shell, AlfiAvatar } from './Shell';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const STATS = [
  { label: 'רצף תרגול', value: '4', total: 5, sub: '4 מתוך 5 ימים', icon: <LocalFireDepartmentTwoToneIcon sx={{ color: deepOrange[500] }} />, tone: 'primary' as const },
  { label: 'תרגולים השבוע', value: '2', total: 3, sub: '2 מתוך 3 תרגולים', icon: <TaskAltTwoToneIcon sx={{ color: green[600] }} />, tone: 'warning' as const },
  { label: 'בוחנים השבוע', value: '2', total: 0, sub: 'בוחנים הושלמו', icon: <TimerTwoToneIcon sx={{ color: blue[500] }} />, tone: 'primary' as const },
];

// expired = the deadline passed before it was finished.
type Status = 'done' | 'partial' | 'notStarted' | 'expired';
type Item = { title: string; kind: Kind; when: string; status: Status; score?: number; topic: string; unit: string; subTopic: string; solved: number; total: number };

// timeline status → the shared TaskCard's status language.
// All four closed states stay distinct on the card: בוצע / בוצע חלקית / טרם התחלתי / פג תוקף.
// Everything is locked (summary only); the timeline dots mirror the same states.
const STATUS_MAP: Record<Status, TaskStatus> = { done: 'done', partial: 'partial', notStarted: 'notStarted', expired: 'expired' };

// Newest first (top) → oldest last (bottom). Placeholder data.
const ITEMS: Item[] = [
  // the newest thing closed today, so the "היום" wording has somewhere to show
  { title: 'תרגול אלגברה', kind: 'תרגול', when: 'היום', status: 'done', topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'משוואות ריבועיות', solved: 3, total: 3 },
  { title: 'בוחן באלגברה', kind: 'בוחן', when: 'אתמול', status: 'done', score: 88, topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'משוואות ריבועיות', solved: 8, total: 8 },
  { title: 'תרגול גיאומטריה אנליטית', kind: 'תרגול', when: 'אתמול', status: 'partial', topic: 'גיאומטריה אנליטית', unit: '5 יח"ל', subTopic: 'הישר והמעגל', solved: 2, total: 5 },
  { title: 'בוחן בטריגונומטריה', kind: 'בוחן', when: 'לפני יומיים', status: 'notStarted', topic: 'טריגונומטריה', unit: '4 יח"ל', subTopic: 'זהויות טריגונומטריות', solved: 0, total: 6 },
  { title: 'תרגול חקירת פונקציות', kind: 'תרגול', when: 'לפני 3 ימים', status: 'done', topic: 'חקירת פונקציות', unit: '5 יח"ל', subTopic: 'נגזרות', solved: 4, total: 4 },
  { title: 'בוחן בהסתברות', kind: 'בוחן', when: 'לפני 4 ימים', status: 'expired', topic: 'הסתברות', unit: '5 יח"ל', subTopic: 'עץ הסתברות', solved: 0, total: 5 },
  // a תרגול whose deadline passed — no grade, only the state
  { title: 'תרגול טריגונומטריה', kind: 'תרגול', when: 'לפני 5 ימים', status: 'expired', topic: 'טריגונומטריה', unit: '5 יח"ל', subTopic: 'זהויות טריגונומטריות', solved: 0, total: 4 },
  { title: 'בוחן בסדרות', kind: 'בוחן', when: 'לפני 5 ימים', status: 'done', score: 91, topic: 'סדרות', unit: '5 יח"ל', subTopic: 'סדרה חשבונית', solved: 5, total: 5 },
  { title: 'תרגול הסתברות', kind: 'תרגול', when: '10/08/26', status: 'partial', topic: 'הסתברות', unit: '4 יח"ל', subTopic: 'הסתברות מותנית', solved: 2, total: 4 },
  // nothing was solved before the deadline — the red end of the traffic light
  { title: 'תרגול וקטורים', kind: 'תרגול', when: '09/08/26', status: 'expired', topic: 'וקטורים', unit: '5 יח"ל', subTopic: 'חיבור וחיסור וקטורים', solved: 0, total: 5 },
  { title: 'בוחן באלגברה', kind: 'בוחן', when: '08/08/26', status: 'done', score: 73, topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'פונקציות', solved: 6, total: 6 },
  // moved here from the תרגולים list — finished tasks live on the timeline
  { title: 'בוחן בגיאומטריה אנליטית', kind: 'בוחן', when: '03/08/26', status: 'done', score: 88, topic: 'גיאומטריה אנליטית', unit: '5 יח"ל', subTopic: 'הישר והמעגל', solved: 6, total: 6 },
  { title: 'בוחן בטריגונומטריה', kind: 'בוחן', when: '02/08/26', status: 'done', score: 76, topic: 'טריגונומטריה', unit: '4 יח"ל', subTopic: 'משוואות טריגונומטריות', solved: 5, total: 5 },
  { title: 'בוחן בחקירת פונקציות', kind: 'בוחן', when: '27/07/26', status: 'done', score: 94, topic: 'חקירת פונקציות', unit: '5 יח"ל', subTopic: 'אסימפטוטות', solved: 8, total: 8 },
];

// what the popup replays. Demo content: one test at 88, one perfect test, one half-done תרגול.
const ANSWER_FULL = [
  'תחום הגדרה: x²−9 ≠ 0, לכן x ≠ 3 וגם x ≠ −3',
  'חיתוך עם ציר x: x²−4x = 0 → x = 0 או x = 4',
  'אסימפטוטה אופקית: y = 1',
].join('\n');
const ANSWER_PARTIAL = [
  'שיפוע הישר: m = 2',
  'משוואת הישר: y = 2x + 3',
].join('\n');

// the questions themselves, and the wrong first try that earned a correction
const PROMPT_TEST = 'נתונה הפונקציה y = (x²−4x)/(x²−9). מצא את תחום ההגדרה, את נקודות החיתוך עם הצירים, ואת האסימפטוטות של הפונקציה. הראה את כל שלבי הדרך.';
const PROMPT_PRACTICE = 'נתונות הנקודות A(1,5) ו-B(3,9). מצא את שיפוע הישר העובר דרך שתי הנקודות, ואת משוואת הישר. בדוק שהנקודות אכן מקיימות את המשוואה.';
const ANSWER_FIRST_TRY = [
  'תחום הגדרה: x²−9 ≠ 0, לכן x ≠ 3 וגם x ≠ −3',
  'חיתוך עם ציר x: x²−4x = 0 → x = 4',
  'אסימפטוטה אופקית: y = 1',
].join('\n');
const HINT = 'כמעט! יש טעות בשורה 2. בדוק אותה שוב, תקן ושלח לי את הפתרון עוד פעם.';
const APPROVED = 'כל הכבוד! תשובה נכונה! 🎉';
// the half-done question: the second try fixes the mistake but leaves one part out,
// so it closes on most of the points instead of a clean 🎉
const ANSWER_ALMOST = [
  'תחום הגדרה: x²−9 ≠ 0, לכן x ≠ 3 וגם x ≠ −3',
  'חיתוך עם ציר x: x²−4x = 0 → x = 0 או x = 4',
  'אסימפטוטה אופקית: y = 1',
].join('\n');
const PARTIAL_CLOSE = 'שורה 2 מתוקנת, יפה. חסרות לך האסימפטוטות האנכיות — x = 3 ו-x = −3. על החלק הזה ירדו נקודות.';

// the long case: an exercise that took five attempts, so the summary really has a conversation in it
const LONG_TRIES: { answer: string[]; hint: string }[] = [
  {
    answer: ['שיפוע הישר: m = (3−1)/(9−5) = 0.5'],
    hint: 'יש טעות בשורה 1. בנוסחת השיפוע ההפרש של ה-y נמצא למעלה וההפרש של ה-x למטה. הפכת ביניהם.',
  },
  {
    answer: ['שיפוע הישר: m = (9−5)/(3−1) = 2', 'משוואת הישר: y = 2x'],
    hint: 'השיפוע נכון עכשיו. בשורה 2 חסר לך המספר החופשי. הצב את אחת הנקודות במשוואה כדי למצוא אותו.',
  },
  {
    answer: ['שיפוע הישר: m = (9−5)/(3−1) = 2', 'מציבים את הנקודה A(1,5): 5 = 2·1 + b', 'b = 7'],
    hint: 'ההצבה נכונה. בשורה 3 — כדי לבודד את b צריך לחסר 2 משני האגפים, לא לחבר.',
  },
  {
    answer: ['שיפוע הישר: m = (9−5)/(3−1) = 2', 'מציבים את הנקודה A(1,5): 5 = 2·1 + b', 'b = 3', 'משוואת הישר: y = 2x + 3', 'בדיקה עבור B(3,9): 2·3 + 3 = 8'],
    hint: 'המשוואה נכונה! בשורה 5 יש טעות חישוב קטנה: 2·3 + 3. חשב שוב ובדוק אם זה יוצא בדיוק 9.',
  },
  {
    answer: ['שיפוע הישר: m = (9−5)/(3−1) = 2', 'מציבים את הנקודה A(1,5): 5 = 2·1 + b', 'b = 3', 'משוואת הישר: y = 2x + 3', 'בדיקה עבור A(1,5): 2·1 + 3 = 5 ✓', 'בדיקה עבור B(3,9): 2·3 + 3 = 9 ✓'],
    hint: APPROVED,
  },
];
const LONG_TURNS: SummaryTurn[] = LONG_TRIES.flatMap((t, i) => [
  { from: 'student' as const, text: t.answer.join('\n') },
  { from: 'alfi' as const, text: t.hint, tone: (i === LONG_TRIES.length - 1 ? 'ok' : 'hint') as 'ok' | 'hint' },
]);

function questionsFor(it: Item): SummaryQuestion[] {
  const perQ = it.kind === 'בוחן' ? Math.round(100 / it.total) : 0;
  const test = it.kind === 'בוחן';
  // a test that lost points drops them on the second question, so the demo shows both states
  const lost = it.score != null && it.score < 100;
  return Array.from({ length: it.total }, (_, i) => {
    const answered = i < it.solved;
    const short = test ? `שאלה ${i + 1} · ${it.subTopic}` : `תרגיל ${i + 1} · ${it.subTopic}`;
    const prompt = test ? PROMPT_TEST : PROMPT_PRACTICE;
    if (!answered) return { short, prompt, turns: [], status: 'notStarted' as const };
    const dropped = lost && i === 1;
    const answer = test ? ANSWER_FULL : ANSWER_PARTIAL;
    // the last exercise of a practice is the long one — five attempts before it came out right
    const long = !test && i === it.total - 1;
    // the ones that lost points got there the long way: a try, a correction, then the answer
    const turns = long
      ? LONG_TURNS
      : dropped
      ? [
          { from: 'student' as const, text: ANSWER_FIRST_TRY },
          { from: 'alfi' as const, text: HINT, tone: 'hint' as const },
          { from: 'student' as const, text: ANSWER_ALMOST },
          { from: 'alfi' as const, text: PARTIAL_CLOSE, tone: 'hint' as const },
        ]
      : [
          { from: 'student' as const, text: answer },
          { from: 'alfi' as const, text: APPROVED, tone: 'ok' as const },
        ];
    return {
      short,
      prompt,
      turns,
      ...(test && { points: dropped ? Math.round(perQ * 0.75) : perQ, outOf: perQ }),
      status: dropped ? ('partial' as const) : ('done' as const),
    };
  });
}

function insightFor(it: Item): string {
  // nothing was submitted, or the clock ran out — never talk about a grade here
  if (it.status === 'notStarted') {
    return it.kind === 'בוחן'
      ? 'לא התחלת את הבוחן הזה, ולכן אין מה לסכם. אפשר עדיין לפתוח את השאלות ולתרגל אותן בלי ציון.'
      : 'לא התחלת את התרגול הזה. אפשר לפתוח אותו ולעבור על השאלות בקצב שלך.';
  }
  if (it.status === 'expired') {
    return `המועד עבר לפני שסיימת. הספקת ${it.solved} מתוך ${it.total} שאלות, והן נשמרו כאן. אפשר לעבור עליהן ולהשלים את החומר.`;
  }
  if (it.kind === 'תרגול') {
    return it.solved === it.total
      ? 'סיימת את כל התרגילים ובנית את הפתרונות לפי הסדר. הדרך שלך לחישוב שיפוע ומשוואת ישר ברורה ומדויקת. אפשר להתקדם לנושא הבא.'
      : `פתרת ${it.solved} מתוך ${it.total} תרגילים. ההתחלה נכונה, ובמיוחד מציאת השיפוע. כדאי לחזור ולסיים את השאר כדי לקבע את החומר.`;
  }
  if (it.score != null && it.score >= 95) {
    return 'בוחן כמעט מושלם. הגדרת נכון את התחום, זיהית את האסימפטוטות ובנית פתרון מסודר. שמור על הסדר הזה גם בבחנים הבאים.';
  }
  return `קיבלת ${it.score}. הגזירה שלך מצוינת והמעברים ברורים. הנקודות ירדו על טעויות חישוב קטנות בשאלה 2 ועל דילוג על שלב אחד בדרך. שווה לבדוק כל שורה לפני שליחה.`;
}

const summaryFor = (it: Item): Summary => ({
  title: it.title,
  kind: it.kind,
  when: it.when,
  state: it.status,
  topic: it.topic,
  subTopic: it.subTopic,
  solved: it.solved,
  total: it.total,
  score: it.score,
  insight: insightFor(it),
  questions: questionsFor(it),
});

const uniq = (arr: string[]) => Array.from(new Set(arr));
// the three levels the filter works on: unit, then topic, then sub-topic
const UNITS = ['5 יח"ל', '4 יח"ל', '3 יח"ל'];
const TOPICS = uniq(ITEMS.map((i) => i.topic));
const SUBTOPICS = uniq(ITEMS.map((i) => i.subTopic));

// Ribbon medal (from provided asset) in gold / silver / bronze, MUI tokens only.
const MEDAL_TIERS = {
  gold: { outer: amber[300], inner: amber[600] },
  silver: { outer: blueGrey[100], inner: blueGrey[400] },
  bronze: { outer: brown[300], inner: brown[600] },
} as const;

function Medal({ tier, size = 44 }: { tier: keyof typeof MEDAL_TIERS; size?: number }) {
  const c = MEDAL_TIERS[tier];
  return (
    <Box component="svg" viewBox="0 0 300.439 300.439" sx={{ width: size, height: size, display: 'block' }}>
      <path d="M276.967,0h-84.498L70.415,178.385h84.498L276.967,0z" fill={red[700]} />
      <path d="M23.472,0h84.498l122.053,178.385h-84.498L23.472,0z" fill={red[400]} />
      <path d="M154.914,93.887c57.271,0,103.276,46.005,103.276,103.276s-46.005,103.276-103.276,103.276S51.638,254.434,51.638,197.163S97.643,93.887,154.914,93.887z" fill={c.outer} />
      <path d="M154.914,122.053c-41.31,0-75.11,33.799-75.11,75.11s33.799,75.11,75.11,75.11s75.11-33.799,75.11-75.11S196.224,122.053,154.914,122.053z M154.914,253.495c-30.983,0-56.332-25.35-56.332-56.332s25.35-56.332,56.332-56.332s56.332,25.35,56.332,56.332S185.896,253.495,154.914,253.495z" fill={c.inner} />
    </Box>
  );
}

/** First login: nothing has been submitted yet, so there is nothing to look back on. */
function FirstUse() {
  const navTo = useNav();
  return (
    <Shell active="history" title="תמונת מצב">
      <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, px: 2, maxWidth: 464, mx: 'auto' }}>
        <AlfiAvatar size={96} />
        <Typography variant="h5" sx={{ fontWeight: 800 }}>עוד אין כאן כלום</Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.9, textWrap: 'pretty' }}>
          כאן יופיעו התרגולים והבחנים שכבר סיימת, עם הסיכום של אלפי על כל אחד מהם.
          אחרי התרגול הראשון תמצא אותם כאן.
        </Typography>
        <Button variant="contained" onClick={() => navTo.go('practice')} sx={{ py: 1.25, px: 3, fontWeight: 800 }}>
          לתרגולים ובחנים
        </Button>
      </Stack>
    </Shell>
  );
}

export function History({ firstUse = false }: { firstUse?: boolean }) {
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('');
  const [unit, setUnit] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [kind, setKind] = useState<'all' | Kind>('all');
  // a fully-completed test can be opened read-only, like a regular task
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  // a past task opens a summary popup — the student stays on תמונת מצב
  const [summary, setSummary] = useState<Summary | null>(null);
  // every filter lives behind one button; the badge says how many are on
  const [filterOpen, setFilterOpen] = useState(false);
  // the page edits a draft; nothing filters until החל סינון is pressed
  const [draftUnit, setDraftUnit] = useState('');
  const [draftTopic, setDraftTopic] = useState('');
  const [draftSubTopic, setDraftSubTopic] = useState('');
  const [draftKind, setDraftKind] = useState<'all' | Kind>('all');
  const activeFilters = [unit, topic, subTopic, kind === 'all' ? '' : kind].filter(Boolean).length;

  const items = useMemo(
    () => ITEMS.filter((it) =>
      (!q || it.title.includes(q.trim())) &&
      (!topic || it.topic === topic) &&
      (!unit || it.unit === unit) &&
      (!subTopic || it.subTopic === subTopic) &&
      (kind === 'all' || it.kind === kind)
    ),
    [q, topic, unit, subTopic, kind]
  );

  if (firstUse) return <FirstUse />;

  return (
    <Shell active="history" title="תמונת מצב">
      {/* Stats — one card, 3 columns */}
      {/* on a phone the strip runs edge to edge, so the three numbers get the whole width */}
      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: { xs: 'transparent', md: 'divider' }, mx: { xs: -2.5, md: 0 } }}>
        <CardContent sx={{ py: { xs: 1.75, md: 4 }, px: 0, '&:last-child': { pb: { xs: 1.75, md: 4 } } }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
          >
            {STATS.map((s) => {
              const pct = s.total ? Number(s.value) / s.total : 0;
              const tier = pct >= 0.7 ? 'gold' : pct < 0.3 ? 'bronze' : 'silver';
              const dots = s.total > 0 && (
                <Stack direction="row" spacing={0.5}>
                  {Array.from({ length: s.total }).map((_, i) => (
                    <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: i < Number(s.value) ? 'primary.main' : 'grey.300' }} />
                  ))}
                </Stack>
              );
              const value = s.label === 'תרגולים השבוע'
                ? <Medal tier={tier} size={phone ? 40 : 54} />
                : <Typography variant="h4" component="span" sx={{ fontWeight: 900, lineHeight: 1 }}>{s.value}</Typography>;

              // phone: two lines for the whole card — icon + number, label underneath
              if (phone) return (
                <Stack key={s.label} spacing={0.25} alignItems="center" sx={{ flex: 1, minWidth: 0, px: 0.5 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ height: 34 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { fontSize: 'medium' }, flexShrink: 0 }}>{s.icon}</Box>
                    {s.label === 'תרגולים השבוע'
                      ? <Medal tier={tier} size={30} />
                      : <Typography variant="h5" component="span" sx={{ fontWeight: 900, lineHeight: 1 }}>{s.value}</Typography>}
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textAlign: 'center', lineHeight: (t) => t.typography.h2.lineHeight }}>{s.label}</Typography>
                </Stack>
              );

              return (
                <Box key={s.label} sx={{ flex: 1, textAlign: 'center', px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { fontSize: 'large' } }}>{s.icon}</Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{s.label}</Typography>
                  </Stack>
                  {/* value slot — fixed height keeps number & medal on one baseline */}
                  <Box sx={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.label === 'תרגולים השבוע' ? <Box sx={{ mt: '-6px', display: 'flex' }}>{value}</Box> : value}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>{s.sub}</Typography>
                  {/* progress slot — fixed height so all columns align even when empty */}
                  <Box sx={{ mt: 2, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{dots}</Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Filters — every control is on screen on desktop; a phone has no room, so they
          collapse to a search field plus one button that opens them as a page. */}
      <Box sx={{ px: 0.5 }}>
        {/* desktop: all controls in one row, same small size so they line up */}
        <Stack direction="row" gap={1.5} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          <TextField
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם"
            inputProps={{ 'aria-label': 'חיפוש לפי שם' }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment>) }}
            sx={{ flex: 1, minWidth: 184 }}
          />
          <TextField select size="small" label="יחידות" value={unit} onChange={(e) => setUnit(e.target.value)} sx={{ width: 144 }}>
            <MenuItem value="">כל היחידות</MenuItem>
            {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="נושא" value={topic} onChange={(e) => setTopic(e.target.value)} sx={{ width: 200 }}>
            <MenuItem value="">כל הנושאים</MenuItem>
            {TOPICS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="תת נושא" value={subTopic} onChange={(e) => setSubTopic(e.target.value)} sx={{ width: 200 }}>
            <MenuItem value="">הכל</MenuItem>
            {SUBTOPICS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={kind}
            onChange={(_, v) => v && setKind(v)}
            sx={{ height: 40, '& .MuiToggleButton-root': { fontWeight: 700, textTransform: 'none', px: 2 } }}
          >
            <ToggleButton value="all">הכל</ToggleButton>
            <ToggleButton value="תרגול">תרגול</ToggleButton>
            <ToggleButton value="בוחן">בוחן</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* phone: search plus one button, the rest behind it */}
        <Stack direction="row" gap={1} alignItems="center" sx={{ display: { xs: 'flex', md: 'none' } }}>
          <TextField
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם"
            inputProps={{ 'aria-label': 'חיפוש לפי שם' }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment>) }}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <Badge badgeContent={activeFilters} color="primary" overlap="circular">
            <IconButton
              onClick={() => { setDraftUnit(unit); setDraftTopic(topic); setDraftSubTopic(subTopic); setDraftKind(kind); setFilterOpen(true); }}
              aria-label="סינון"
              sx={{ border: 1, borderColor: 'divider', borderRadius: 2, color: activeFilters ? 'primary.main' : 'text.secondary' }}
            >
              <TuneRoundedIcon />
            </IconButton>
          </Badge>
        </Stack>

        {/* filtering is its own page on a phone, a panel on desktop */}
        <Dialog
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          fullScreen={phone}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: phone ? 0 : 4 } }}
        >
          <DialogTitle component="div" sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 800, flex: 1 }}>סינון</Typography>
              <IconButton onClick={() => setFilterOpen(false)} aria-label="סגירה"><CloseRoundedIcon /></IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField select size="small" label="יחידות" value={draftUnit} onChange={(e) => setDraftUnit(e.target.value)} fullWidth>
                <MenuItem value="">כל היחידות</MenuItem>
                {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </TextField>
              <TextField select size="small" label="נושא" value={draftTopic} onChange={(e) => setDraftTopic(e.target.value)} fullWidth>
                <MenuItem value="">כל הנושאים</MenuItem>
                {TOPICS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField select size="small" label="תת נושא" value={draftSubTopic} onChange={(e) => setDraftSubTopic(e.target.value)} fullWidth>
                <MenuItem value="">הכל</MenuItem>
                {SUBTOPICS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>סוג</Typography>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  fullWidth
                  value={draftKind}
                  onChange={(_, v) => v && setDraftKind(v)}
                  sx={{ '& .MuiToggleButton-root': { fontWeight: 700, textTransform: 'none' } }}
                >
                  <ToggleButton value="all">הכל</ToggleButton>
                  <ToggleButton value="תרגול">תרגול</ToggleButton>
                  <ToggleButton value="בוחן">בוחן</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button
              onClick={() => { setDraftUnit(''); setDraftTopic(''); setDraftSubTopic(''); setDraftKind('all'); }}
              variant="outlined"
              fullWidth
              sx={{ py: 1.25, fontWeight: 700 }}
            >
              ניקוי
            </Button>
            <Button
              onClick={() => { setUnit(draftUnit); setTopic(draftTopic); setSubTopic(draftSubTopic); setKind(draftKind); setFilterOpen(false); }}
              variant="contained"
              fullWidth
              sx={{ py: 1.25, fontWeight: 800 }}
            >
              החל סינון
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* timeline: every item hangs on a vertical rail — dot = submission state
          (filled = done, half = partial, hollow = not started / expired) */}
      <Box sx={{ position: 'relative', paddingInlineStart: 4.5 }}>
        <Box sx={{ position: 'absolute', insetInlineStart: '11px', top: 14, bottom: 14, width: 2, bgcolor: 'divider', borderRadius: 1 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5 }}>
        {items.map((it, i) => {
          return (
          <Box key={i} sx={{ position: 'relative' }}>
            {/* timeline dot, centered on the rail */}
            <Box
              sx={{
                position: 'absolute', insetInlineStart: '-36px', top: '50%', transform: 'translateY(-50%)',
                width: 24, height: 24, borderRadius: '50%', zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'background.paper',
                ...(it.status === 'done' && { bgcolor: green[500] }),
                ...(it.status === 'partial' && { border: 2, borderColor: amber[600], background: `linear-gradient(to left, ${amber[600]} 50%, transparent 50%)` }),
                ...(it.status === 'notStarted' && { border: 2, borderColor: grey[400] }),
                ...(it.status === 'expired' && { border: 2, borderColor: red[700] }),
              }}
            >
              {it.status === 'done' && <CheckRoundedIcon sx={{ fontSize: 16, color: 'common.white' }} />}
            </Box>
            <TaskCard
              t={{
                id: i,
                title: it.title,
                kind: it.kind,
                topic: it.topic,
                subTopic: it.subTopic,
                unit: it.unit,
                total: it.total,
                solved: it.solved,
                status: STATUS_MAP[it.status],
                from: '',
                to: null,
                grade: it.score,
              }}
              dateLabel={it.when}
              onOpen={() => setSummary(summaryFor(it))}
            />
          </Box>
          );
        })}
        </Box>
      </Box>
      <SummaryDialog summary={summary} onClose={() => setSummary(null)} />

      {items.length === 0 && (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 6, fontWeight: 600 }}>
          לא נמצאו תוצאות
        </Typography>
      )}
    </Shell>
  );
}
