import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { Shell } from './Shell';

const stats = [
  { label: 'רצף תרגול', value: '4', total: 5, sub: '4 מתוך 5 ימים', icon: <LocalFireDepartmentRoundedIcon />, tone: 'primary' as const },
  { label: 'תרגולים השבוע', value: '5', total: 12, sub: '5 מתוך 12 תרגולים', icon: <TaskAltRoundedIcon />, tone: 'warning' as const },
  { label: 'בוחנים השבוע', value: '2', total: 0, sub: 'בוחנים הושלמו', icon: <EmojiEventsRoundedIcon />, tone: 'primary' as const },
];

// Heatmap data: rows = topics, cols = skill levels, value 0–100 (null = not started)
const SKILL_COLS = ['קל מאוד', 'קל', 'בינוני', 'קשה', 'קשה מאוד'];
const heatmapData: { topic: string; values: (number | null)[] }[] = [
  { topic: 'אלגברה',            values: [90, 85, 78, 60, 42] },
  { topic: 'גיאומטריה אנליטית', values: [55, 40, 22, null, null] },
  { topic: 'הסתברות',           values: [null, null, null, null, null] },
  { topic: 'חקירת פונקציות',    values: [72, 65, 48, 30, null] },
  { topic: 'טריגונומטריה',      values: [null, null, null, null, null] },
  { topic: 'סדרות',             values: [88, 80, 70, 55, null] },
];

function masteryColor(t: Theme, v: number | null): string {
  if (v === null) return alpha(t.palette.text.disabled, 0.08);
  if (v >= 80) return alpha(t.palette.success.light, 0.9);
  if (v >= 55) return alpha(t.palette.warning.light, 0.9);
  return alpha(t.palette.error.light, 0.9);
}

function rowAvg(values: (number | null)[]): number | null {
  const nonNull = values.filter((v): v is number => v !== null);
  return nonNull.length ? Math.round(nonNull.reduce((a, b) => a + b, 0) / nonNull.length) : null;
}

export function Analytics() {
  return (
    <Shell active="history" title="היסטוריה">
      {/* Stats — ONE card, 3 columns with vertical dividers */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ py: 2.5, px: 0, '&:last-child': { pb: 2.5 } }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            {stats.map((s) => (
              <Box key={s.label} sx={{ flex: 1, textAlign: 'center', px: 2 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 0.75 }}>
                  <Box sx={{ color: `${s.tone}.main`, display: 'flex', alignItems: 'center', '& svg': { fontSize: '1.1rem' } }}>
                    {s.icon}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {s.label}
                  </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, color: 'text.primary', mb: 0.25 }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
                {s.total > 0 && (
                  <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 1 }}>
                    {Array.from({ length: s.total }).map((_, i) => (
                      <Box key={i} sx={{
                        width: 10, height: 10, borderRadius: '50%',
                        bgcolor: i < Number(s.value) ? `${s.tone}.main` : 'grey.300',
                      }} />
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Mastery heatmap */}
      <Card variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between"
          flexWrap="wrap" gap={1.5} sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>מפת שליטה · מתמטיקה</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {([
              { label: 'שליטה גבוהה', color: 'success' as const },
              { label: 'בתהליך', color: 'warning' as const },
              { label: 'דורש חזרה', color: 'error' as const },
            ] as const).map((l) => (
              <Stack key={l.label} direction="row" spacing={0.75} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: (t) => alpha(t.palette[l.color].main, 0.85) }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{l.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 360 }}>
              {/* Column headers */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: (t) => `${t.spacing(18)} repeat(5, 1fr)`,
                gap: 0.75, mb: 1, alignItems: 'flex-end',
              }}>
                <Box />
                {SKILL_COLS.map((col) => (
                  <Typography key={col} variant="caption" sx={{
                    textAlign: 'center', fontWeight: 600, fontSize: '0.65rem', color: 'text.secondary',
                  }}>
                    {col}
                  </Typography>
                ))}
              </Box>

              {/* Rows */}
              {heatmapData.map((row) => {
                const avg = rowAvg(row.values);
                const hasData = row.values.some(v => v !== null);
                return (
                  <Box key={row.topic} sx={{
                    display: 'grid',
                    gridTemplateColumns: (t) => `${t.spacing(18)} repeat(5, 1fr)`,
                    gap: 0.75, mb: 0.75, alignItems: 'center',
                  }}>
                    {/* Topic label */}
                    <Typography variant="caption" sx={{
                      fontWeight: 700, pe: 1, textAlign: 'start',
                      color: avg === null ? 'text.disabled' : 'text.primary',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {row.topic}
                    </Typography>

                    {/* Cells — color only, no numbers */}
                    {hasData ? row.values.map((v, ci) => (
                      <Box key={ci} sx={{
                        height: 44, borderRadius: 1.5,
                        bgcolor: (t) => masteryColor(t, v),
                        transition: 'transform 0.15s ease-out',
                        cursor: v !== null ? 'pointer' : 'default',
                        '&:hover': v !== null ? { transform: 'scale(1.07)' } : {},
                      }} />
                    )) : (
                      <Box sx={{
                        gridColumn: 'span 5', height: 44, borderRadius: 1.5,
                        border: 1, borderStyle: 'dashed', borderColor: 'divider',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                          טרם לומד
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Shell>
  );
}
