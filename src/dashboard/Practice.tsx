import { useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { green, amber, red, brown } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { KindIcon, type Kind } from './KindIcon';
import { Shell } from './Shell';
import { TaskDetail } from './TaskDetail';

// expired = deadline passed with questions left; still practiceable, no longer graded.
// partial / notStarted = closed history states (window over): done partially / never opened.
export type TaskStatus = 'new' | 'inProgress' | 'expired' | 'done' | 'partial' | 'notStarted';
type Status = TaskStatus;
// grade = the teacher's mark on a graded, done בוחן (תרגול is never scored).
// to = deadline; null means the teacher set no deadline (open-ended practice).
export type Task = { id: number; title: string; kind: Kind; topic: string; subTopic: string; unit: string; total: number; solved: number; status: Status; from: string; to: string | null; grade?: number };

// Most-urgent first. Placeholder data (mirrors the teacher-sent tasks).
const TASKS: Task[] = [
  { id: 448, title: 'חקירת פונקציה — מנה עם שורש', kind: 'תרגול', topic: 'חקירת פונקציות', subTopic: 'נגזרות', unit: '5 יח"ל', total: 5, solved: 1, status: 'inProgress', from: '10 ביוני 2026', to: '29 ביוני 2026' },
  { id: 449, title: 'בוחן באלגברה', kind: 'בוחן', topic: 'אלגברה', subTopic: 'משוואות ריבועיות', unit: '5 יח"ל', total: 8, solved: 0, status: 'new', from: '12 ביוני 2026', to: '30 ביוני 2026' },
  { id: 459, title: 'טריגונומטריה — זהויות ומשוואות', kind: 'תרגול', topic: 'טריגונומטריה', subTopic: 'זהויות', unit: '5 יח"ל', total: 5, solved: 4, status: 'inProgress', from: '11 ביוני 2026', to: '2 ביולי 2026' },
  { id: 458, title: 'תרגול חופשי — שברים אלגבריים', kind: 'תרגול', topic: 'אלגברה', subTopic: 'שברים אלגבריים', unit: '5 יח"ל', total: 6, solved: 0, status: 'new', from: '14 ביוני 2026', to: null },
  // exactly one example per open state: in-progress, new, new without a deadline.
  // done / expired tasks live on the תמונת מצב timeline (History.tsx ITEMS)
];

// urgent new (has a deadline) first, then ongoing, open-ended last; expired/done sink.
const rankOf = (t: Task) =>
  t.status === 'new' && t.to ? 0
  : t.status === 'inProgress' ? 1
  : t.status === 'new' ? 2
  : t.status === 'expired' ? 3
  : 4;

// Canonical MUI palette roles per kind / status.
const KIND: Record<Kind, 'primary'> = { תרגול: 'primary', בוחן: 'primary' };
// One shared style for all the small meta text in a card (date, topic, count).
const META = { fontSize: '0.8rem', fontWeight: 400, color: 'text.secondary' } as const;

// The one task card, shared by תרגולים and the תמונת מצב timeline.
// dateLabel overrides the deadline text (the timeline shows "היום" etc.).
export function TaskCard({ t, onOpen, dateLabel }: { t: Task; onOpen: () => void; dateLabel?: string }) {
  const kind = KIND[t.kind];
  const pct = t.total ? Math.round((t.solved / t.total) * 100) : 0;
  // barely started is red, work in progress is yellow; green is reserved for a finished task
  const barColor = pct < 34 ? red[500] : amber[600];
  // closed history states are locked: summary only
  const locked = t.status === 'done' || t.status === 'expired' || t.status === 'partial' || t.status === 'notStarted';
  const cta = locked ? 'צפה בסיכום' : t.status === 'inProgress' ? 'המשך תרגול' : 'בוא נתרגל!';
  return (
    <Card
      variant="outlined"
      // the WHOLE card opens the task — click or tab anywhere on it
      component="button"
      type="button"
      onClick={onOpen}
      sx={{
        borderRadius: 3,
        display: 'block', width: '100%', textAlign: 'start', font: 'inherit', cursor: 'pointer', p: 0,
        ...(t.status === 'done' && { bgcolor: green[50] }),
        transition: (th) => th.transitions.create(['box-shadow', 'border-color']),
        '&:hover': { boxShadow: 4, borderColor: `${kind}.main` },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      {/* one compact row: kind icon · content · CTA on the far (inline-end) side */}
      <Stack direction="row" spacing={3} alignItems="center" sx={{ px: 3.5, py: 3 }}>
        <KindIcon kind={t.kind} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{t.title}</Typography>
            {/* only NEW gets the notification dot; solving even 1 question removes it */}
            {t.status === 'new' && t.solved === 0 && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'info.dark' }}>חדש</Typography>
              </Stack>
            )}
            {t.status === 'expired' && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'error.dark' }}>פג תוקף</Typography>
              </Stack>
            )}
            {t.status === 'partial' && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: amber[600], flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: brown[900] }}>בוצע חלקית</Typography>
              </Stack>
            )}
            {t.status === 'notStarted' && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.500', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.secondary' }}>טרם התחלתי</Typography>
              </Stack>
            )}
            {t.status === 'done' && t.grade != null && (
              <Box sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: green[800], display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                <Typography component="span" sx={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1, color: 'common.white', fontFeatureSettings: '"tnum","lnum"', letterSpacing: '-0.01em' }}>{t.grade}</Typography>
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, color: 'common.white', opacity: 0.9 }}>ציון</Typography>
              </Box>
            )}
            <Box sx={{ flex: 1 }} />
            {/* deadline sits at the end of the title row instead of taking its own line */}
            <Typography sx={{ ...META, whiteSpace: 'nowrap', ...(t.to === null && !dateLabel && { color: 'text.disabled' }), ...(t.status === 'expired' && !dateLabel && { color: 'error.dark', fontWeight: 700 }) }}>
              {dateLabel ?? (t.status === 'expired' ? `הסתיים ב-${t.to}` : t.to ? `עד ${t.to}` : 'עד סוף השנה')}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }}>
            <Typography sx={{ ...META, whiteSpace: 'nowrap' }}>{t.topic} · {t.subTopic}</Typography>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: (th) => alpha(th.palette.text.primary, 0.1), '& .MuiLinearProgress-bar': { bgcolor: barColor }, ...(t.status === 'done' && { bgcolor: alpha(green[500], 0.2), '& .MuiLinearProgress-bar': { bgcolor: green[600] } }), ...(t.status === 'expired' && { '& .MuiLinearProgress-bar': { bgcolor: 'grey.400' } }) }}
            />
            <Typography sx={{ ...META, whiteSpace: 'nowrap' }}>{t.solved}/{t.total} שאלות</Typography>
          </Stack>

          {t.status === 'expired' && (
            <Typography sx={{ ...META, mt: 0.75 }}>
              המועד להגשה חלף, אז המשימה הזאת כבר לא נספרת לציון.
            </Typography>
          )}
        </Box>

        <Button
          component="span"
          variant={locked ? 'outlined' : 'contained'}
          color={kind}
          // one fixed width for every card, so the CTAs line up in a single column
          sx={{ fontWeight: 800, pointerEvents: 'none', flexShrink: 0, whiteSpace: 'nowrap', width: 160 }}
        >
          {cta}
        </Button>
      </Stack>
    </Card>
  );
}

export function Practice() {
  const [openId, setOpenId] = useState<number | null>(null);

  // Open work only. Finished / expired tasks live on the תמונת מצב timeline.
  const tasks = useMemo(
    () =>
      TASKS
        .filter((t) => t.status === 'new' || t.status === 'inProgress')
        .slice()
        .sort((a, b) => rankOf(a) - rankOf(b)),
    []
  );

  const openTask = TASKS.find((t) => t.id === openId);
  if (openTask) {
    return <TaskDetail task={{ id: openTask.id, title: openTask.title, total: openTask.total, solved: openTask.solved, from: openTask.from, to: openTask.to, kind: openTask.kind }} onBack={() => setOpenId(null)} />;
  }

  return (
    <Shell active="practice" title="תרגולים ובחנים">
      {/* task list */}
      <Stack spacing={2.5}>
        {tasks.map((t) => <TaskCard key={t.id} t={t} onOpen={() => setOpenId(t.id)} />)}
        {tasks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>עדיין אין משימות</Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>כשהמורה תשלח משימה, היא תופיע כאן</Typography>
          </Box>
        )}
      </Stack>
    </Shell>
  );
}
