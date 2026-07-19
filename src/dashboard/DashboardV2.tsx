import { alpha, keyframes, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { deepPurple, blue, cyan, teal, green, amber, orange, pink, red, common } from '@mui/material/colors';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Shell } from './Shell';
import faceImg from './assets/magnific_43LDWx09Aa.png';

const ctaShimmer = keyframes`
  0%   { transform: translateX(200%); opacity: 0; }
  5%   { opacity: 1; }
  35%  { transform: translateX(-200%); opacity: 1; }
  36%  { opacity: 0; }
  100% { transform: translateX(-200%); opacity: 0; }
`;

const floaty = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
`;

// Rainbow mesh-blob background (MUI palette colors only)
function BlobBackground() {
  const blobs = [
    { c: deepPurple[300], top: '-8%', left: '-6%', size: 320 },
    { c: blue[300], top: '4%', left: '52%', size: 260 },
    { c: cyan[300], top: '38%', left: '78%', size: 300 },
    { c: teal[300], top: '60%', left: '-4%', size: 280 },
    { c: green[300], top: '72%', left: '40%', size: 240 },
    { c: amber[300], top: '8%', left: '24%', size: 220 },
    { c: orange[300], top: '70%', left: '74%', size: 240 },
    { c: pink[300], top: '34%', left: '30%', size: 260 },
  ];
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {blobs.map((b, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            bgcolor: alpha(b.c, 0.5),
            filter: 'blur(38px)',
          }}
        />
      ))}
      {/* soft white wash so foreground stays readable */}
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: (t) => alpha(t.palette.background.paper, 0.28) }} />
    </Box>
  );
}

// Semicircle score gauge: red -> amber -> green, marker at value
function ScoreGauge({ value, max = 100 }: { value: number; max?: number }) {
  const cx = 100, cy = 100, r = 84;
  const deg = 180 - (value / max) * 180;
  const rad = (deg * Math.PI) / 180;
  const mx = cx + r * Math.cos(rad);
  const my = cy - r * Math.sin(rad);
  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 220, mx: 'auto' }}>
      <Box component="svg" viewBox="0 0 200 120" sx={{ width: '100%', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="alfiGauge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={red[400]} />
            <stop offset="50%" stopColor={amber[400]} />
            <stop offset="100%" stopColor={green[500]} />
          </linearGradient>
        </defs>
        <path d="M16,100 A84,84 0 0 1 184,100" fill="none" stroke={alpha(deepPurple[900], 0.08)} strokeWidth={18} strokeLinecap="round" />
        <path d="M16,100 A84,84 0 0 1 184,100" fill="none" stroke="url(#alfiGauge)" strokeWidth={18} strokeLinecap="round" />
        <circle cx={mx} cy={my} r={11} fill={common.white} stroke={deepPurple[500]} strokeWidth={5} />
      </Box>
      <Box sx={{ position: 'absolute', inset: 0, top: '34%', textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '3rem', lineHeight: 1, color: 'text.primary', letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>מתוך {max}</Typography>
      </Box>
    </Box>
  );
}

export function DashboardV2() {
  const theme = useTheme();
  return (
    <Shell active="dashboard" title="" hideSidebarRobot bgLayer={<BlobBackground />}>
      {/* Big ALFI face with speech bubble — sits behind the boxes below */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: { xs: 280, md: 420 }, mb: { xs: -9, md: -16 }, position: 'relative', zIndex: 0 }}>
        {/* ALFI speech bubble */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 40 },
            insetInlineStart: { xs: '6%', md: '16%' },
            zIndex: 2,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[6],
            borderRadius: 3,
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            '&::after': {
              content: '""', position: 'absolute', bottom: -12, insetInlineEnd: 28,
              borderWidth: '13px 13px 0 13px', borderStyle: 'solid',
              borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
            },
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', md: '1.75rem' }, whiteSpace: 'nowrap' }}>
            שלום, מארק! 👋
          </Typography>
        </Box>
        <Box
          component="img"
          src={faceImg}
          alt="אלפי"
          sx={{
            maxHeight: { xs: 440, md: 760 },
            maxWidth: '120%',
            objectFit: 'contain',
            display: 'block',
            animation: `${floaty} 5s ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            filter: (t) => `drop-shadow(0 24px 40px ${alpha(t.palette.primary.dark, 0.35)})`,
          }}
        />
      </Box>

      {/* Boxes — colorful, overlapping ALFI's hands */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 3fr' }, gap: 2, alignItems: 'stretch', position: 'relative', zIndex: 1 }}>

        {/* Score gauge card */}
        <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[8], bgcolor: (t) => alpha(t.palette.background.paper, 0.96) }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Avatar variant="rounded" sx={{ bgcolor: alpha(teal[500], 0.16), color: teal[800], width: 34, height: 34 }}>
                <AutoAwesomeRoundedIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>הציון הממוצע שלי</Typography>
            </Stack>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <ScoreGauge value={78} />
            </Box>
          </CardContent>
        </Card>

        {/* Next task CTA card */}
        <Card sx={{
          borderRadius: 4,
          boxShadow: theme.shadows[8],
          position: 'relative',
          overflow: 'hidden',
          color: 'primary.contrastText',
          background: `linear-gradient(135deg, ${deepPurple[500]} 0%, ${blue[500]} 55%, ${cyan[500]} 100%)`,
        }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Avatar variant="rounded" sx={{ bgcolor: alpha(common.white, 0.22), color: common.white }}>
                <AssignmentTwoToneIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>התרגיל הבא שלי</Typography>
            </Stack>
            <Typography sx={{ textAlign: 'start', mb: 2.5, flex: 1, textWrap: 'pretty', opacity: 0.95 }}>
              יש לי 8 תרגילים חדשים מהמורה. בוא נתחיל עם אלגברה!
            </Typography>
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon className="dir-icon" />}
              sx={{
                alignSelf: 'flex-start',
                fontWeight: 800,
                borderRadius: 2,
                bgcolor: 'background.paper',
                color: 'primary.main',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': { bgcolor: 'background.paper', transform: 'scale(1.05)' },
                '&::after': {
                  content: '""', position: 'absolute', inset: 0,
                  background: `linear-gradient(105deg, transparent 10%, ${alpha(common.white, 0.9)} 50%, transparent 90%)`,
                  animation: `${ctaShimmer} 2.4s ease-in-out infinite`,
                  pointerEvents: 'none',
                },
                '@media (prefers-reduced-motion: reduce)': { '&::after': { animation: 'none' } },
              }}
            >
              בוא נתרגל!
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Shell>
  );
}
