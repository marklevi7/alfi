import { alpha, keyframes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Shell } from './Shell';

const ctaShimmer = keyframes`
  0%   { transform: translateX(200%); opacity: 0; }
  5%   { opacity: 1; }
  35%  { transform: translateX(-200%); opacity: 1; }
  36%  { opacity: 0; }
  100% { transform: translateX(-200%); opacity: 0; }
`;

const stats = [
  { label: 'רצף תרגול', value: '4', total: 5, sub: '4 מתוך 5 ימים', icon: <LocalFireDepartmentRoundedIcon />, tone: 'primary' as const },
  { label: 'תרגולים השבוע', value: '5', total: 12, sub: '5 מתוך 12 תרגילים', icon: <TaskAltRoundedIcon />, tone: 'warning' as const },
  { label: 'בוחנים השבוע', value: '2', total: 0, sub: 'בוחנים הושלמו', icon: <EmojiEventsRoundedIcon />, tone: 'primary' as const },
];

export function Dashboard() {
  return (
    <Shell active="dashboard" title="שלום, מארק! 👋" hideSidebarRobot>
      {/* Big ALFI face — fills the top, pushes the boxes to the bottom */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: { xs: 220, md: 320 } }}>
        <Box
          component="img"
          src="alfi-mirror.png"
          alt="אלפי"
          sx={{
            maxHeight: { xs: 320, md: 520 },
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: (t) => `drop-shadow(0 24px 32px ${alpha(t.palette.common.black, 0.28)})`,
          }}
        />
      </Box>

      {/* Feature cards — asymmetric 3:2 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr' }, gap: 2, alignItems: 'stretch' }}>

        {/* Next task CTA — first in DOM = rightmost in RTL */}
        <Card variant="outlined" sx={{ borderColor: 'divider', borderRadius: 2, boxShadow: (t) => t.shadows[3] }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Avatar variant="rounded" sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.15), color: 'primary.main' }}>
                <AssignmentTwoToneIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>התרגיל הבא שלך</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ textAlign: 'start', mb: 2.5, flex: 1, textWrap: 'pretty' }}>
              יש לך 8 תרגילים חדשים מהמורה. בוא נתחיל עם אלגברה!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardRoundedIcon className="dir-icon" />}
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 700,
                position: 'relative',
                overflow: 'hidden',
                transition: (t) => t.transitions.create(['transform', 'box-shadow'], {
                  duration: t.transitions.duration.short,
                  easing: t.transitions.easing.easeOut,
                }),
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(105deg, transparent 10%, rgba(255,255,255,0.92) 50%, transparent 90%)',
                  animation: `${ctaShimmer} 2s ease-in-out infinite`,
                  pointerEvents: 'none',
                },
                '&:hover': { transform: 'scale(1.05)', boxShadow: (t) => t.shadows[6] },
                '&:active': { transform: 'scale(0.97)', boxShadow: (t) => t.shadows[2] },
                '@media (prefers-reduced-motion: reduce)': { '&::after': { animation: 'none' } },
              }}
            >
              בוא נתרגל!
            </Button>
          </CardContent>
        </Card>

        {/* Math average card — second in DOM = leftmost in RTL */}
        <Card variant="outlined" sx={{
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: (t) => t.shadows[3],
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: (t) => `linear-gradient(105deg, transparent 10%, ${alpha(t.palette.primary.light, 0.22)} 50%, transparent 90%)`,
            animation: `${ctaShimmer} 2.6s ease-in-out infinite`,
            pointerEvents: 'none',
            zIndex: 1,
          },
          '@media (prefers-reduced-motion: reduce)': { '&::after': { animation: 'none' } },
        }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar variant="rounded" sx={{ bgcolor: (t) => alpha(t.palette.success.main, 0.12), color: 'success.dark', width: 36, height: 36 }}>
                <TrendingUpRoundedIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>ציון ממוצע</Typography>
            </Stack>
            <Box sx={{ mt: 1.5 }}>
              <Typography sx={{ fontWeight: 500, lineHeight: 1, color: 'text.primary', fontSize: '4.5rem', letterSpacing: '-0.02em' }}>
                78
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.5 }}>
                מתוך 100
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Stats — ONE card, 3 columns with vertical dividers */}
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: (t) => t.shadows[3] }}>
        <CardContent sx={{ py: 2.5, px: 0, '&:last-child': { pb: 2.5 } }}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
            {stats.map((s) => (
              <Box key={s.label} sx={{ flex: 1, textAlign: 'center', px: 2 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center" sx={{ mb: 0.75 }}>
                  <Box sx={{
                    color: `${s.tone}.main`,
                    display: 'flex', alignItems: 'center',
                    '& svg': { fontSize: '1.1rem' },
                    ...(s.label === 'רצף תרגול' && {
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
    </Shell>
  );
}
