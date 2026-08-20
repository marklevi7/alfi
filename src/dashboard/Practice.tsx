import { useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { green, amber, red, brown, blue } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { KindIcon, type Kind } from './KindIcon';
import { Shell, AlfiAvatar } from './Shell';
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
/* One pill, two contents: a בוחן shows its grade, a תרגול shows a traffic light.
   Same height, same padding, same type — only what is inside changes. */
const PILL = {
  height: 28, px: 1.25, borderRadius: 1.5, flexShrink: 0,
  display: 'inline-flex', alignItems: 'center', gap: 0.75,
} as const;
const PILL_TEXT = { fontSize: '0.9rem', fontWeight: 800, lineHeight: 1, whiteSpace: 'nowrap' } as const;

// same white pill as the traffic light, so a grade and a rating read as one family
export function GradePill({ grade }: { grade: number }) {
  return (
    <Box sx={{ ...PILL, bgcolor: 'background.paper', border: 1, borderColor: 'grey.400' }}>
      <Typography component="span" sx={{ ...PILL_TEXT, color: 'text.secondary' }}>ציון:</Typography>
      <Typography component="span" sx={{ ...PILL_TEXT, color: 'text.primary', fontFeatureSettings: '"tnum","lnum"' }}>{grade}</Typography>
    </Box>
  );
}

/* Everything solved is green, most of it amber, barely any of it red —
   the same thresholds the progress bar uses. Nothing solved gets no rating
   at all: there is nothing there to judge. */
export const TRAFFIC = [
  { dot: red[600], label: 'טעון שיפור' },
  { dot: amber[600], label: 'בסדר' },
  { dot: green[600], label: 'מצוין' },
] as const;
export const trafficFor = (solved: number, total: number) => {
  const pct = total ? (solved / total) * 100 : 0;
  return TRAFFIC[pct >= 100 ? 2 : pct < 34 ? 0 : 1];
};

export function TrafficPill({ solved, total }: { solved: number; total: number }) {
  if (!solved) return null;
  const t = trafficFor(solved, total);
  // white with a hairline, so it reads on a plain card and on a tinted one alike
  return (
    <Box sx={{ ...PILL, bgcolor: 'background.paper', border: 1, borderColor: 'grey.400' }}>
      {/* the colour is the rating — the word would only repeat it */}
      <Typography component="span" sx={{ ...PILL_TEXT, color: 'text.secondary' }}>ציון:</Typography>
      <Box aria-label={t.label} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.dot, flexShrink: 0 }} />
    </Box>
  );
}

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
  // NEW only counts before the first solved question.
  // תרגול says "partly done" with its traffic light, so the word tag would repeat it.
  const traffic = t.kind === 'תרגול' && t.solved > 0 && (t.status === 'done' || t.status === 'partial' || t.status === 'expired');
  // closed states say nothing in words: the bar, the count and the pill already do
  const byDate = t.status === 'expired' || t.status === 'notStarted';
  const tag = (t.status === 'new' && t.solved > 0) || (traffic && t.status === 'partial') || byDate
    ? undefined
    : STATUS_TAG[t.status];
  const dateText = dateLabel ?? (t.status === 'expired' ? `הסתיים ב-${t.to}` : t.to ? `עד ${t.to}` : 'עד סוף השנה');
  const dateSx = { ...META, whiteSpace: 'nowrap' as const, ...(t.to === null && !dateLabel && { color: 'text.disabled' }), ...(t.status === 'expired' && !dateLabel && { color: 'error.dark', fontWeight: 700 }) };
  // no status words on the card at all — the red date, the bar and the pill carry it
  const dateNode = <Typography sx={dateSx}>{dateText}</Typography>;
  // bar and count: beside the meta on desktop, a full-width line of its own on a phone
  const progressNode = (
    <>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{ flexGrow: 1, flexBasis: 0, minWidth: 60, height: 8, borderRadius: 4, bgcolor: (th) => alpha(th.palette.text.primary, 0.1), '& .MuiLinearProgress-bar': { bgcolor: barColor }, ...(t.status === 'done' && { bgcolor: alpha(green[500], 0.2), '& .MuiLinearProgress-bar': { bgcolor: green[600] } }), ...(t.status === 'expired' && { '& .MuiLinearProgress-bar': { bgcolor: 'grey.400' } }) }}
      />
      <Typography sx={{ ...META, whiteSpace: 'nowrap' }}>{t.solved}/{t.total} שאלות</Typography>
    </>
  );
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
        // the card is a plain button, so it needs the design system's focus ring spelled out
        '&:focus-visible': { outline: (th: Theme) => `${th.spacing(0.375)} solid ${blue[700]}`, outlineOffset: (th: Theme) => th.spacing(0.25) },
        ...(t.status === 'done' && { bgcolor: green[50] }),
        transition: (th) => th.transitions.create(['box-shadow', 'border-color']),
        // the whole card is the button, so hovering it also lights up the call to action inside
        '&:hover': {
          boxShadow: 4, borderColor: `${kind}.main`,
          '& .MuiButton-contained': { bgcolor: `${kind}.dark` },
          '& .MuiButton-outlined': { bgcolor: (th: Theme) => alpha(th.palette[kind].main, th.palette.action.hoverOpacity) },
        },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      {/* desktop: one row — icon · content · CTA at the inline end.
          phone: the CTA drops under the content, full width. */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1.5, md: 3 }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{ px: { xs: 2, md: 3.5 }, py: { xs: 2, md: 3 } }}
      >
        {/* icon, then the title and its meta beside it, then the pill at the far end */}
        <Stack
          direction="row"
          spacing={{ xs: 1.5, md: 3 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ flex: 1, minWidth: 0 }}
        >
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <KindIcon kind={t.kind} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {/* desktop: one row, fixed height so a pill never makes a card taller.
              phone: the grade or traffic light always drops to its own line under the title. */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            flexWrap="wrap"
            sx={{ rowGap: 0.5, minHeight: { md: 32 } }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: { xs: 1.1, md: 1.2 } }}>
              {t.title}
              {tag && (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, marginInlineStart: 1, verticalAlign: 'middle' }}>
                  <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tag.dot, flexShrink: 0 }} />
                  <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 700, color: tag.text }}>{tag.label}</Box>
                </Box>
              )}
            </Typography>
            {/* תרגול gets the traffic light in the slot where a בוחן shows its grade */}
            <Box sx={{ display: { xs: 'none', md: 'inline-flex' }, gap: 1 }}>
              {traffic && <TrafficPill solved={t.solved} total={t.total} />}
              {t.status === 'done' && t.grade != null && <GradePill grade={t.grade} />}
            </Box>
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
            {/* deadline sits at the end of the title row on desktop, and with the meta on a phone */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>{dateNode}</Box>
          </Stack>

          <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ mt: { xs: 0.25, md: 1.5 }, columnGap: 3, rowGap: { xs: 0.75, md: 1 } }}>
            {/* the title already names the topic — only the sub-topic adds anything */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              <Typography sx={{ ...META, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subTopic}</Typography>
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                <Typography sx={{ ...META }}>·</Typography>
                {dateNode}
              </Box>
            </Stack>
            {/* desktop only: the bar shares the meta row */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'contents' } }}>{progressNode}</Box>
          </Stack>

        </Box>
        </Stack>

        {/* phone: the grade or the rating gets its own line under the title,
            starting at the same edge as the bar below it */}
        {/* phone: one line — the pill, then the count, then the bar filling what is left */}
        <Stack direction="row-reverse" alignItems="center" spacing={4} sx={{ display: { xs: 'flex', md: 'none' } }}>
          {/* the count hugs the bar — the wide gap belongs only before the pill */}
          <Stack direction="row-reverse" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            {progressNode}
          </Stack>
          {traffic && <TrafficPill solved={t.solved} total={t.total} />}
          {t.status === 'done' && t.grade != null && <GradePill grade={t.grade} />}
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

export function Practice({ empty = false }: { empty?: boolean }) {
  const [openId, setOpenId] = useState<number | null>(null);

  // Open work only. Finished / expired tasks live on the תמונת מצב timeline.
  const tasks = useMemo(
    () =>
      TASKS
        .filter((t) => !empty && (t.status === 'new' || t.status === 'inProgress'))
        .slice()
        .sort((a, b) => rankOf(a) - rankOf(b)),
    [empty]
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
          /* nothing was sent yet — same empty state Alfi uses on תמונת מצב */
          <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', py: { xs: 6, md: 10 }, px: 2, maxWidth: 460, mx: 'auto' }}>
            <AlfiAvatar size={96} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>אין לך משימות כרגע</Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.9, textWrap: 'pretty' }}>
              כשהמורה תשלח תרגול או בוחן, הם יופיעו כאן ואפשר יהיה להתחיל לפתור.
            </Typography>
          </Stack>
        )}
      </Stack>
    </Shell>
  );
}
