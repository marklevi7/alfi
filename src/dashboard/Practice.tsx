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
  const STATUS_TAG: Partial<Record<Status, { label: string; dot: string; text: string }>> = {
    new: { label: 'חדש', dot: 'info.main', text: 'info.dark' },
    expired: { label: 'פג תוקף', dot: 'error.main', text: 'error.dark' },
    partial: { label: 'בוצע חלקית', dot: amber[600], text: brown[900] },
    notStarted: { label: 'טרם התחלתי', dot: 'grey.500', text: 'text.secondary' },
  };
  // NEW only counts before the first solved question
  const tag = t.status === 'new' && t.solved > 0 ? undefined : STATUS_TAG[t.status];
  const dateText = dateLabel ?? (t.status === 'expired' ? `הסתיים ב-${t.to}` : t.to ? `עד ${t.to}` : 'עד סוף השנה');
  const dateSx = { ...META, whiteSpace: 'nowrap' as const, ...(t.to === null && !dateLabel && { color: 'text.disabled' }), ...(t.status === 'expired' && !dateLabel && { color: 'error.dark', fontWeight: 700 }) };
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
      {/* desktop: one row — icon · content · CTA at the inline end.
          phone: the CTA drops under the content, full width. */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 3 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ px: { xs: 2.5, md: 3.5 }, py: { xs: 2.5, md: 3 } }}
      >
        <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ flex: 1, minWidth: 0 }}>
        {/* the 36px icon is centred on the title's first line (h6 line box = 24px), whatever the title wraps to */}
        <Box sx={{ height: { xs: 24, md: 'auto' }, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <KindIcon kind={t.kind} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {t.title}
              {tag && (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, marginInlineStart: 1, verticalAlign: 'middle' }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tag.dot, flexShrink: 0 }} />
                  <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 700, color: tag.text }}>{tag.label}</Box>
                </Box>
              )}
            </Typography>
            {t.status === 'done' && t.grade != null && (
              <Box sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: green[800], display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                <Typography component="span" sx={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1, color: 'common.white', fontFeatureSettings: '"tnum","lnum"', letterSpacing: '-0.01em' }}>{t.grade}</Typography>
                <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, color: 'common.white', opacity: 0.9 }}>ציון</Typography>
              </Box>
            )}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
            {/* deadline sits at the end of the title row on desktop, and with the meta on a phone */}
            <Typography sx={{ ...dateSx, display: { xs: 'none', md: 'block' } }}>{dateText}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ mt: 1.5, columnGap: 3, rowGap: 1 }}>
            <Typography sx={{ ...META, whiteSpace: 'nowrap' }}>{t.topic} · {t.subTopic}</Typography>
            <Typography sx={{ ...dateSx, display: { xs: 'block', md: 'none' }, width: { xs: '100%', md: 'auto' } }}>{dateText}</Typography>
            {/* phone: the bar and the count get their own full-width line under the meta */}
            <Box sx={{
              width: { xs: '100%', md: 'auto' }, flex: { md: 1 },
              display: { xs: 'flex', md: 'contents' }, alignItems: 'center', gap: 3, flexDirection: 'row-reverse',
            }}>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{ flexGrow: 1, flexBasis: 0, minWidth: 90, height: 8, borderRadius: 4, bgcolor: (th) => alpha(th.palette.text.primary, 0.1), '& .MuiLinearProgress-bar': { bgcolor: barColor }, ...(t.status === 'done' && { bgcolor: alpha(green[500], 0.2), '& .MuiLinearProgress-bar': { bgcolor: green[600] } }), ...(t.status === 'expired' && { '& .MuiLinearProgress-bar': { bgcolor: 'grey.400' } }) }}
            />
            <Typography sx={{ ...META, whiteSpace: 'nowrap' }}>{t.solved}/{t.total} שאלות</Typography>
            </Box>
          </Stack>

          {t.status === 'expired' && (
            <Typography sx={{ ...META, mt: 0.75 }}>
              המועד להגשה חלף, אז המשימה הזאת כבר לא נספרת לציון.
            </Typography>
          )}
        </Box>
        </Stack>

        <Button
          component="span"
          variant={locked ? 'outlined' : 'contained'}
          color={kind}
          // one fixed width on desktop so the CTAs line up in a single column; full width on a phone
          sx={{ fontWeight: 800, pointerEvents: 'none', flexShrink: 0, whiteSpace: 'nowrap', width: { xs: '100%', md: 160 } }}
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
