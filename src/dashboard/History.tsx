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
import { TaskCard, type TaskStatus } from './Practice';
import { TaskDetail } from './TaskDetail';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useNav } from '../nav';
import { green, amber, grey, brown, blueGrey, red, deepOrange, blue } from '@mui/material/colors';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';
import TaskAltTwoToneIcon from '@mui/icons-material/TaskAltTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import { Shell } from './Shell';

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
  // history starts yesterday — nothing from today lives here
  { title: 'בוחן באלגברה', kind: 'בוחן', when: 'אתמול', status: 'done', score: 88, topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'משוואות ריבועיות', solved: 8, total: 8 },
  { title: 'תרגול גיאומטריה אנליטית', kind: 'תרגול', when: 'אתמול', status: 'partial', topic: 'גיאומטריה אנליטית', unit: '5 יח"ל', subTopic: 'הישר והמעגל', solved: 2, total: 5 },
  { title: 'בוחן בטריגונומטריה', kind: 'בוחן', when: 'לפני יומיים', status: 'notStarted', topic: 'טריגונומטריה', unit: '4 יח"ל', subTopic: 'זהויות טריגונומטריות', solved: 0, total: 6 },
  { title: 'תרגול חקירת פונקציות', kind: 'תרגול', when: 'לפני 3 ימים', status: 'done', topic: 'חקירת פונקציות', unit: '5 יח"ל', subTopic: 'נגזרות', solved: 4, total: 4 },
  { title: 'בוחן בהסתברות', kind: 'בוחן', when: 'לפני 4 ימים', status: 'expired', topic: 'הסתברות', unit: '5 יח"ל', subTopic: 'עץ הסתברות', solved: 2, total: 5 },
  { title: 'בוחן בסדרות', kind: 'בוחן', when: 'לפני 5 ימים', status: 'done', score: 91, topic: 'סדרות', unit: '5 יח"ל', subTopic: 'סדרה חשבונית', solved: 5, total: 5 },
  { title: 'תרגול הסתברות', kind: 'תרגול', when: 'בשבוע שעבר', status: 'partial', topic: 'הסתברות', unit: '4 יח"ל', subTopic: 'הסתברות מותנית', solved: 2, total: 4 },
  { title: 'בוחן באלגברה', kind: 'בוחן', when: 'בשבוע שעבר', status: 'done', score: 73, topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'פונקציות', solved: 6, total: 6 },
  // moved here from the תרגולים list — finished tasks live on the timeline
  { title: 'בוחן בגיאומטריה אנליטית', kind: 'בוחן', when: 'לפני שבועיים', status: 'done', score: 88, topic: 'גיאומטריה אנליטית', unit: '5 יח"ל', subTopic: 'הישר והמעגל', solved: 6, total: 6 },
  { title: 'בוחן בטריגונומטריה', kind: 'בוחן', when: 'לפני שבועיים', status: 'done', score: 76, topic: 'טריגונומטריה', unit: '4 יח"ל', subTopic: 'משוואות טריגונומטריות', solved: 5, total: 5 },
  { title: 'בוחן בחקירת פונקציות', kind: 'בוחן', when: 'לפני שלושה שבועות', status: 'done', score: 94, topic: 'חקירת פונקציות', unit: '5 יח"ל', subTopic: 'אסימפטוטות', solved: 8, total: 8 },
];

const uniq = (arr: string[]) => Array.from(new Set(arr));
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

export function History() {
  const nav = useNav();
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('');
  const [unit] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [kind, setKind] = useState<'all' | Kind>('all');
  // a fully-completed test can be opened read-only, like a regular task
  const [openItem, setOpenItem] = useState<Item | null>(null);

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

  if (openItem) {
    return (
      <TaskDetail
        task={{ id: ITEMS.indexOf(openItem) + 440, title: openItem.title, total: openItem.total, solved: openItem.solved, from: '', to: null, grade: openItem.score, kind: openItem.kind }}
        onBack={() => setOpenItem(null)}
      />
    );
  }

  return (
    <Shell active="history" title="תמונת מצב">
      {/* Stats — one card, 3 columns */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ py: 4, px: 0, '&:last-child': { pb: 4 } }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            {STATS.map((s) => {
              const pct = s.total ? Number(s.value) / s.total : 0;
              const tier = pct >= 0.7 ? 'gold' : pct < 0.3 ? 'bronze' : 'silver';
              return (
                <Box key={s.label} sx={{ flex: 1, textAlign: 'center', px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { fontSize: '1.75rem' } }}>
                      {s.icon}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{s.label}</Typography>
                  </Stack>
                  {/* value slot — fixed height keeps number & medal on one baseline */}
                  <Box sx={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.label === 'תרגולים השבוע'
                      ? <Box sx={{ mt: '-6px', display: 'flex' }}><Medal tier={tier} size={54} /></Box>
                      : <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>{s.value}</Typography>}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>{s.sub}</Typography>
                  {/* progress slot — fixed height so all columns align even when empty */}
                  <Box sx={{ mt: 2, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.total > 0 && (
                      <Stack direction="row" spacing={0.5}>
                        {Array.from({ length: s.total }).map((_, i) => (
                          <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: i < Number(s.value) ? 'primary.main' : 'grey.300' }} />
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Filters — bare row, no card */}
      <Box sx={{ px: 0.5 }}>
          <Stack direction="row" flexWrap="nowrap" gap={1} alignItems="center">
            <TextField
              size="small"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="חיפוש לפי שם"
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment>) }}
              sx={{ flex: '1 1 120px', minWidth: 110 }}
            />
            <TextField select size="small" label="נושא" value={topic} onChange={(e) => setTopic(e.target.value)} sx={{ flex: '1 1 110px', minWidth: 100 }}>
              <MenuItem value="">כל הנושאים</MenuItem>
              {TOPICS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="תת נושא" value={subTopic} onChange={(e) => setSubTopic(e.target.value)} sx={{ flex: '1 1 110px', minWidth: 100 }}>
              <MenuItem value="">הכל</MenuItem>
              {SUBTOPICS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={kind}
              onChange={(_, v) => v && setKind(v)}
              sx={{ flexShrink: 0, '& .MuiToggleButton-root': { px: 1.25, fontWeight: 700, textTransform: 'none' } }}
            >
              <ToggleButton value="all">הכל</ToggleButton>
              <ToggleButton value="תרגול">תרגול</ToggleButton>
              <ToggleButton value="בוחן">בוחן</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
      </Box>

      {/* timeline: every item hangs on a vertical rail — dot = submission state
          (filled = done, half = partial, hollow = not started / expired) */}
      <Box sx={{ position: 'relative', paddingInlineStart: 4.5 }}>
        <Box sx={{ position: 'absolute', insetInlineStart: '11px', top: 14, bottom: 14, width: 2, bgcolor: 'divider', borderRadius: 1 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
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
              onOpen={() => (it.status === 'done' ? setOpenItem(it) : nav.go('practice'))}
            />
          </Box>
          );
        })}
        </Box>
      </Box>
      {items.length === 0 && (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 6, fontWeight: 600 }}>
          לא נמצאו תוצאות
        </Typography>
      )}
    </Shell>
  );
}
