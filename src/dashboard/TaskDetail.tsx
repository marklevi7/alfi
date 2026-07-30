import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { deepPurple, blue, cyan, amber, green, red, pink, grey } from '@mui/material/colors';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone';
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import { Shell, AlfiWidget } from './Shell';

// to = deadline; null means the teacher set no deadline (open-ended practice).
export type SolveTask = { id: number; title: string; total: number; solved: number; from: string; to: string | null; grade?: number; kind?: 'תרגול' | 'בוחן' };

// '29 ביוני 2026' → ', יום שני' (empty string when the date can't be parsed)
const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const HE_DAYS = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];
function hebrewWeekday(dateStr: string): string {
  const m = dateStr.match(/^(\d{1,2}) ב(.+) (\d{4})$/);
  if (!m) return '';
  const month = HE_MONTHS.indexOf(m[2]);
  if (month === -1) return '';
  return `, ${HE_DAYS[new Date(Number(m[3]), month, Number(m[1])).getDay()]}`;
}

/* ---------- tiny math renderer (no external lib) ---------- */
function Frac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', mx: 0.5, lineHeight: 1.1 }}>
      <Box component="span" sx={{ px: 0.5 }}>{n}</Box>
      <Box component="span" sx={{ px: 0.5, borderTop: `1.5px solid currentColor`, width: '100%', textAlign: 'center' }}>{d}</Box>
    </Box>
  );
}
const Eq = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: '1.15em', whiteSpace: 'nowrap' }}>{children}</Box>
);

type Turn = { title?: string; body: ReactNode };
// solution is an array of lines — each gets a grey number so the AI can be asked about a specific line
type Question = { points: number; short: string; prompt: ReactNode; guide: Turn; solution: ReactNode[] };

const QUESTIONS: Question[] = [
  {
    points: 20, short: 'חקירת פונקציה מלאה',
    prompt: <>נתונה הפונקציה <Eq>y = <Frac n={<>√(x²−1)</>} d={<>x−2</>} /></Eq>. ערוך חקירה מלאה: תחום הגדרה, נגזרת, אסימפטוטות, נקודות קיצון, ותחומי עלייה וירידה.</>,
    guide: { title: 'חקירה מלאה כוללת 5 שלבים', body: <>1. תחום הגדרה  2. נגזרת  3. אסימפטוטות  4. נקודות קיצון  5. תחומי עלייה וירידה.<br />נתחיל מהתחלה — <b>מה תחום ההגדרה לדעתך?</b></> },
    solution: [
      <><b>תחום הגדרה:</b> x²−1 ≥ 0 וגם x ≠ 2, לכן x ≤ −1 או x ≥ 1, x ≠ 2.</>,
      <><b>אסימפטוטות:</b> אנכית x = 2; אופקיות y = 1 (כאשר x → ∞) ו-y = −1 (כאשר x → −∞).</>,
      <><b>נגזרת ונקודות קיצון:</b> הנגזרת שלילית בכל התחום — אין נקודות קיצון.</>,
      <><b>עלייה וירידה:</b> הפונקציה יורדת בכל תחום ההגדרה.</>,
    ],
  },
  {
    points: 20, short: 'תחום הגדרה',
    prompt: <>מצא את תחום ההגדרה של הפונקציה <Eq>y = <Frac n={<>√x</>} d={<>x−9</>} /></Eq>.</>,
    guide: { body: <>לתחום צריך שני תנאים <b>בנפרד</b>: השורש חייב להיות ≥ 0, והמכנה ≠ 0. <b>מה יוצא מהתנאי הראשון?</b></> },
    solution: [
      <>מהשורש: x ≥ 0. מהמכנה: x − 9 ≠ 0 ולכן x ≠ 9.</>,
      <><b>תחום ההגדרה:</b> x ≥ 0 וגם x ≠ 9.</>,
    ],
  },
  {
    points: 20, short: 'אסימפטוטות',
    prompt: <>מצא את האסימפטוטות של <Eq>y = <Frac n={<>√x</>} d={<>x−9</>} /></Eq> והסבר כיצד הפונקציה מתנהגת משני צידי האסימפטוטה האנכית.</>,
    guide: { body: <>האסימפטוטה האנכית נמצאת היכן שהמכנה מתאפס. <b>באיזה x זה קורה?</b></> },
    solution: [
      <><b>אנכית:</b> x = 9 (המכנה מתאפס והמונה ≠ 0).</>,
      <><b>אופקית:</b> y = 0 (המכנה גדל מהר מהמונה).</>,
      <><b>התנהגות:</b> משמאל ל-9 הפונקציה שואפת ל-−∞, מימין ל-9 שואפת ל-+∞.</>,
    ],
  },
  {
    points: 20, short: 'תחום, נגזרת וקיצון',
    prompt: <>נתונה <Eq>y = <Frac n={<>x</>} d={<>√(x²−9)</>} /></Eq>. מצא את תחום ההגדרה, חשב את הנגזרת, ומצא נקודות קיצון אם קיימות.</>,
    guide: { body: <>נתחיל מהתחום: הביטוי תחת השורש חייב להיות חיובי <b>ממש</b>. <b>מה אי-השוויון שצריך לפתור?</b></> },
    solution: [
      <><b>תחום הגדרה:</b> x²−9 &gt; 0 ולכן x &lt; −3 או x &gt; 3.</>,
      <><b>נגזרת:</b> y′ = −9 / (x²−9)^(3/2).</>,
      <><b>קיצון:</b> הנגזרת שלילית בכל התחום — אין נקודות קיצון.</>,
    ],
  },
  {
    points: 20, short: 'תחום ונקודות חיתוך',
    prompt: <>נתונה <Eq>y = √(x²−4)</Eq>. מצא את תחום ההגדרה ואת נקודות החיתוך עם הצירים.</>,
    guide: { body: <>תחת השורש חייב להיות ≥ 0. <b>מה פתרון אי-השוויון x²−4 ≥ 0?</b></> },
    solution: [
      <><b>תחום הגדרה:</b> x²−4 ≥ 0 ולכן x ≤ −2 או x ≥ 2.</>,
      <><b>חיתוך עם ציר x:</b> (−2, 0) ו-(2, 0).</>,
      <><b>חיתוך עם ציר y:</b> אין — x = 0 מחוץ לתחום.</>,
    ],
  },
];

