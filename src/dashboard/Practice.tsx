import { useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { KindIcon, type Kind } from './KindIcon';
import { Shell } from './Shell';
import { TaskDetail } from './TaskDetail';

// expired = deadline passed with questions left; still practiceable, no longer graded.
type Status = 'new' | 'inProgress' | 'expired' | 'done';
// grade = the teacher's mark on a graded, done בוחן (תרגול is never scored).
// to = deadline; null means the teacher set no deadline (open-ended practice).
type Task = { id: number; title: string; kind: Kind; topic: string; subTopic: string; unit: string; total: number; solved: number; status: Status; from: string; to: string | null; grade?: number };

// Most-urgent first. Placeholder data (mirrors the teacher-sent tasks).
const TASKS: Task[] = [
  { id: 448, title: 'חקירת פונקציה — מנה עם שורש', kind: 'תרגול', topic: 'חקירת פונקציות', subTopic: 'נגזרות', unit: '5 יח"ל', total: 5, solved: 2, status: 'inProgress', from: '10 ביוני 2026', to: '29 ביוני 2026' },
  { id: 449, title: 'בוחן באלגברה', kind: 'בוחן', topic: 'אלגברה', subTopic: 'משוואות ריבועיות', unit: '5 יח"ל', total: 8, solved: 0, status: 'new', from: '12 ביוני 2026', to: '30 ביוני 2026' },
  { id: 458, title: 'תרגול חופשי — שברים אלגבריים', kind: 'תרגול', topic: 'אלגברה', subTopic: 'שברים אלגבריים', unit: '5 יח"ל', total: 6, solved: 0, status: 'new', from: '14 ביוני 2026', to: null },
  { id: 450, title: 'תרגול טריגונומטריה', kind: 'תרגול', topic: 'טריגונומטריה', subTopic: 'זהויות טריגונומטריות', unit: '4 יח"ל', total: 6, solved: 0, status: 'new', from: '11 ביוני 2026', to: '28 ביוני 2026' },
  { id: 459, title: 'בוחן בהסתברות', kind: 'בוחן', topic: 'הסתברות', subTopic: 'עץ הסתברות', unit: '5 יח"ל', total: 5, solved: 2, status: 'expired', from: '1 ביוני 2026', to: '18 ביוני 2026' },
  { id: 454, title: 'תרגול נגזרות', kind: 'תרגול', topic: 'חשבון דיפרנציאלי', subTopic: 'כללי גזירה', unit: '5 יח"ל', total: 7, solved: 3, status: 'inProgress', from: '9 ביוני 2026', to: '27 ביוני 2026' },
  { id: 456, title: 'תרגול וקטורים במרחב', kind: 'תרגול', topic: 'וקטורים', subTopic: 'מכפלה סקלרית', unit: '5 יח"ל', total: 4, solved: 0, status: 'new', from: '13 ביוני 2026', to: '1 ביולי 2026' },
  { id: 451, title: 'תרגול הסתברות', kind: 'תרגול', topic: 'הסתברות', subTopic: 'הסתברות מותנית', unit: '4 יח"ל', total: 4, solved: 4, status: 'done', from: '2 ביוני 2026', to: '20 ביוני 2026' },
  { id: 452, title: 'בוחן בסדרות', kind: 'בוחן', topic: 'סדרות', subTopic: 'סדרה חשבונית', unit: '5 יח"ל', total: 5, solved: 5, status: 'done', from: '28 במאי 2026', to: '15 ביוני 2026', grade: 91 },
  { id: 453, title: 'בוחן בגיאומטריה אנליטית', kind: 'בוחן', topic: 'גיאומטריה אנליטית', subTopic: 'הישר והמעגל', unit: '5 יח"ל', total: 6, solved: 6, status: 'done', from: '24 במאי 2026', to: '10 ביוני 2026', grade: 88 },
  { id: 455, title: 'בוחן בטריגונומטריה', kind: 'בוחן', topic: 'טריגונומטריה', subTopic: 'משוואות טריגונומטריות', unit: '4 יח"ל', total: 5, solved: 5, status: 'done', from: '20 במאי 2026', to: '5 ביוני 2026', grade: 76 },
  { id: 457, title: 'בוחן בחקירת פונקציות', kind: 'בוחן', topic: 'חקירת פונקציות', subTopic: 'אסימפטוטות', unit: '5 יח"ל', total: 8, solved: 8, status: 'done', from: '15 במאי 2026', to: '2 ביוני 2026', grade: 94 },
];

// new & inProgress on top, done sinks to the bottom.
const RANK: Record<Status, number> = { inProgress: 0, new: 1, expired: 2, done: 3 };

// Canonical MUI palette roles per kind / status.
const KIND: Record<Kind, 'primary'> = { תרגול: 'primary', בוחן: 'primary' };
// One shared style for all the small meta text in a card (date, topic, count).
const META = { fontSize: '0.8rem', fontWeight: 400, color: 'text.secondary' } as const;

function TaskCard({ t, onOpen }: { t: Task; onOpen: () => void }) {
  const kind = KIND[t.kind];
  const pct = t.total ? Math.round((t.solved / t.total) * 100) : 0;
  const cta =
    t.status === 'done' ? 'צפה בסיכום'
    : t.status === 'expired' ? 'תרגול ללא ציון'
    : t.status === 'inProgress' ? 'המשך תרגול'
    : 'בוא נתרגל!';
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        // done tasks recede: green-tinted + dimmed, restored on hover
        ...(t.status === 'done' && { bgcolor: green[50], opacity: 0.68 }),
        transition: (th) => th.transitions.create(['box-shadow', 'border-color', 'opacity']),
        '&:hover': { boxShadow: 4, borderColor: `${kind}.main`, ...(t.status === 'done' && { opacity: 1 }) },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <CardHeader
        avatar={
          // icon always stays; the grade lives on the count line below, never replaces the icon
          t.status === 'done' ? (
            <Avatar variant="rounded" sx={{ bgcolor: alpha(green[600], 0.14), color: green[700], width: 36, height: 36, '& svg': { fontSize: 20 } }}>
              <CheckRoundedIcon />
            </Avatar>
          ) : (
            <KindIcon kind={t.kind} />
          )
        }
        action={
          // no deadline = open-ended; say so plainly instead of leaving a gap
          <Typography sx={{ ...META, display: 'block', mt: 1.25, mr: 1, whiteSpace: 'nowrap', ...(t.to === null && { color: 'text.disabled' }), ...(t.status === 'expired' && { color: 'error.dark', fontWeight: 700 }) }}>
            {t.status === 'expired' ? `הסתיים ב-${t.to}` : t.to ? `עד ${t.to}` : 'ללא תאריך יעד'}
          </Typography>
        }
        title={
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{t.title}</Typography>
            {/* only NEW gets the notification dot; in-progress reads from the bar below */}
            {t.status === 'new' && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'info.dark' }}>חדש</Typography>
              </Stack>
            )}
            {/* expired reads as a state, not an alarm: same dot pattern, error color */}
            {t.status === 'expired' && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'error.dark' }}>פג תוקף</Typography>
              </Stack>
            )}
            {/* teacher grade rides next to the title, not on top of the icon */}
            {t.status === 'done' && t.grade != null && (
              <Box sx={{ px: 1, py: 0.375, borderRadius: 1.5, bgcolor: alpha(green[600], 0.14), display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <Typography component="span" sx={{ fontSize: '0.65rem', fontWeight: 700, color: green[800], letterSpacing: '0.02em' }}>ציון</Typography>
                <Typography component="span" sx={{ fontSize: '0.9rem', fontWeight: 800, lineHeight: 1, color: green[900], fontFeatureSettings: '"tnum","lnum"', letterSpacing: '-0.01em' }}>{t.grade}</Typography>
              </Box>
            )}
          </Stack>
        }
        subheader={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
            <Typography sx={META}>{t.topic} · {t.subTopic}</Typography>
          </Stack>
        }
      />

      <CardContent sx={{ pt: 0 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: (th) => alpha(th.palette.text.primary, 0.1), '& .MuiLinearProgress-bar': { bgcolor: 'grey.600' }, ...(t.status === 'done' && { bgcolor: alpha(green[500], 0.2), '& .MuiLinearProgress-bar': { bgcolor: green[600] } }), ...(t.status === 'expired' && { '& .MuiLinearProgress-bar': { bgcolor: 'grey.400' } }) }}
          />
          <Typography sx={{ ...META, whiteSpace: 'nowrap' }}>
            {t.solved}/{t.total} שאלות
          </Typography>
        </Stack>
        {/* say what expiring actually cost the student, and what's still open */}
        {t.status === 'expired' && (
          <Typography sx={{ ...META, mt: 1 }}>
            המועד להגשה חלף, אז הבוחן הזה כבר לא נספר לציון. אפשר עדיין לפתור אותו לתרגול.
          </Typography>
        )}
      </CardContent>

      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1.5 }}>
        <Button
          onClick={onOpen}
          variant={t.status === 'done' || t.status === 'expired' ? 'outlined' : 'contained'}
          color={t.status === 'done' ? 'inherit' : kind}
          endIcon={t.status === 'done' ? undefined : <PlayArrowRoundedIcon className="dir-icon" />}
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          {cta}
        </Button>
      </CardActions>
    </Card>
  );
}

