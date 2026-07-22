import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
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
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import { Shell } from './Shell';

// to = deadline; null means the teacher set no deadline (open-ended practice).
export type SolveTask = { id: number; title: string; total: number; from: string; to: string | null };

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
type Question = { points: number; diff: 'קשה' | 'בינוני' | 'קל'; short: string; prompt: ReactNode; guide: Turn };

const QUESTIONS: Question[] = [
  {
    points: 20, diff: 'קשה', short: 'חקירת פונקציה מלאה',
    prompt: <>נתונה הפונקציה <Eq>y = <Frac n={<>√(x²−1)</>} d={<>x−2</>} /></Eq>. ערוך חקירה מלאה: תחום הגדרה, נגזרת, אסימפטוטות, נקודות קיצון, ותחומי עלייה וירידה.</>,
    guide: { title: 'חקירה מלאה כוללת 5 שלבים', body: <>1. תחום הגדרה  2. נגזרת  3. אסימפטוטות  4. נקודות קיצון  5. תחומי עלייה וירידה.<br />נתחיל מהתחלה — <b>מה תחום ההגדרה לדעתך?</b></> },
  },
  {
    points: 20, diff: 'קל', short: 'תחום הגדרה',
    prompt: <>מצא את תחום ההגדרה של הפונקציה <Eq>y = <Frac n={<>√x</>} d={<>x−9</>} /></Eq>.</>,
    guide: { body: <>לתחום צריך שני תנאים <b>בנפרד</b>: השורש חייב להיות ≥ 0, והמכנה ≠ 0. <b>מה יוצא מהתנאי הראשון?</b></> },
  },
  {
    points: 20, diff: 'קל', short: 'אסימפטוטות',
    prompt: <>מצא את האסימפטוטות של <Eq>y = <Frac n={<>√x</>} d={<>x−9</>} /></Eq> והסבר כיצד הפונקציה מתנהגת משני צידי האסימפטוטה האנכית.</>,
    guide: { body: <>האסימפטוטה האנכית נמצאת היכן שהמכנה מתאפס. <b>באיזה x זה קורה?</b></> },
  },
  {
    points: 20, diff: 'בינוני', short: 'תחום, נגזרת וקיצון',
    prompt: <>נתונה <Eq>y = <Frac n={<>x</>} d={<>√(x²−9)</>} /></Eq>. מצא את תחום ההגדרה, חשב את הנגזרת, ומצא נקודות קיצון אם קיימות.</>,
    guide: { body: <>נתחיל מהתחום: הביטוי תחת השורש חייב להיות חיובי <b>ממש</b>. <b>מה אי-השוויון שצריך לפתור?</b></> },
  },
  {
    points: 20, diff: 'בינוני', short: 'תחום ונקודות חיתוך',
    prompt: <>נתונה <Eq>y = √(x²−4)</Eq>. מצא את תחום ההגדרה ואת נקודות החיתוך עם הצירים.</>,
    guide: { body: <>תחת השורש חייב להיות ≥ 0. <b>מה פתרון אי-השוויון x²−4 ≥ 0?</b></> },
  },
];

