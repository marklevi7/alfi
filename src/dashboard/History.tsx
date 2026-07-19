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
import ButtonBase from '@mui/material/ButtonBase';
import { alpha } from '@mui/material/styles';
import { useNav } from '../nav';
import { green, amber, grey, brown, blueGrey, red } from '@mui/material/colors';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { Shell } from './Shell';

const STATS = [
  { label: 'רצף תרגול', value: '4', total: 5, sub: '4 מתוך 5 ימים', icon: <LocalFireDepartmentRoundedIcon />, tone: 'primary' as const },
  { label: 'תרגולים השבוע', value: '5', total: 12, sub: '5 מתוך 12 תרגילים', icon: <TaskAltRoundedIcon />, tone: 'warning' as const },
  { label: 'בוחנים השבוע', value: '2', total: 0, sub: 'בוחנים הושלמו', icon: <EmojiEventsRoundedIcon />, tone: 'primary' as const },
];

type Status = 'done' | 'partial' | 'notStarted';
type Kind = 'תרגול' | 'בוחן';
type Item = { title: string; kind: Kind; when: string; status: Status; score?: number; topic: string; unit: string; subTopic: string };

// Newest first (top) → oldest last (bottom). Placeholder data.
const ITEMS: Item[] = [
  { title: 'בוחן באלגברה', kind: 'בוחן', when: 'היום', status: 'done', score: 88, topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'משוואות ריבועיות' },
  { title: 'תרגול גיאומטריה אנליטית', kind: 'תרגול', when: 'היום', status: 'partial', topic: 'גיאומטריה אנליטית', unit: '5 יח"ל', subTopic: 'הישר והמעגל' },
  { title: 'בוחן בטריגונומטריה', kind: 'בוחן', when: 'אתמול', status: 'notStarted', topic: 'טריגונומטריה', unit: '4 יח"ל', subTopic: 'זהויות טריגונומטריות' },
  { title: 'תרגול חקירת פונקציות', kind: 'תרגול', when: 'לפני יומיים', status: 'done', topic: 'חקירת פונקציות', unit: '5 יח"ל', subTopic: 'נגזרות' },
  { title: 'בוחן בסדרות', kind: 'בוחן', when: 'לפני 4 ימים', status: 'done', score: 91, topic: 'סדרות', unit: '5 יח"ל', subTopic: 'סדרה חשבונית' },
  { title: 'תרגול הסתברות', kind: 'תרגול', when: 'בשבוע שעבר', status: 'partial', topic: 'הסתברות', unit: '4 יח"ל', subTopic: 'הסתברות מותנית' },
  { title: 'בוחן באלגברה', kind: 'בוחן', when: 'בשבוע שעבר', status: 'done', score: 73, topic: 'אלגברה', unit: '5 יח"ל', subTopic: 'פונקציות' },
];

const uniq = (arr: string[]) => Array.from(new Set(arr));
const TOPICS = uniq(ITEMS.map((i) => i.topic));
const UNITS = uniq(ITEMS.map((i) => i.unit));
const SUBTOPICS = uniq(ITEMS.map((i) => i.subTopic));

const TONE: Record<Status, { c: string; label: string }> = {
  done: { c: green[500], label: 'בוצע' },
  partial: { c: amber[600], label: 'חלקי' },
  notStarted: { c: grey[400], label: 'טרם התחלתי' },
};

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
  const [unit, setUnit] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [kind, setKind] = useState<'all' | Kind>('all');

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
                    <Box sx={{ color: `${s.tone}.main`, display: 'flex', alignItems: 'center', '& svg': { fontSize: '1.2rem' } }}>
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
                          <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: i < Number(s.value) ? `${s.tone}.main` : 'grey.300' }} />
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
            <TextField select size="small" label="יחידה" value={unit} onChange={(e) => setUnit(e.target.value)} sx={{ flex: '0 1 96px', minWidth: 86 }}>
              <MenuItem value="">הכל</MenuItem>
              {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
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

      {/* grid of compact cards, styled like the exercise cards on the second screen */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
        {items.map((it, i) => {
          const tone = TONE[it.status];
          return (
            <ButtonBase
              key={i}
              onClick={() => nav.go('practice')}
              sx={{ display: 'block', textAlign: 'start', borderRadius: 2.5, p: 1.75, border: 1, borderColor: 'divider', bgcolor: 'background.paper', transition: (t) => t.transitions.create(['box-shadow', 'border-color']), '&:hover': { boxShadow: 3, borderColor: 'primary.main' }, '@media (prefers-reduced-motion: reduce)': { transition: 'none' } }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.3, flex: 1, minWidth: 0 }} noWrap>{it.title}</Typography>
                {it.score != null ? (
                  <Box sx={{ flexShrink: 0, width: 42, borderRadius: 1.5, bgcolor: alpha(tone.c, 0.16), py: 0.25, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.05rem', lineHeight: 1, color: tone.c }}>{it.score}</Typography>
                    <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: 'text.secondary' }}>ציון</Typography>
                  </Box>
                ) : (
                  <Box sx={{ flexShrink: 0, px: 0.75, py: 0.25, borderRadius: 1.5, bgcolor: alpha(tone.c, 0.16), color: tone.c, fontSize: '0.7rem', fontWeight: 800, whiteSpace: 'nowrap' }}>{tone.label}</Box>
                )}
              </Stack>
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ mt: 1, rowGap: 0.5 }}>
                <Box sx={{ px: 0.75, py: 0.15, borderRadius: 1, bgcolor: (t) => alpha(t.palette.primary.main, 0.1), color: 'primary.dark', fontSize: '0.72rem', fontWeight: 700 }}>{it.kind}</Box>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>{it.topic} · {it.unit}</Typography>
              </Stack>
              <Typography sx={{ color: 'text.disabled', fontSize: '0.72rem', fontWeight: 600, mt: 0.75 }}>{it.when}</Typography>
            </ButtonBase>
          );
        })}
      </Box>
      {items.length === 0 && (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 6, fontWeight: 600 }}>
          לא נמצאו תוצאות
        </Typography>
      )}
    </Shell>
  );
}