export function Practice() {
  const [kind, setKind] = useState<'all' | Kind>('all');
  const [openId, setOpenId] = useState<number | null>(null);

  const tasks = useMemo(
    () =>
      TASKS
        .filter((t) => kind === 'all' || t.kind === kind)
        .slice()
        .sort((a, b) => RANK[a.status] - RANK[b.status]),
    [kind]
  );

  const openTask = TASKS.find((t) => t.id === openId);
  if (openTask) {
    return <TaskDetail task={{ id: openTask.id, title: openTask.title, total: openTask.total, from: openTask.from, to: openTask.to }} onBack={() => setOpenId(null)} />;
  }

  return (
    <Shell active="practice" title="תרגילים ובחנים">
      {/* filter: all / תרגול / בוחן */}
      <ToggleButtonGroup
        size="small"
        exclusive
        value={kind}
        color="primary"
        onChange={(_, v) => v && setKind(v)}
        sx={{ '& .MuiToggleButton-root': { px: 2, fontWeight: 700, textTransform: 'none' } }}
      >
        <ToggleButton value="all">הכל</ToggleButton>
        <ToggleButton value="תרגול">תרגול</ToggleButton>
        <ToggleButton value="בוחן">בוחן</ToggleButton>
      </ToggleButtonGroup>

      {/* task list */}
      <Stack spacing={2}>
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
