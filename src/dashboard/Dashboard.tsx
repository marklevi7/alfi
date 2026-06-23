import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNav } from '../nav';
import { Logo } from '../components/Logo';

const nav = [
  { label: 'מסך ראשי', short: 'מסך ראשי', icon: <HomeTwoToneIcon /> },
  { label: 'תרגולים ובוחנים מהמורה', short: 'תרגולים', icon: <MenuBookTwoToneIcon /> },
  { label: 'היסטוריה', short: 'היסטוריה', icon: <HistoryTwoToneIcon /> },
];

const stats = [
  { label: 'רצף תרגול', value: '3', total: 5, sub: '3 מתוך 5 ימים', icon: <LocalFireDepartmentRoundedIcon />, tone: 'warning' as const },
  { label: 'תרגולים השבוע', value: '5', total: 12, sub: '5 מתוך 12 משימות', icon: <TaskAltRoundedIcon />, tone: 'success' as const },
  { label: 'בוחנים השבוע', value: '2', total: 0, sub: 'בוחנים הושלמו', icon: <EmojiEventsRoundedIcon />, tone: 'primary' as const },
];

// Heatmap data: rows = topics, cols = skill levels, value 0–100 (null = not started)
const SKILL_COLS = ['בסיסי', 'קל', 'בינוני', 'קשה', 'מאתגר'];
const heatmapData: { topic: string; values: (number | null)[] }[] = [
  { topic: 'חקירת פונקציות', values: [72, 65, 48, 30, null] },
  { topic: 'אלגברה',         values: [90, 85, 78, 60, 42] },
  { topic: 'גיאומטריה אנליטית', values: [55, 40, 22, null, null] },
  { topic: 'טריגונומטריה',   values: [null, null, null, null, null] },
  { topic: 'הסתברות',        values: [null, null, null, null, null] },
  { topic: 'סדרות',          values: [88, 80, 70, 55, null] },
];

function masteryColor(t: Theme, v: number | null): string {
  if (v === null) return alpha(t.palette.text.disabled, 0.08);
  if (v >= 80) return alpha(t.palette.success.main, 0.88);
  if (v >= 55) return alpha(t.palette.warning.main, 0.82);
  return alpha(t.palette.error.main, 0.82);
}

function rowAvg(values: (number | null)[]): number | null {
  const nonNull = values.filter((v): v is number => v !== null);
  return nonNull.length ? Math.round(nonNull.reduce((a, b) => a + b, 0) / nonNull.length) : null;
}