/* ---------- confetti (MUI only, reduced-motion aware) ---------- */
const CONFETTI = [deepPurple[400], blue[400], cyan[400], amber[400], green[400], pink[400]];
const burst = keyframes`
  0%   { transform: translate(0,0) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
`;
function Confetti() {
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 4 }}>
      {Array.from({ length: 32 }).map((_, i) => {
        const dx = (i % 2 ? 1 : -1) * (30 + (i * 13) % 240);
        const dy = -70 - (i * 29) % 200;
        const rot = 180 + (i * 47) % 360;
        const c = CONFETTI[i % CONFETTI.length];
        return (
          <Box key={i} sx={{
            position: 'absolute', top: '42%', left: '50%', width: 9, height: 9, borderRadius: 0.5, bgcolor: c,
            ['--dx' as string]: `${dx}px`, ['--dy' as string]: `${dy}px`, ['--rot' as string]: `${rot}deg`,
            animation: `${burst} ${900 + (i % 5) * 120}ms cubic-bezier(0.16,1,0.3,1) forwards`,
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
              <Button fullWidth variant="outlined" onClick={() => { onPick(s); onClose(); }} sx={{ minHeight: 48, fontSize: '1.1rem', borderRadius: 2 }}>{s}</Button>
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
  ? <PictureAsPdfRoundedIcon sx={{ color: red[400] }} />
  : <ImageRoundedIcon sx={{ color: blue[400] }} />);

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
                <ListItemIcon sx={{ minWidth: 30 }}><FolderRoundedIcon fontSize="small" sx={{ color: amber[600] }} /></ListItemIcon>
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
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700, borderRadius: 2 }}>ביטול</Button>
        <Button onClick={choose} variant="contained" sx={{ fontWeight: 800, borderRadius: 2 }}>פתיחה</Button>
      </Box>
    </Dialog>
  );
}

/* ---------- shared header bits ---------- */
function QMeta({ index, solved, size = 'h6' }: { index: number; solved: boolean; size?: 'h6' | 'h5' }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant={size} sx={{ fontWeight: 800 }}>שאלה {index + 1}</Typography>
      {solved && <CheckCircleRoundedIcon sx={{ color: green[700] }} />}
    </Stack>
  );
}
const DiffChip = ({ diff }: { diff: string }) => (
  <Chip size="small" variant="outlined" label={diff} sx={{ fontWeight: 700, color: 'text.secondary', borderColor: 'divider' }} />
);

/* ---------- chat bubble ---------- */
function Bubble({ from, children }: { from: 'student' | 'ai'; children: ReactNode }) {
  const isAi = from === 'ai';
  return (
    <Stack direction="row" spacing={1} justifyContent={isAi ? 'flex-start' : 'flex-end'} sx={{ width: '100%' }}>
      {isAi && <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} /></Avatar>}
      <Box sx={{
        maxWidth: '80%', px: 2, py: 1.25, borderRadius: 3,
        bgcolor: (t) => isAi ? alpha(t.palette.primary.main, 0.07) : t.palette.primary.main,
        color: isAi ? 'text.primary' : 'primary.contrastText',
        borderStartStartRadius: isAi ? 4 : 24, borderStartEndRadius: isAi ? 24 : 4,
      }}>
        {children}
      </Box>
    </Stack>
  );
}

