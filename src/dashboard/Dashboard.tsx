import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNav } from '../nav';
import { Logo } from '../components/Logo';

const nav = [
  { label: 'מסך ראשי', short: 'מסך ראשי', icon: <HomeTwoToneIcon /> },
  { label: 'תרגולים ומבחנים מהמורה', short: 'תרגולים', icon: <MenuBookTwoToneIcon /> },
  { label: 'היסטוריה', short: 'היסטוריה', icon: <HistoryTwoToneIcon /> },
];

const stats = [
  { label: 'רצף תרגול', value: '1', sub: 'ימים רצופים', icon: <LocalFireDepartmentRoundedIcon />, tone: 'warning' as const },
  { label: 'תרגילים השבוע', value: '0', sub: 'משימות שהושלמו', icon: <TaskAltRoundedIcon />, tone: 'success' as const },
  { label: 'ציון ממוצע', value: '—', sub: 'אין עדיין ציונים', icon: <EmojiEventsRoundedIcon />, tone: 'primary' as const },
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
  if (v === null) return alpha(t.palette.text.disabled, 0.12);
  if (v >= 80) return alpha(t.palette.success.main, 0.7);
  if (v >= 55) return alpha(t.palette.warning.main, 0.6);
  return alpha(t.palette.error.main, 0.55);
}
function masteryTextColor(t: Theme, v: number | null): string {
  if (v === null) return t.palette.text.disabled;
  if (v >= 80) return t.palette.success.dark;
  if (v >= 55) return t.palette.warning.dark;
  return t.palette.error.dark;
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
                    <ListItemIcon sx={{ minWidth: 0, me: 2 }}>{item.icon}</ListItemIcon>
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

              <Divider sx={{ mb: 2 }} />
              <ListItemButton
                onClick={() => navTo.go('login')}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08), color: 'error.main',
                    '& .MuiListItemIcon-root': { color: 'error.main' } },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, me: 2, color: 'inherit' }}>
                  <LogoutTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary="התנתקות" primaryTypographyProps={{ fontWeight: 600, textAlign: 'start' }} />
              </ListItemButton>
            </Paper>
          </Grid>

        {/* Main */}
        <Grid item xs={12} md={9} lg={9} sx={{ p: { xs: 2.5, md: 4 }, display: 'flex', flexDirection: 'column' }}>
          {/* Mobile top bar: logo + logout (sidebar is hidden on mobile) */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ display: { xs: 'flex', md: 'none' }, mb: 2 }}>
            <Logo variant="dark" size="small" />
            <IconButton onClick={() => navTo.go('login')} aria-label="התנתקות">
              <LogoutTwoToneIcon />
            </IconButton>
          </Stack>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box sx={{ textAlign: 'start' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                שלום, מארק! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                בואו נמשיך להתקדם היום
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="התראות">
                <IconButton aria-label="התראות">
                  <Badge color="error" variant="dot">
                    <NotificationsRoundedIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Two feature cards */}
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{ height: '100%', borderColor: (t) => alpha(t.palette.primary.main, 0.25), bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar variant="rounded" sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: 'primary.main' }}>
                      <BarChartRoundedIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      היסטוריה
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ textAlign: 'start', mb: 2 }}>
                    צפו בכל המבחנים והתרגולים שלכם, עם פידבק מפורט לכל שאלה.
                  </Typography>
                  <Link href="#" underline="hover" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    לחץ לצפייה
                    <ArrowForwardRoundedIcon fontSize="small" className="dir-icon" />
                  </Link>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{ height: '100%', borderColor: (t) => alpha(t.palette.info.main, 0.25), bgcolor: (t) => alpha(t.palette.info.main, 0.06) }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar variant="rounded" sx={{ bgcolor: (t) => alpha(t.palette.info.main, 0.15), color: 'info.main' }}>
                        <LightbulbRoundedIcon />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        תובנת AI שלך
                      </Typography>
                    </Stack>
                    <Tooltip title="רענון">
                      <IconButton size="small" aria-label="רענון תובנה">
                        <RefreshRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography color="text.secondary" sx={{ textAlign: 'start' }}>
                    אין הערכה על התלמיד ברגע זה. לאחר ביצוע התרגיל או המבחן הראשון תתבצע ההערכה.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Stat cards */}
          <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
            {stats.map((s) => (
              <Grid item xs={12} sm={4} key={s.label}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'start' }}>
                          {s.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1, textAlign: 'start' }}>
                          {s.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'start', display: 'block' }}>
                          {s.sub}
                        </Typography>
                      </Box>
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: (t) => alpha((s.tone === 'primary' ? t.palette.primary : t.palette[s.tone]).main, 0.15),
                          color: `${s.tone}.main`,
                        }}
                      >
                        {s.icon}
                      </Avatar>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Mastery heatmap */}
          <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'start' }}>
                  מפת השליטה בנושאים · מתמטיקה
                </Typography>
              </Stack>

              {/* Heatmap grid */}
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 320 }}>
                  {/* Column headers */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '120px repeat(5, 1fr)', gap: 0.5, mb: 0.5 }}>
                    <Box />
                    {SKILL_COLS.map((col) => (
                      <Typography key={col} variant="caption" color="text.secondary"
                        sx={{ textAlign: 'center', fontWeight: 600, px: 0.5 }}>
                        {col}
                      </Typography>
                    ))}
                  </Box>

                  {/* Rows */}
                  {heatmapData.map((row) => (
                    <Box key={row.topic}
                      sx={{ display: 'grid', gridTemplateColumns: '120px repeat(5, 1fr)', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, pe: 1, textAlign: 'start' }}>
                        {row.topic}
                      </Typography>
                      {row.values.map((v, ci) => (
                        <Box key={ci} sx={{
                          height: 40,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: (t) => masteryColor(t, v),
                          border: (t) => `1px solid ${alpha(v === null ? t.palette.divider : masteryTextColor(t, v), 0.2)}`,
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          color: (t) => masteryTextColor(t, v),
                          transition: 'transform 0.15s',
                          cursor: v !== null ? 'pointer' : 'default',
                          '&:hover': v !== null ? { transform: 'scale(1.06)' } : {},
                        }}>
                          {v !== null ? `${v}%` : ''}
                        </Box>
                      ))}
                    </Box>
                  ))}

                  {/* Legend */}
                  <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ mt: 1.5 }}>
                    {[
                      { label: 'שליטה גבוהה', color: 'success' as const },
                      { label: 'בתהליך', color: 'warning' as const },
                      { label: 'דורש חזרה', color: 'error' as const },
                    ].map((l) => (
                      <Stack key={l.label} direction="row" spacing={0.5} alignItems="center">
                        <Box sx={{ width: 12, height: 12, borderRadius: 0.5,
                          bgcolor: (t) => alpha(t.palette[l.color].main, 0.65) }} />
                        <Typography variant="caption" color="text.secondary">{l.label}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
          {/* Spacer so content clears the fixed mobile bottom nav */}
          <Box sx={{ height: { xs: 72, md: 0 }, flexShrink: 0 }} />
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
