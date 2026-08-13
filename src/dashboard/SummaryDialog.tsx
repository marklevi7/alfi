import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { keyframes, useTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { AlfiAvatar } from './Shell';
import { QMeta } from './TaskDetail';
import { KindIcon, type Kind } from './KindIcon';

// one line of the conversation, exactly as it happened in the question
export type SummaryTurn = { from: 'student' | 'alfi'; text: string; tone?: 'hint' | 'ok' };

// one question inside the summary: the question itself, the whole talk, and the score
export type SummaryQuestion = {
  short: string;
  prompt: string;
  turns: SummaryTurn[];
  points?: number;         // בוחן only — what they got
  outOf?: number;          // בוחן only — what it was worth
  status: 'done' | 'partial' | 'notStarted';
};

export type Summary = {
  title: string;
  kind: Kind;
  when: string;
  score?: number;          // בוחן only
  insight: string;         // תובנות AI — what went well, what didn't
  questions: SummaryQuestion[];
};

// the same numbered-line treatment the chat uses, so the replay reads identically
function NumberedAnswer({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim() !== '');
  return (
    <Stack spacing={0.25}>
      {lines.map((line, i) => (
        <Stack key={i} direction="row" spacing={1.25} alignItems="baseline">
          <Typography component="span" variant="caption" sx={{ minWidth: 16, textAlign: 'center', flexShrink: 0, opacity: 0.55, fontWeight: 700, fontFeatureSettings: '"tnum","lnum"' }}>
            {i + 1}
          </Typography>
          <Typography component="span" variant="body2" sx={{ textAlign: 'start', whiteSpace: 'pre-wrap' }}>{line}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

// the question sheet slides in over the list; the dialog itself never changes size
const takeOver = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to   { opacity: 1; transform: none; }
`;

/** one line of the replayed conversation — the student on the right, Alfi on the left */
function Turn({ turn }: { turn: SummaryTurn }) {
  const mine = turn.from === 'student';
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start" justifyContent={mine ? 'flex-start' : 'flex-end'}>
      {!mine && <AlfiAvatar size={36} />}
      <Box
        sx={{
          maxWidth: '85%', px: 2, py: 1.25, borderRadius: 3,
          ...(mine
            ? { bgcolor: 'primary.main', color: 'primary.contrastText', borderStartStartRadius: 4 }
            : { bgcolor: 'grey.100', borderStartEndRadius: 4 }),
        }}
      >
        {mine ? (
          <NumberedAnswer text={turn.text} />
        ) : (
          <Stack direction="row" spacing={0.75} alignItems="flex-start">
            {turn.tone === 'ok' && <CheckCircleTwoToneIcon sx={{ color: 'primary.main' }} />}
            {turn.tone === 'hint' && <ErrorOutlineRoundedIcon sx={{ color: 'warning.dark', mt: '2px' }} />}
            <Typography variant="body2" sx={{ textAlign: 'start', fontWeight: turn.tone === 'ok' ? 800 : 400 }}>{turn.text}</Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

const points = (q: SummaryQuestion) => `${q.points} מתוך ${q.outOf} נק׳`;

/** three lines of the question and the answer, cut off mid-air so it reads as "there is more inside" */
function Preview({ q }: { q: SummaryQuestion }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [clipped, setClipped] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setClipped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [q]);
  const first = q.turns.find((t) => t.from === 'student');
  return (
    <>
      <Box
        ref={ref}
        sx={{
          height: 76, overflow: 'hidden',
          ...(clipped && {
            maskImage: 'linear-gradient(to top, transparent 0, #000 34px)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0, #000 34px)',
          }),
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.8, textAlign: 'start' }}>{q.prompt}</Typography>
        {first && (
          <Box sx={{ mt: 1 }}>
            <NumberedAnswer text={first.text} />
          </Box>
        )}
      </Box>
      {/* same fixed line the question cards use, hint pushed to the end */}
      <Stack direction="row" alignItems="center" sx={{ height: 22, mt: 1 }}>
        {clipped && (
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, marginInlineStart: 'auto' }}>
            ראה עוד
          </Typography>
        )}
      </Stack>
    </>
  );
}

/** צפה בסיכום — Alfi's read on the whole thing, then every question, openable in full. */
export function SummaryDialog({ summary, onClose }: { summary: Summary | null; onClose: () => void }) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  // one question at a time: opening it puts the whole review inside, and hides the rest
  const [openQ, setOpenQ] = useState<number | null>(null);
  if (!summary) return null;
  const isTest = summary.kind === 'בוחן';
  const open = openQ === null ? null : summary.questions[openQ];

  return (
    <Dialog
      open onClose={onClose} fullScreen={phone} maxWidth="md" fullWidth
      // the box never resizes — the question slides in over the list, inside the same frame
      PaperProps={{ sx: { borderRadius: phone ? 0 : 4, height: phone ? '100%' : 'min(760px, 90vh)' } }}
    >
      <DialogTitle component="div" sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* the icon sits on the title's own line, not between the two lines of text */}
          <Box sx={{ height: 24, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {open ? (
              <IconButton onClick={() => setOpenQ(null)} aria-label="חזרה לרשימת השאלות" sx={{ my: -1 }}>
                <ArrowForwardRoundedIcon />
              </IconButton>
            ) : (
              <KindIcon kind={summary.kind} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: '24px' }}>
              {open ? open.short : summary.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              {open ? summary.title : summary.when}
            </Typography>
          </Box>
          {!open
            && isTest && summary.score != null && (
              <Box sx={{ px: 1.5, py: 0.75, borderRadius: 2, bgcolor: green[800], display: 'inline-flex', alignItems: 'center', gap: 0.75, flexShrink: 0, alignSelf: 'center' }}>
                <Typography component="span" sx={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, color: 'common.white', fontFeatureSettings: '"tnum","lnum"' }}>{summary.score}</Typography>
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, color: 'common.white', opacity: 0.9 }}>ציון</Typography>
              </Box>
            )}
          <IconButton onClick={onClose} aria-label="סגירה" sx={{ alignSelf: 'center' }}><CloseRoundedIcon /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          key={openQ === null ? 'list' : `q${openQ}`}
          sx={{
            animation: `${takeOver} 260ms ${theme.transitions.easing.easeOut} both`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
        {open ? (
          /* one question, everything that happened in it */
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <QMeta index={openQ!} solved={open.status === 'done'} started={open.status === 'partial'} />
              {isTest && open.outOf != null && (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {points(open)}
                </Typography>
              )}
            </Stack>

            <Paper variant="outlined" sx={{ borderRadius: 3, p: 2.5 }}>
              <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.9, textAlign: 'start' }}>{open.prompt}</Typography>
            </Paper>

            {open.turns.length ? (
              <>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>הפתרון שלי — כל השיחה</Typography>
                <Stack spacing={1.5}>
                  {open.turns.map((t, i) => <Turn key={i} turn={t} />)}
                </Stack>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">השאלה נשארה ריקה — לא נשלחה אליה תשובה.</Typography>
            )}
          </Stack>
        ) : (
          <>
            {/* תובנות AI — the headline of the whole review */}
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 4, p: { xs: 2.5, md: 3 }, mb: 3,
                bgcolor: 'grey.100', borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <AlfiAvatar size={64} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>מה אלפי אומר</Typography>
                  <Typography sx={{ fontSize: '1.05rem', lineHeight: 1.8, textWrap: 'pretty' }}>{summary.insight}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Divider sx={{ mb: 2 }} />

            {/* every question: a preview that fades out, tap to open it in full */}
            <Stack spacing={2}>
              {summary.questions.map((q, i) => (
                <Paper
                  key={i}
                  component="button"
                  variant="outlined"
                  onClick={() => setOpenQ(i)}
                  sx={{
                    display: 'block', width: '100%', textAlign: 'start', font: 'inherit', color: 'inherit',
                    cursor: 'pointer', borderRadius: 3, p: 2,
                    transition: (t) => t.transitions.create(['box-shadow', 'border-color']),
                    '&:hover': { boxShadow: 4, borderColor: 'primary.main' },
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                  }}
                >
                  {/* exactly the header of a question card in the task list */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <QMeta index={i} solved={q.status === 'done'} started={q.status === 'partial'} />
                    {isTest && q.outOf != null && (
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                        {points(q)}
                      </Typography>
                    )}
                  </Stack>

                  <Preview q={q} />
                </Paper>
              ))}
            </Stack>
          </>
        )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {open ? (
          <Button onClick={() => setOpenQ(null)} variant="contained" fullWidth startIcon={<ArrowForwardRoundedIcon />} sx={{ py: 1.25, fontWeight: 800 }}>
            חזרה לרשימת השאלות
          </Button>
        ) : (
          <Button onClick={onClose} variant="contained" fullWidth sx={{ py: 1.25, fontWeight: 800 }}>
            חזרה לתמונת מצב
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