/* ---------- the AI chat / answer panel ---------- */
type Msg = { from: 'student' | 'ai'; node: ReactNode };
function ChatPanel({ q, onSolved }: { q: Question; onSolved: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [turn, setTurn] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
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
      if (turn === 0) {
        setMsgs((m) => [...m, { from: 'ai', node: (
          <Box>
            {q.guide.title && <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{q.guide.title}</Typography>}
            <Typography variant="body2">{q.guide.body}</Typography>
          </Box>
        ) }]);
        setTurn(1);
      } else {
        setMsgs((m) => [...m, { from: 'ai', node: (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <CheckCircleRoundedIcon sx={{ color: 'success.main' }} />
            <Typography sx={{ fontWeight: 800 }}>כל הכבוד! תשובה נכונה!</Typography>
          </Stack>
        ) }]);
        setConfetti(true);
        window.setTimeout(() => { setConfetti(false); onSolved(); }, 1500);
      }
    }, 1400);
  };

  return (
    <Paper variant="outlined" sx={{ position: 'relative', borderRadius: 3, p: { xs: 2, md: 2.5 } }}>
      {confetti && <Confetti />}
      <Typography sx={{ fontWeight: 800, color: 'primary.dark', mb: 1.5 }}>צ׳אט משוב עם הסוכן</Typography>

      {msgs.length === 0 && !thinking && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          כתוב את הפתרון שלך ואלפי ילווה אותך צעד־צעד עד לתשובה הנכונה.
        </Typography>
      )}

      <Stack spacing={1.5} sx={{ mb: msgs.length || thinking ? 2 : 0 }}>
        {msgs.map((m, i) => <Bubble key={i} from={m.from}>{m.node}</Bubble>)}
        {thinking && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} /></Avatar>
            <Box sx={{ minWidth: 200 }}>
              <LinearProgress sx={{ borderRadius: 4, mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary">מעבד תשובה… עוד כמה שניות</Typography>
            </Box>
          </Stack>
        )}
        <Box ref={endRef} />
      </Stack>

      <TextField
        fullWidth multiline minRows={2} value={draft}
        inputRef={inputRef}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); send(); } }}
        placeholder="כתוב כאן את התשובה שלך…"
        disabled={thinking}
        sx={{ mb: 1 }}
      />
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1, mb: 1.5 }}>
        <Button size="small" variant="outlined" startIcon={<AttachFileRoundedIcon />} onClick={() => setFileOpen(true)} sx={{ borderRadius: 2 }}>צרף קובץ</Button>
        <Button size="small" variant="outlined" startIcon={<FunctionsRoundedIcon />} onClick={() => setMathOpen(true)} sx={{ borderRadius: 2 }}>נוסחה</Button>
        <Button size="small" variant="outlined" startIcon={<QrCode2RoundedIcon />} onClick={() => setQrOpen(true)} sx={{ borderRadius: 2 }}>צלם תשובה</Button>
      </Stack>
      <Button
        fullWidth variant="contained" onClick={send} disabled={thinking || !draft.trim()}
        endIcon={!thinking && <SendRoundedIcon className="dir-icon" />}
        sx={{ fontWeight: 800, borderRadius: 2, py: 1.1 }}
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
function QuestionPage({ q, index, total, solved, onBack, onSolved, onNext }: {
  q: Question; index: number; total: number; solved: boolean; onBack: () => void; onSolved: () => void; onNext: (() => void) | null;
}) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, [index]);
  return (
    <>
      <Button onClick={onBack} variant="outlined" color="inherit" startIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: 'flex-start', fontWeight: 700, borderRadius: 2, color: 'text.secondary' }}>
        חזרה לשאלות
      </Button>

      {/* the question, as one page-like sheet: numbering, meta, and prompt together */}
      <Paper elevation={2} sx={{ borderRadius: 3, p: { xs: 3, md: 4.5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ rowGap: 1, mb: 2.5 }}>
          <QMeta index={index} solved={solved} size="h5" />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DiffChip diff={q.diff} />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{q.points} נק׳</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>שאלה {index + 1} מתוך {total}</Typography>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        <Typography component="div" sx={{ fontSize: '1.2rem', lineHeight: 2.1, textAlign: 'start' }}>{q.prompt}</Typography>
      </Paper>

      {solved ? (
        <Paper variant="outlined" sx={{ borderRadius: 3, p: 3, textAlign: 'center', bgcolor: (t) => alpha(t.palette.success.main, 0.06), borderColor: 'success.light' }}>
          <CheckCircleRoundedIcon sx={{ fontSize: 44, color: 'success.main' }} />
          <Typography sx={{ fontWeight: 800, mt: 1 }}>כל הכבוד! פתרת את השאלה</Typography>
          <Typography variant="body2" color="success.dark" sx={{ mt: 0.5 }}>התשובה נשמרה</Typography>
        </Paper>
      ) : (
        <ChatPanel q={q} onSolved={onSolved} />
      )}

      {solved && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
          {onNext
            ? <Button variant="contained" onClick={onNext} endIcon={<ArrowForwardRoundedIcon className="dir-icon" />} sx={{ fontWeight: 800, borderRadius: 2 }}>לשאלה הבאה</Button>
            : <Button variant="contained" color="success" onClick={onBack} sx={{ fontWeight: 800, borderRadius: 2 }}>סיימת! חזרה לשאלות</Button>}
        </Stack>
      )}
    </>
  );
}

