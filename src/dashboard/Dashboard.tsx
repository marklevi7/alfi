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
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useNav } from '../nav';
import { Logo } from '../components/Logo';

const nav = [
  { label: 'מסך ראשי', icon: <SchoolRoundedIcon /> },
  { label: 'תרגולים ומבחנים מהמורה', icon: <AssignmentRoundedIcon /> },
  { label: 'הציונים שלי', icon: <DescriptionRoundedIcon /> },
];

const stats = [
  { label: 'רצף תרגול', value: '1', sub: 'ימים רצופים', icon: <LocalFireDepartmentRoundedIcon />, tone: 'warning' as const },
  { label: 'תרגילים השבוע', value: '0', sub: 'משימות שהושלמו', icon: <TaskAltRoundedIcon />, tone: 'success' as const },
  { label: 'ציון ממוצע', value: '—', sub: 'אין עדיין ציונים', icon: <EmojiEventsRoundedIcon />, tone: 'primary' as const },
];

type Tone = 'success' | 'warning' | 'error' | 'disabled';
const topics: { name: string; tone: Tone }[] = [
  { name: 'חקירת פונקציות', tone: 'warning' },
  { name: 'אלגברה', tone: 'success' },
  { name: 'גיאומטריה אנליטית', tone: 'error' },
  { name: 'טריגונומטריה', tone: 'disabled' },
  { name: 'הסתברות', tone: 'disabled' },
  { name: 'סדרות', tone: 'success' },
];

const toneColor = (t: Theme, tone: Tone) =>
  tone === 'disabled' ? t.palette.text.disabled : t.palette[tone].main;

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
          <Grid item xs={12} md={3} lg={3}>
            <Paper
              square
              elevation={0}
              sx={{
                height: '100%',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                borderInlineStart: (t) => `1px solid ${t.palette.divider}`,
              }}
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
                    mb: 0.5,
                    '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                    '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                    '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  }}
                >
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, textAlign: 'start' }} />
                  <ListItemIcon sx={{ minWidth: 0, ms: 1 }}>{item.icon}</ListItemIcon>
                </ListItemButton>
              ))}
            </List>

            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={() => navTo.go('login')} sx={{ borderRadius: 2 }}>
              <ListItemText primary="התנתקות" primaryTypographyProps={{ fontWeight: 600, textAlign: 'start' }} />
              <ListItemIcon sx={{ minWidth: 0 }}>
                <LogoutRoundedIcon />
              </ListItemIcon>
            </ListItemButton>
          </Paper>
        </Grid>

        {/* Main */}
        <Grid item xs={12} md={9} lg={9} sx={{ p: { xs: 2.5, md: 4 } }}>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box sx={{ textAlign: 'start' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                שלום, student! 👋
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
              <Chip
                icon={<LocalFireDepartmentRoundedIcon />}
                label="1 ימים רצוף"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
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
                      הציונים שלי
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
                  <Box sx={{ borderInlineStart: (t) => `4px solid ${alpha(t.palette.info.main, 0.5)}`, ps: 2, pe: 0 }}>
                    <Typography color="text.secondary" sx={{ textAlign: 'start' }}>
                      אין הערכה על התלמיד ברגע זה. לאחר ביצוע התרגיל או המבחן הראשון תתבצע ההערכה.
                    </Typography>
                  </Box>
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
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: (t) => alpha((s.tone === 'primary' ? t.palette.primary : t.palette[s.tone]).main, 0.15),
                          color: `${s.tone}.main`,
                        }}
                      >
                        {s.icon}
                      </Avatar>
                      <Box sx={{ textAlign: 'end' }}>
                        <Typography variant="body2" color="text.secondary">
                          {s.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                          {s.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.sub}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Mastery map */}
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Tooltip title="הסבר מבוסס AI">
                  <IconButton size="small" aria-label="הסבר מבוסס AI">
                    <AutoAwesomeIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
                <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'end' }}>
                  מפת השליטה בנושאים · מתמטיקה
                </Typography>
              </Stack>
              <Grid container spacing={1.5}>
                {topics.map((t) => (
                  <Grid item xs={6} sm={4} md={3} key={t.name}>
                    <Box
                      sx={{
                        p: 2,
                        minHeight: 96,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontWeight: 700,
                        color: (th) => toneColor(th, t.tone),
                        bgcolor: (th) => alpha(toneColor(th, t.tone), 0.14),
                        border: (th) => `1px solid ${alpha(toneColor(th, t.tone), 0.4)}`,
                      }}
                    >
                      {t.name}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