/* ---------- confetti: ONE shared component for every celebration in the app ---------- */
const CONFETTI = [deepPurple[400], blue[400], cyan[400], amber[400], green[400], pink[400], red[400], amber[600]];
const burst = keyframes`
  0%   { transform: translate(0,0) rotate(0deg) scale(0.6); opacity: 1; }
  15%  { transform: translate(calc(var(--dx) * 0.25), calc(var(--dy) * 0.55)) rotate(calc(var(--rot) * 0.3)) scale(1.2); opacity: 1; }
  100% { transform: translate(var(--dx), calc(var(--dy) * -0.4)) rotate(var(--rot)) scale(1); opacity: 0; }
`;
/** Big game-style confetti burst. Fills its positioned parent; harmless when reduced-motion is on. */
export function Confetti({ pieces = 80 }: { pieces?: number }) {
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 4 }}>
      {Array.from({ length: pieces }).map((_, i) => {
        const dx = (i % 2 ? 1 : -1) * (60 + (i * 37) % 520);
        const dy = -180 - (i * 53) % 420;
        const rot = 360 + (i * 97) % 900;
        const c = CONFETTI[i % CONFETTI.length];
        const w = 14 + (i % 4) * 6;
        const h = i % 3 === 0 ? w : Math.round(w * 0.5);
        const round = i % 4 === 1;
        return (
          <Box key={i} sx={{
            position: 'absolute', top: '45%', left: '50%',
            width: w, height: h, borderRadius: round ? '50%' : 0.75, bgcolor: c,
            ['--dx' as string]: `${dx}px`, ['--dy' as string]: `${dy}px`, ['--rot' as string]: `${rot}deg`,
            animation: `${burst} ${1600 + (i % 6) * 220}ms cubic-bezier(0.18, 0.9, 0.3, 1) ${(i % 5) * 70}ms forwards`,
            '@media (prefers-reduced-motion: reduce)': { display: 'none' },
          }} />
        );
      })}
    </Box>
  );
}