/* ---------- question list card ---------- */
function QuestionCard({ q, index, solved, onOpen }: { q: Question; index: number; solved: boolean; onOpen: () => void }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3, borderColor: solved ? 'success.light' : 'divider',
        bgcolor: (t) => solved ? alpha(t.palette.success.main, 0.06) : 'background.paper',
        transition: (t) => t.transitions.create(['box-shadow', 'border-color']),
        '&:hover': { boxShadow: 4, borderColor: 'primary.main' },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <CardActionArea onClick={onOpen} sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <QMeta index={index} solved={solved} />
              <Stack direction="row" spacing={1} alignItems="center">
                <DiffChip diff={q.diff} />
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{q.points} נק׳</Typography>
              </Stack>
            </Stack>
            <Typography component="div" sx={{ color: 'text.primary', textAlign: 'start', lineHeight: 1.8,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {q.prompt}
            </Typography>
            {solved && <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 700, display: 'block', mt: 1 }}>סיכום צ׳אט · התשובה נשמרה</Typography>}
          </Box>
          <ChevronLeftRoundedIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
        </Stack>
      </CardActionArea>
    </Card>
  );
}

/* ---------- task detail (list <-> question page) ---------- */
export function TaskDetail({ task, onBack }: { task: SolveTask; onBack: () => void }) {
  const questions = QUESTIONS.slice(0, Math.max(1, Math.min(task.total, QUESTIONS.length)));
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [openQ, setOpenQ] = useState<number | null>(null);
  const done = solved.size;
  const pct = Math.round((done / questions.length) * 100);

  const markSolved = (i: number) => setSolved((s) => new Set(s).add(i));
  const nextUnsolved = (from: number) => {
    for (let j = from + 1; j < questions.length; j++) if (!solved.has(j)) return j;
    for (let j = 0; j < questions.length; j++) if (j !== from && !solved.has(j)) return j;
    return null;
  };

  if (openQ !== null) {
    const nx = nextUnsolved(openQ);
    return (
      <Shell active="practice" title="">
        <QuestionPage
          q={questions[openQ]}
          index={openQ}
          total={questions.length}
          solved={solved.has(openQ)}
          onBack={() => setOpenQ(null)}
          onSolved={() => markSolved(openQ)}
          onNext={nx === null ? null : () => setOpenQ(nx)}
        />
      </Shell>
    );
  }

  return (
    <Shell active="practice" title="">
      <Button onClick={onBack} startIcon={<ArrowForwardRoundedIcon />} sx={{ alignSelf: 'flex-start', fontWeight: 700, color: 'text.secondary' }}>
        חזרה לרשימת המשימות
      </Button>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>{task.title} <Typography component="span" color="text.secondary" sx={{ fontWeight: 700 }}>#{task.id}</Typography></Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>נשלח על ידי המורה · {task.to ? `עד ${task.to}` : 'עד סוף השנה'}</Typography>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 2, md: 2.5 }, bgcolor: (t) => alpha(t.palette.primary.main, 0.07) }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.dark' }}>{done} / {questions.length} שאלות</Typography>
          <Typography variant="body2" color="text.secondary">{done === questions.length ? 'סיימת! כל הכבוד 🎉' : 'התקדמות'}</Typography>
        </Stack>
        <LinearProgress
          variant="determinate" value={pct} color="primary"
          sx={{ height: 8, borderRadius: 4, bgcolor: (t) => alpha(t.palette.primary.main, 0.15) }}
        />
      </Paper>

      <Stack spacing={1.5}>
        {questions.map((q, i) => (
          <QuestionCard key={i} q={q} index={i} solved={solved.has(i)} onOpen={() => setOpenQ(i)} />
        ))}
      </Stack>

      <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', mt: 1 }}>
        בתרגול אין ציון — אלפי כאן כדי לעזור לך להגיע לתשובה הנכונה בעצמך.
      </Typography>
    </Shell>
  );
}
