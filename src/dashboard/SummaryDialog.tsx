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
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import { green, amber, red, grey } from '@mui/material/colors';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { AlfiAvatar } from './Shell';
import { QMeta } from './TaskDetail';
import { TrafficPill } from './Practice';
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

export type SummaryState = 'done' | 'partial' | 'notStarted' | 'expired';

export type Summary = {
  title: string;
  kind: Kind;
  when: string;
  state: SummaryState;     // how it ended — decides what sits where the grade goes
  topic: string;
  subTopic: string;
  solved: number;
  total: number;
  score?: number;          // בוחן only, and only when it was actually done
  insight: string;         // תובנות AI — what went well, what didn't
  questions: SummaryQuestion[];
};

// what fills the grade slot when there is no grade to show.
// תרגול is never scored, so it gets a traffic light instead; an unfinished
// בוחן says so in words — never a zero, which would read as a failure.
const STATE_LABEL: Record<SummaryState, string> = {
  done: 'בוצע',
  partial: 'בוצע חלקית',
  notStarted: 'לא בוצע',
  expired: 'פג תוקף',
};

function StateBadge({ state }: { state: SummaryState }) {
  const dot = state === 'done' ? green[600] : state === 'partial' ? amber[600] : state === 'expired' ? red[600] : grey[500];
  return (
    <Box sx={{ px: 1.5, py: 0.75, borderRadius: 2, border: 1, borderColor: 'divider', display: 'inline-flex', alignItems: 'center', gap: 1, flexShrink: 0, alignSelf: 'center' }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: dot, flexShrink: 0 }} />
      <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap' }}>
        {STATE_LABEL[state]}
      </Typography>
    </Box>
  );
}

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