export function Dashboard() {
  const navTo = useNav();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
        display: 'flex',
        justifyContent: 'center',
        p: { xs: 0, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 1200,
          borderRadius: { xs: 0, md: 4 },
          overflow: 'hidden',
        }}
      >
        <Grid container sx={{ minHeight: { md: 'calc(100vh - 64px)' } }}>
          {/* Sidebar — first in RTL = right */}
          <Grid item md={3} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper
              square
              elevation={0}
              sx={(t) => ({
                height: '100%',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                borderInlineStart: `1px solid ${t.palette.divider}`,
              })}
            >
              <Box sx={{ mb: 4 }}>
                <Logo variant="dark" />
              </Box>

              <List sx={{ flex: 1 }}>
                {nav.map((item, idx) => (
                  <ListItemButton
                    key={item.label}
                    selected={idx === 0}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      py: 1.25,
                      '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                      '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                      '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, me: 7 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        textAlign: 'start',
                        sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>

              <Divider sx={{ mb: 1 }} />
              <ListItemButton
                onClick={() => navTo.go('login')}
                sx={{
                  borderRadius: 2,
                  py: 0.75,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08), color: 'error.main',
                    '& .MuiListItemIcon-root': { color: 'error.main' } },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, me: 3, color: 'inherit' }}>
                  <LogoutTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="התנתקות" primaryTypographyProps={{ fontWeight: 600, textAlign: 'start', variant: 'body2' }} />
              </ListItemButton>
            </Paper>
          </Grid>

        {/* Main */}
        <Grid item xs={12} md={9} lg={9} sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Mobile top bar */}
          <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{ display: { xs: 'flex', md: 'none' }, px: 2.5, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Logo variant="dark" size="small" />
            <IconButton onClick={() => navTo.go('login')} aria-label="התנתקות">
              <LogoutTwoToneIcon />
            </IconButton>
          </Stack>

          {/* Header strip */}
          <Box sx={{
            px: { xs: 2.5, md: 4 }, py: { xs: 2, md: 3 },
            borderBottom: 1, borderColor: 'divider',
          }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" component="h1"
                  sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, textWrap: 'balance' }}>
                  שלום, מארק! 👋
                </Typography>
              </Box>
              <Tooltip title="התראות">
                <IconButton aria-label="התראות">
                  <Badge color="error" variant="dot">
                    <NotificationsRoundedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Scrollable content */}
          <Box sx={{ p: { xs: 2.5, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Feature cards — asymmetric 3:2 */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 2, alignItems: 'stretch' }}>

              {/* Next task CTA — first in DOM = rightmost in RTL */}
              <Card variant="outlined" sx={{
                borderColor: (t) => alpha(t.palette.primary.main, 0.25),
                bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                    <Avatar variant="rounded" sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: 'primary.main' }}>
                      <PlayCircleRoundedIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>המשימה הבאה שלך</Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ textAlign: 'start', mb: 2.5, flex: 1, textWrap: 'pretty' }}>
                    יש לך 8 משימות חדשות מהמורה. בוא נתחיל עם האלגברה!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardRoundedIcon className="dir-icon" />}
                    sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                  >
                    בוא נתרגל!
                  </Button>
                </CardContent>
              </Card>

              {/* Math average card — second in DOM = leftmost in RTL */}
              <Card variant="outlined" sx={{
                borderColor: (t) => alpha(t.palette.success.main, 0.25),
                bgcolor: (t) => alpha(t.palette.success.main, 0.04),
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar variant="rounded" sx={{ bgcolor: (t) => alpha(t.palette.success.main, 0.15), color: 'success.dark' }}>
                      <TrendingUpRoundedIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>הציון שלי במתמטיקה</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1, color: 'success.dark' }}>
                      78
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      מתוך 100
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </Card>
            </Box>

            {/* Stats — ONE card, 3 columns with vertical dividers */}
            <Card variant="outlined">
              <CardContent sx={{ py: 2.5, px: 0, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
                  {stats.map((s) => {
                    const pal = (t: Theme) => s.tone === 'primary' ? t.palette.primary : t.palette[s.tone as 'warning' | 'success'];
                    return (
                      <Box key={s.label} sx={{ flex: 1, textAlign: 'center', px: 2 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 0.75 }}>
                          <Box sx={{
                            color: `${s.tone}.main`,
                            display: 'flex', alignItems: 'center',
                            '& svg': { fontSize: '1.1rem' },
                            ...(s.tone === 'warning' && {
                              '@keyframes flamePulse': {
                                '0%, 100%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.2)' },
                              },
                              animation: 'flamePulse 1.8s ease-in-out infinite',
                              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                            }),
                          }}>
                            {s.icon}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                            {s.label}
                          </Typography>
                        </Stack>
                        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, color: (t) => pal(t).dark, mb: 0.25 }}>
                          {s.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
                        {s.tone === 'warning' && s.total > 0 && (
                          <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 1 }}>
                            {Array.from({ length: s.total }).map((_, i) => (
                              <Box key={i} sx={{
                                width: 10, height: 10, borderRadius: '50%',
                                bgcolor: i < Number(s.value)
                                  ? 'warning.main'
                                  : (t) => alpha(t.palette.warning.main, 0.15),
                              }} />
                            ))}
                          </Stack>
                        )}
                        {s.tone === 'success' && s.total > 0 && (
                          <Box sx={{ mt: 1.5, px: 0.5 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(Number(s.value) / s.total) * 100}
                              color="success"
                              sx={{ height: 8, borderRadius: 4, mb: 0.75 }}
                            />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>0</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'success.dark' }}>
                                {s.value}/{s.total} ⭐
                              </Typography>
                              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>{s.total}</Typography>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>

          {/* Mastery heatmap */}
          <Card variant="outlined" sx={{ flex: 1 }}>
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
                    <Box sx={{ width: 10, height: 10, borderRadius: 0.5,
                      bgcolor: (t) => alpha(t.palette[l.color].main, 0.85) }} />
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
                    {SKILL_COLS.map((col, i) => (
                      <Typography key={col} variant="caption" sx={{
                        textAlign: 'center', fontWeight: 700, fontSize: '0.65rem',
                        color: (t) => ([
                          t.palette.success.dark,
                          t.palette.success.main,
                          t.palette.warning.dark,
                          t.palette.error.main,
                          t.palette.error.dark,
                        ] as string[])[i],
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
            {/* Spacer so content clears the fixed mobile bottom nav */}
            <Box sx={{ height: { xs: 72, md: 0 }, flexShrink: 0 }} />
          </Box>{/* end scrollable content */}
        </Grid>
        </Grid>
      </Paper>

      {/* Mobile bottom navigation */}
      <Paper
        elevation={3}
        sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', insetInline: '8px', bottom: '8px', zIndex: (t) => t.zIndex.appBar, borderRadius: 3 }}
      >
        <BottomNavigation showLabels value={0} sx={{
          borderRadius: 3,
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 3,
            mx: 0.5,
            '& .MuiSvgIcon-root': { color: 'primary.contrastText' },
          },
        }}>
          {nav.map((item) => (
            <BottomNavigationAction key={item.label} label={item.short} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