/* ---------- formula picker + QR dialogs ---------- */
const SYMBOLS = ['√', 'x²', 'xⁿ', '≤', '≥', '≠', '∞', 'π', '·', '±', "f′", "f″"];
function MathDialog({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (s: string) => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
        הוספת נוסחה
        <IconButton onClick={onClose} sx={{ position: 'absolute', insetInlineEnd: 8, top: 8 }}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>הנוסחה תתווסף במיקום הסמן.</Typography>
        <Grid container spacing={1}>
          {SYMBOLS.map((s) => (
            <Grid item xs={3} key={s}>
              <Button fullWidth variant="outlined" onClick={() => { onPick(s); onClose(); }} sx={{ minHeight: 48, fontSize: '1.1rem' }}>{s}</Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
function QrDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
        העלאת פתרון דרך הטלפון
        <IconButton onClick={onClose} sx={{ position: 'absolute', insetInlineEnd: 8, top: 8 }}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>סרוק את ה-QR בטלפון וצלם את הפתרון הכתוב.</Typography>
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 3, bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}>
          <QrCode2RoundedIcon sx={{ fontSize: 160, color: 'text.primary' }} />
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2, color: 'success.dark' }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>ממתין להעלאה</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- fake macOS Finder open-file dialog (in-app, sham content) ---------- */
const FINDER_FAV = ['שולחן העבודה', 'מסמכים', 'הורדות', 'תמונות', 'iCloud Drive'];
const FINDER_FILES = [
  { name: 'פתרון_שאלה_1.pdf', kind: 'pdf', when: 'היום 14:32' },
  { name: 'גיאומטריה_מחברת.jpg', kind: 'img', when: 'אתמול 20:11' },
  { name: 'תרגיל_בית_אלגברה.png', kind: 'img', when: '2 בספט׳ 2026' },
  { name: 'נוסחאות_בגרות.pdf', kind: 'pdf', when: '28 באוג׳ 2026' },
  { name: 'סריקה_001.jpg', kind: 'img', when: '28 באוג׳ 2026' },
  { name: 'חקירת_פונקציה.pdf', kind: 'pdf', when: 'שבוע שעבר' },
];
const fileIcon = (k: string) => (k === 'pdf'
  ? <PictureAsPdfTwoToneIcon sx={{ color: red[400] }} />
  : <ImageTwoToneIcon sx={{ color: blue[400] }} />);

function FinderDialog({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (name: string) => void }) {
  const [sel, setSel] = useState(0);
  const choose = () => { onPick(FINDER_FILES[sel].name); onClose(); };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2.5, overflow: 'hidden' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, bgcolor: grey[100], borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={0.75}>
          {[red[400], amber[400], green[400]].map((c) => <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />)}
        </Stack>
        <Typography sx={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'text.secondary' }}>בחירת קובץ</Typography>
        <Box sx={{ width: 54 }} />
      </Box>
      <Box sx={{ display: 'flex', height: 320 }}>
        <Box sx={{ width: 190, flexShrink: 0, bgcolor: grey[50], borderInlineEnd: 1, borderColor: 'divider', py: 1, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="caption" sx={{ px: 2, color: 'text.disabled', fontWeight: 700 }}>מועדפים</Typography>
          <List dense>
            {FINDER_FAV.map((f, i) => (
              <ListItemButton key={f} selected={i === 1} sx={{ mx: 1, borderRadius: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><FolderTwoToneIcon fontSize="small" sx={{ color: amber[600] }} /></ListItemIcon>
                <ListItemText primary={f} primaryTypographyProps={{ fontSize: '0.85rem', noWrap: true }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List dense disablePadding>
            {FINDER_FILES.map((f, i) => (
              <ListItemButton key={f.name} selected={i === sel} onClick={() => setSel(i)} onDoubleClick={choose} sx={{ px: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{fileIcon(f.kind)}</ListItemIcon>
                <ListItemText primary={f.name} secondary={f.when} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600, noWrap: true }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: grey[50] }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>ביטול</Button>
        <Button onClick={choose} variant="contained" sx={{ fontWeight: 800 }}>פתיחה</Button>
      </Box>
    </Dialog>
  );
}

/* ---------- gamified quest progress: one circle per question, V when solved ---------- */
const popIn = keyframes`
  0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
  60%  { transform: scale(1.25) rotate(6deg); opacity: 1; }
  80%  { transform: scale(0.94) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;
// solved circles keep celebrating for a couple of seconds after the track fills
const cheer = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.14); }
`;
const railFill = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

function QuestProgress({ total, solved, current, size = 44, onPick, onHover, hovered }: { total: number; solved: Set<number>; current?: number; size?: number; onPick?: (i: number) => void; onHover?: (i: number | null) => void; hovered?: number | null }) {
  const done = solved.size;
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: `${Math.round(size * 0.6)}px` }}>
        {/* rail behind the circles + animated green fill up to the solved count */}
        <Box sx={{ position: 'absolute', insetInline: size / 2, height: 7, borderRadius: 4, bgcolor: (t) => alpha(t.palette.text.primary, 0.1) }} />
        <Box sx={{
          position: 'absolute', insetInlineStart: size / 2, height: 7, borderRadius: 4,
          width: `calc((100% - ${size}px) * ${Math.min(1, done / Math.max(1, total - 1))})`,
          bgcolor: 'primary.main', transformOrigin: '0% 50%',
          animation: `${railFill} 1600ms cubic-bezier(0.22, 1, 0.36, 1) 700ms both`,
          '[dir="rtl"] &': { transformOrigin: '100% 50%' },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }} />
        {Array.from({ length: total }, (_, i) => {
          const isSolved = solved.has(i);
          const isCurrent = current === i;
          return (
            <Box
              key={i}
              {...(onPick && { component: 'button' as const, onClick: () => onPick(i), 'aria-label': `שאלה ${i + 1}` })}
              {...(onHover && { onMouseEnter: () => onHover(i), onMouseLeave: () => onHover(null), onFocus: () => onHover(i), onBlur: () => onHover(null) })}
              sx={{
                position: 'relative', zIndex: 1,
                width: size, height: size, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: size * 0.42, fontFeatureSettings: '"tnum","lnum"',
                ...(onPick && { cursor: 'pointer', p: 0, font: 'inherit', fontWeight: 800 }),
                // linked to the matching question card: hovering either one lifts both
                transition: (t) => t.transitions.create(['transform', 'box-shadow']),
                ...(hovered === i && { transform: 'scale(1.18)', boxShadow: 6 }),
                ...(isSolved
                  ? { bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: 3 }
                  : { bgcolor: 'background.paper', border: 2, borderColor: isCurrent ? 'primary.main' : grey[400], color: isCurrent ? 'primary.dark' : 'text.secondary' }),
                // pop in one by one, then solved ones keep cheering for ~2.5s
                animation: isSolved
                  ? `${popIn} 600ms cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 160}ms both, ${cheer} 600ms ease-in-out ${900 + i * 160}ms 3`
                  : `${popIn} 600ms cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 160}ms both`,
                '@media (prefers-reduced-motion: reduce)': { animation: 'none', transition: 'none' },
              }}
            >
              {isSolved ? <CheckRoundedIcon sx={{ fontSize: size * 0.62 }} /> : i + 1}
            </Box>
          );
        })}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}>
        {done === total ? 'סיימת! כל הכבוד 🎉' : `${done}/${total} שאלות`}
      </Typography>
    </Stack>
  );
}

/* ---------- shared header bits ---------- */
// just the number, in a soft round badge — no "שאלה" label
function QMeta({ index, solved, size = 'h6' }: { index: number; solved: boolean; size?: 'h6' | 'h5' }) {
  const d = size === 'h5' ? 44 : 36;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: d, height: d, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 2, borderColor: grey[400], color: 'text.primary',
          fontWeight: 800, fontSize: size === 'h5' ? '1.6rem' : '1.3rem',
          fontFeatureSettings: '"tnum","lnum"',
        }}
      >
        {index + 1}
      </Box>
      {solved && <CheckCircleTwoToneIcon sx={{ color: green[700] }} />}
    </Stack>
  );
}

/* ---------- chat bubble ---------- */
function Bubble({ from, children }: { from: 'student' | 'ai'; children: ReactNode }) {
  const isAi = from === 'ai';
  return (
    // RTL: the student's message sits on the RIGHT (inline start), Alfi answers from the LEFT
    <Stack direction="row" spacing={1} justifyContent={isAi ? 'flex-end' : 'flex-start'} sx={{ width: '100%' }}>
      {isAi && <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><AutoAwesomeTwoToneIcon sx={{ fontSize: 18 }} /></Avatar>}
      <Box sx={{
        maxWidth: '80%', px: 2, py: 1.25, borderRadius: 3,
        bgcolor: (t) => isAi ? alpha(t.palette.primary.main, 0.07) : t.palette.primary.main,
        color: isAi ? 'text.primary' : 'primary.contrastText',
        borderStartStartRadius: isAi ? 24 : 4, borderStartEndRadius: isAi ? 4 : 24,
      }}>
        {children}
      </Box>
    </Stack>
  );
}

/* ---------- the AI chat / answer panel ---------- */
type Msg = { from: 'student' | 'ai'; node: ReactNode };
function ChatPanel({ onSolved }: { onSolved: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' }); }, [msgs.length, thinking]);

  const send = () => {
    if (!draft.trim() || thinking) return;
    const answer = draft.trim();
    setMsgs((m) => [...m, { from: 'student', node: answer }]);
    setDraft('');
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      // demo flow: any answer counts as correct — approve, confetti, mark solved
      setMsgs((m) => [...m, { from: 'ai', node: (
        <Stack direction="row" spacing={0.75} alignItems="center">
          <CheckCircleTwoToneIcon sx={{ color: 'primary.main' }} />
          <Typography sx={{ fontWeight: 800 }}>כל הכבוד! תשובה נכונה! 🎉</Typography>
        </Stack>
      ) }]);
      setConfetti(true);
      window.setTimeout(() => { setConfetti(false); onSolved(); }, 3200);
    }, 1400);
  };

  return (
    <Paper variant="outlined" sx={{ position: 'relative', borderRadius: 3, p: { xs: 2, md: 2.5 } }}>
      {confetti && <Confetti />}
      <Typography sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>הפתרון שלי</Typography>

      {msgs.length === 0 && !thinking && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          כתוב את הפתרון שלך ואלפי ילווה אותך צעד־צעד עד לתשובה הנכונה.
        </Typography>
      )}

      <Stack spacing={1.5} sx={{ mb: msgs.length || thinking ? 2 : 0 }}>
        {msgs.map((m, i) => <Bubble key={i} from={m.from}>{m.node}</Bubble>)}
        {thinking && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><AutoAwesomeTwoToneIcon sx={{ fontSize: 18 }} /></Avatar>
            <Box sx={{ minWidth: 200 }}>
              <LinearProgress sx={{ borderRadius: 4, mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary">מעבד תשובה… עוד כמה שניות</Typography>
            </Box>
          </Stack>
        )}
        <Box ref={endRef} />
      </Stack>

      {/* grows when tapped so there's room to write a full solution */}
      <TextField
        fullWidth multiline minRows={2} value={draft}
        onFocus={() => setExpanded(true)}
        {...(expanded && { minRows: 6 })}
        inputRef={inputRef}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); send(); } }}
        placeholder="כתוב כאן את התשובה שלך…"
        disabled={thinking}
        sx={{ mb: 1 }}
      />
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1, mb: 1.5 }}>
        <Button size="small" variant="outlined" color="inherit" startIcon={<AttachFileRoundedIcon />} onClick={() => setFileOpen(true)} sx={{ color: 'text.secondary' }}>צרף קובץ</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<FunctionsRoundedIcon />} onClick={() => setMathOpen(true)} sx={{ color: 'text.secondary' }}>נוסחה</Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<QrCode2RoundedIcon />} onClick={() => setQrOpen(true)} sx={{ color: 'text.secondary' }}>צלם תשובה</Button>
      </Stack>
      <Button
        fullWidth variant="contained" onClick={send} disabled={thinking || !draft.trim()}
        endIcon={!thinking && <SendRoundedIcon className="dir-icon" />}
        sx={{ fontWeight: 800, py: 1.1 }}
      >
        {thinking ? 'שולח…' : 'שלח תשובה'}
      </Button>

      <MathDialog open={mathOpen} onClose={() => setMathOpen(false)} onPick={(s) => setDraft((d) => d + s)} />
      <QrDialog open={qrOpen} onClose={() => setQrOpen(false)} />
      <FinderDialog open={fileOpen} onClose={() => setFileOpen(false)} onPick={(name) => setDraft((d) => (d ? d + '\n' : '') + `📎 ${name}`)} />
    </Paper>
  );
}