// the tapped card unrolls from its own line until it fills the dialog
const unroll = keyframes`
  from { transform: scaleY(0.06); }
  to   { transform: scaleY(1); }
`;
// its contents arrive once the sheet is nearly open, so nothing looks squashed
const settle = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
// coming back is a plain fade — the list was never anywhere else
const shrinkBack = keyframes`
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
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
  // where the tapped card sat, so the question can grow out of exactly that spot
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [origin, setOrigin] = useState('50% 50%');
  const openCard = (i: number, el: HTMLElement) => {
    const box = contentRef.current?.getBoundingClientRect();
    const card = el.getBoundingClientRect();
    if (box && box.height) {
      // the sheet unrolls from the line the card sat on
      const y = ((card.top + card.height / 2 - box.top) / box.height) * 100;
      setOrigin(`50% ${y}%`);
    }
    setOpenQ(i);
  };
  if (!summary) return null;
  const isTest = summary.kind === 'בוחן';
  const open = openQ === null ? null : summary.questions[openQ];
  // same bar language as the card: barely started red, in progress amber,
  // finished green, and a dead deadline goes grey
  const pct = summary.total ? Math.round((summary.solved / summary.total) * 100) : 0;
  const barColor = summary.state === 'expired' ? grey[400] : summary.state === 'done' ? green[600] : pct < 34 ? red[500] : amber[600];
  // the grade, or what happened instead. On a phone it gets its own line under the
  // title; on desktop it sits at the end of the title row.
  // the sheet lights up as it unrolls, then settles back to plain paper
  const glow = keyframes`
    from { background-color: ${alpha(theme.palette.primary.main, 0.16)}; }
    to   { background-color: transparent; }
  `;
  const badge = !isTest && (summary.state === 'done' || summary.state === 'partial' || summary.state === 'expired') ? (
    <TrafficPill solved={summary.solved} total={summary.total} />
  ) : isTest && summary.score != null ? (
    <Box sx={{ px: 1.5, py: 0.75, borderRadius: 2, bgcolor: green[800], display: 'inline-flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
      <Typography component="span" sx={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, color: 'common.white', fontFeatureSettings: '"tnum","lnum"' }}>{summary.score}</Typography>
      <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, color: 'common.white', opacity: 0.9 }}>ציון</Typography>
    </Box>
  ) : (
    <StateBadge state={summary.state} />
  );

  return (
    <Dialog
      open onClose={onClose} fullScreen={phone} maxWidth="md" fullWidth
      // the box never resizes — the question slides in over the list, inside the same frame
      PaperProps={{ sx: { borderRadius: phone ? 0 : 4, height: phone ? '100%' : 'min(760px, 90vh)' } }}
    >
      <DialogTitle component="div" sx={{ pb: 1 }}>
        {/* phone: the close button gets a bar of its own, so the title keeps the full width */}
        {!open && (
          <Stack direction="row" justifyContent="flex-end" sx={{ display: { xs: 'flex', md: 'none' }, mx: -1, mt: -1, mb: 0.5 }}>
            <IconButton onClick={onClose} aria-label="סגירה"><CloseRoundedIcon /></IconButton>
          </Stack>
        )}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* inside a question there is only a way back; the list closes from the far side */}
          {open && (
            <Box sx={{ height: 24, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <IconButton onClick={() => setOpenQ(null)} aria-label="חזרה לרשימת השאלות" sx={{ my: -1 }}>
                <ArrowForwardRoundedIcon />
              </IconButton>
            </Box>
          )}
          {/* the kind icon, on the title's own line — same as the card on the timeline */}
          {!open && (
            <Box sx={{ height: 24, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <KindIcon kind={summary.kind} />
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* one line on a phone, always — a long name is cut, never wrapped into a column */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800, lineHeight: '24px', fontSize: { xs: '1.05rem', md: '1.25rem' },
                whiteSpace: { xs: 'nowrap', md: 'normal' }, overflow: 'hidden', textOverflow: 'ellipsis',
                textWrap: { md: 'balance' },
              }}
            >
              {open ? open.short : summary.title}
            </Typography>
            {open ? (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {summary.title}
              </Typography>
            ) : (
              /* everything the card carried: subject, date, progress */
              <>
                {/* phone: the badge gets its own line, so the title never has to share the row */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 1.25 }}>{badge}</Box>
                <Stack direction="row" alignItems="baseline" flexWrap="wrap" sx={{ mt: 1.25, columnGap: 2, rowGap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {summary.subTopic}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'nowrap', ...(summary.state === 'expired' ? { color: 'error.dark', fontWeight: 700 } : { color: 'text.secondary' }) }}>
                    {summary.when}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" sx={{ mt: 1.25, columnGap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{
                      flex: 1, minWidth: 60, height: 8, borderRadius: 4,
                      bgcolor: (t) => alpha(t.palette.text.primary, 0.1),
                      '& .MuiLinearProgress-bar': { bgcolor: barColor },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {summary.solved}/{summary.total} שאלות
                  </Typography>
                </Stack>
                {summary.state === 'expired' && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    המועד להגשה חלף, אז המשימה הזאת כבר לא נספרת לציון.
                  </Typography>
                )}
              </>
            )}
          </Box>
          {/* desktop: the grade, or what happened instead, at the end of the title row */}
          {!open && (
            <Box sx={{ display: { xs: 'none', md: 'inline-flex' }, alignSelf: 'center', flexShrink: 0 }}>
              {badge}
            </Box>
          )}
          {!open && (
            <IconButton onClick={onClose} aria-label="סגירה" sx={{ display: { xs: 'none', md: 'inline-flex' }, alignSelf: 'center' }}>
              <CloseRoundedIcon />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>

      <DialogContent dividers ref={contentRef}>
        <Box
          key={openQ === null ? 'list' : `q${openQ}`}
          sx={{
            transformOrigin: origin,
            borderRadius: 3,
            animation: open
              ? `${unroll} 460ms ${theme.transitions.easing.easeOut} both, ${glow} 620ms ${theme.transitions.easing.easeOut} both`
              : `${shrinkBack} 320ms ${theme.transitions.easing.easeOut} both`,
            // the text catches up while the sheet is still opening, so it never looks squashed
            '& > *': open
              ? { animation: `${settle} 320ms 120ms ${theme.transitions.easing.easeOut} both` }
              : undefined,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none', '& > *': { animation: 'none' } },
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
              <Typography variant="body2" color="text.secondary">לא נענתה.</Typography>
            )}
          </Stack>
        ) : (
          <>
            {/* תובנות AI — the headline of the whole review.
                Alfi only writes it for something that actually finished, so an
                expired item gets no block at all. */}
            {summary.state !== 'expired' && (
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 4, p: { xs: 2.5, md: 3 }, mb: 3,
                bgcolor: 'grey.100', borderColor: 'divider',
              }}
            >
              {/* a phone has no room for a column beside a 64px head: Alfi sits on the
                  heading line and the text runs the full width underneath */}
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: { xs: 1.5, md: 0 } }}>
                <AlfiAvatar size={phone ? 48 : 64} />
                <Typography variant="h6" sx={{ fontWeight: 800, display: { xs: 'block', md: 'none' } }}>מה אלפי אומר</Typography>
                <Box sx={{ flex: 1, minWidth: 0, display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>מה אלפי אומר</Typography>
                  <Typography sx={{ fontSize: '1.05rem', lineHeight: 1.8, textWrap: 'pretty' }}>{summary.insight}</Typography>
                </Box>
              </Stack>
              <Typography sx={{ display: { xs: 'block', md: 'none' }, lineHeight: 1.8, textWrap: 'pretty' }}>
                {summary.insight}
              </Typography>
            </Paper>
            )}

            <Divider sx={{ mb: 2 }} />

            {/* every question: a preview that fades out, tap to open it in full */}
            <Stack spacing={2}>
              {summary.questions.map((q, i) => (
                <Paper
                  key={i}
                  component="button"
                  variant="outlined"
                  onClick={(e) => openCard(i, e.currentTarget)}
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
          <Button onClick={() => setOpenQ(null)} variant="contained" startIcon={<ArrowForwardRoundedIcon />} sx={{ fontWeight: 800 }}>
            חזרה לרשימת השאלות
          </Button>
        ) : (
          <Button onClick={onClose} variant="contained" sx={{ fontWeight: 800 }}>
            חזרה לתמונת מצב
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