/* ---------- full question page ---------- */
function QuestionPage({ q, index, total, solved, solvedSet, onBack, onSolved, onNext, onPick }: {
  q: Question; index: number; total: number; solved: boolean; solvedSet: Set<number>; onBack: () => void; onSolved: () => void; onNext: (() => void) | null; onPick: (i: number) => void;
}) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, [index]);
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ rowGap: 1.5 }}>
        <Button onClick={onBack} variant="outlined" color="inherit" startIcon={<ArrowForwardRoundedIcon />} sx={{ fontWeight: 700, color: 'text.secondary' }}>
          חזרה לשאלות
        </Button>
        {/* same quest track as the task page, so progress feels continuous */}
        <QuestProgress total={total} solved={solvedSet} current={index} onPick={onPick} />
      </Stack>

      {/* the question, as one page-like sheet: numbering, meta, and prompt together */}
      <Paper elevation={2} sx={{ borderRadius: 3, p: { xs: 3, md: 4.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ rowGap: 1, mb: 2.5 }}>
          <QMeta index={index} solved={solved} size="h5" />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{q.points} נק׳</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>שאלה {index + 1} מתוך {total}</Typography>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Typography component="div" sx={{ fontSize: '1.2rem', lineHeight: 2.1, textAlign: 'start' }}>{q.prompt}</Typography>
      </Paper>

      {solved ? (
        <>
          <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, textAlign: 'center', bgcolor: (t) => alpha(t.palette.success.main, 0.06), borderColor: 'success.light' }}>
            <CheckCircleTwoToneIcon sx={{ fontSize: 44, color: 'success.main' }} />
            <Typography sx={{ fontWeight: 800, mt: 1 }}>כל הכבוד! פתרת את השאלה</Typography>
            <Typography variant="body2" color="success.dark" sx={{ mt: 0.5 }}>התשובה נשמרה</Typography>
          </Paper>
          {/* the saved solution — read-only, numbered lines so a specific line can be referenced in chat */}
          <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>הפתרון שלי</Typography>
            <Stack spacing={1}>
              {q.solution.map((line, i) => (
                <Stack key={i} direction="row" spacing={1.5} alignItems="baseline">
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, minWidth: 16, textAlign: 'center', fontFeatureSettings: '"tnum","lnum"', flexShrink: 0 }}>
                    {i + 1}
                  </Typography>
                  <Typography component="div" sx={{ textAlign: 'start', lineHeight: 2, color: 'text.primary' }}>
                    {line}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </>
      ) : (
        <ChatPanel onSolved={onSolved} />
      )}

      {/* always reachable at the bottom — solved styles it as the primary action */}
      {(onNext || solved) && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
          {onNext
            ? <Button variant="contained" onClick={onNext} endIcon={<ArrowForwardRoundedIcon className="dir-icon" />} sx={{ fontWeight: 800 }}>לשאלה הבאה</Button>
            : <Button variant="contained" onClick={onBack} sx={{ fontWeight: 800 }}>סיימת! חזרה לשאלות</Button>}
        </Stack>
      )}
    </>
  );
}

/* ---------- question list card ---------- */
function QuestionCard({ q, index, solved, onOpen, onHover, hovered }: { q: Question; index: number; solved: boolean; onOpen: () => void; onHover: (i: number | null) => void; hovered: number | null }) {
  return (
    <Card
      variant="outlined"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      sx={{
        borderRadius: 3, borderColor: solved ? 'primary.light' : 'divider',
        bgcolor: (t) => solved ? alpha(t.palette.primary.main, 0.06) : 'background.paper',
        transition: (t) => t.transitions.create(['box-shadow', 'border-color', 'transform']),
        '&:hover': { boxShadow: 4, borderColor: 'primary.main' },
        // paired with its numbered circle in the quest track above
        ...(hovered === index && { boxShadow: 6, borderColor: 'primary.main', transform: 'translateY(-2px)' }),
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <CardActionArea onClick={onOpen} sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <QMeta index={index} solved={solved} />
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{q.points} נק׳</Typography>
            </Stack>
            <Typography component="div" sx={{ color: 'text.primary', textAlign: 'start', lineHeight: 1.8,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {q.prompt}
            </Typography>
            {solved && <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 700, display: 'block', mt: 1 }}>סיכום צ׳אט · התשובה נשמרה</Typography>}
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

/* ---------- task detail (list <-> question page) ---------- */
export function TaskDetail({ task, onBack }: { task: SolveTask; onBack: () => void }) {
  const questions = QUESTIONS.slice(0, Math.max(1, Math.min(task.total, QUESTIONS.length)));
  // the task's solved count seeds the page: those questions arrive already solved
  const [solved, setSolved] = useState<Set<number>>(() => new Set(Array.from({ length: Math.min(task.solved, questions.length) }, (_, i) => i)));
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [hoverQ, setHoverQ] = useState<number | null>(null);
  const done = solved.size;
  // coming back into a fully finished task is a celebration too — confetti on entry
  const [entryConfetti, setEntryConfetti] = useState(done === questions.length);
  useEffect(() => {
    if (!entryConfetti) return;
    const id = window.setTimeout(() => setEntryConfetti(false), 1800);
    return () => window.clearTimeout(id);
  }, [entryConfetti]);

  const markSolved = (i: number) => setSolved((s) => new Set(s).add(i));
  const nextUnsolved = (from: number) => {
    for (let j = from + 1; j < questions.length; j++) if (!solved.has(j)) return j;
    for (let j = 0; j < questions.length; j++) if (j !== from && !solved.has(j)) return j;
    return null;
  };

  // "יש לי שאלה" — the teaching-assistant balloon lives ONLY inside תרגול (never בוחן)
  const alfi = task.kind === 'תרגול' ? <AlfiWidget /> : null;

  if (openQ !== null) {
    const nx = nextUnsolved(openQ);
    return (
      <Shell active="practice" title="">
        {alfi}
        <QuestionPage
          q={questions[openQ]}
          index={openQ}
          total={questions.length}
          solved={solved.has(openQ)}
          solvedSet={solved}
          onPick={setOpenQ}
          onBack={() => setOpenQ(null)}
          onSolved={() => markSolved(openQ)}
          onNext={nx === null ? null : () => setOpenQ(nx)}
        />
      </Shell>
    );
  }

  return (
    <Shell active="practice" title="">
      {alfi}
      {/* re-entering a finished task celebrates again */}
      {entryConfetti && (
        <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: (t) => t.zIndex.modal }}>
          <Confetti />
        </Box>
      )}
      <Button onClick={onBack} variant="outlined" color="inherit" startIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: 'flex-start', fontWeight: 700, color: 'text.secondary' }}>
        חזרה לרשימת המשימות
      </Button>

      {/* header — title, then meta line with the progress tucked under it as helper text */}
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{task.title}</Typography>
          {/* finished test: the grade pill sits right by the title, same style as the list card */}
          {task.grade != null && (
            <Box sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: green[800], display: 'inline-flex', alignItems: 'center', gap: 0.75, alignSelf: 'center' }}>
              <Typography component="span" sx={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1, color: 'common.white', fontFeatureSettings: '"tnum","lnum"', letterSpacing: '-0.01em' }}>{task.grade}</Typography>
              <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, color: 'common.white', opacity: 0.9 }}>ציון</Typography>
            </Box>
          )}
          {/* new until the first question is solved — same rule as the task list */}
          {done === 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ alignSelf: 'center' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'info.dark' }}>חדש</Typography>
            </Stack>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{task.to ? `להגשה עד ${task.to}${hebrewWeekday(task.to)}.` : 'להגשה עד סוף השנה.'}</Typography>
        <Box sx={{ mt: 2 }}>
          <QuestProgress total={questions.length} solved={solved} onPick={setOpenQ} onHover={setHoverQ} hovered={hoverQ} />
        </Box>
      </Box>

      <Divider sx={{ mt: 2.5, mb: 1 }} />

      <Stack spacing={2.5} sx={{ mt: 1 }}>
        {questions.map((q, i) => (
          <QuestionCard key={i} q={q} index={i} solved={solved.has(i)} onOpen={() => setOpenQ(i)} onHover={setHoverQ} hovered={hoverQ} />
        ))}
      </Stack>

      <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
        בתרגול אין ציון — אלפי כאן כדי לעזור לך להגיע לתשובה הנכונה בעצמך.
      </Typography>
    </Shell>
  );
}
