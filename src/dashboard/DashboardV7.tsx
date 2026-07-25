import { alpha, keyframes, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { blue, cyan, amber, green, red, pink, common } from '@mui/material/colors';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Shell, SHOW_BOT } from './Shell';
import { useNav } from '../nav';

// v7 = clone of v6 (green) — diverge from here. App themes the whole app green when v6 is selected;
// these local green literals just match that on the decorative bits.

const floaty = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
`;

const floatSign = keyframes`
  0%   { transform: translateY(0) rotate(0deg); }
  50%  { transform: translateY(-18px) rotate(8deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50%      { opacity: 1; transform: scale(1.12); }
`;

// Glowing math symbols flying around ALFI (MUI palette colors only).
// Positions live ONLY in side/bottom bands — never over the center face zone.
const SIGN_CHARS = ['+', '−', '×', '÷', '=', 'π', '√', '%', '∞', 'Σ', '≈', '≠'];
const SIGN_COLORS = [green[400], blue[400], cyan[500], pink[400], amber[500], green[300], blue[300], pink[300]];
// Signs orbit ALFI on an elliptical ribbon (two radii) — the face/bubble
// zone at the top-center is skipped so nothing ever covers his face.
function buildOrbit(): [number, number][] {
  const cx = 48, cy = 53, N = 22;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const ang = (i / N) * Math.PI * 2;
    const band = i % 2 === 0 ? 1 : 0.72; // outer / inner ring → ribbon
    const left = cx + Math.cos(ang) * 44 * band;
    const top = cy - Math.sin(ang) * 42 * band;
    // skip the top-center face + speech-bubble window
    if (top < 44 && left > 30 && left < 66) continue;
    pts.push([Math.round(top), Math.round(left)]);
  }
  return pts;
}
const SIGN_POS = buildOrbit();

function MathSigns() {
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {SIGN_POS.map(([top, left], i) => {
        const c = SIGN_COLORS[i % SIGN_COLORS.length];
        const size = 30 + (i % 3) * 5;
        const dur = 4 + (i % 4) * 0.7;
        const delay = (i % 7) * 0.3;
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute', top: `${top}%`, left: `${left}%`,
              fontWeight: 900, fontSize: size, lineHeight: 1, color: c,
              textShadow: `0 0 14px ${alpha(c, 0.85)}, 0 0 28px ${alpha(c, 0.5)}`,
              animation: `${floatSign} ${dur}s ease-in-out ${delay}s infinite, ${twinkle} ${dur * 0.8}s ease-in-out ${delay}s infinite`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {SIGN_CHARS[i % SIGN_CHARS.length]}
          </Box>
        );
      })}
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
          <linearGradient id="alfiGaugeV7" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={red[400]} />
            <stop offset="50%" stopColor={amber[400]} />
            <stop offset="100%" stopColor={green[500]} />
          </linearGradient>
        </defs>
        <path d="M16,100 A84,84 0 0 1 184,100" fill="none" stroke={alpha(green[900], 0.08)} strokeWidth={18} strokeLinecap="round" />
        <path d="M16,100 A84,84 0 0 1 184,100" fill="none" stroke="url(#alfiGaugeV7)" strokeWidth={18} strokeLinecap="round" />
        <circle cx={mx} cy={my} r={11} fill={common.white} stroke={green[500]} strokeWidth={5} />
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

// dashboard1 = full, dashboard2 = no average grade yet, dashboard3 = no next task,
// dashboard4 = empty: no boxes at all, just the greeting on the sign backdrop.
export function DashboardV7({ variant = 'full' }: { variant?: 'full' | 'noGrade' | 'noNext' | 'empty' }) {
  const theme = useTheme();
  const nav = useNav();
  return (
    <Shell active="dashboard" title="" hideSidebarRobot>
      {/* Big ALFI face with speech bubble — sits behind the boxes below */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: SHOW_BOT ? 'flex-end' : 'center', justifyContent: 'center', minHeight: { xs: 260, md: 400 }, mt: SHOW_BOT ? '-150px' : 0, mb: SHOW_BOT ? { xs: -16, md: -40 } : 0, position: 'relative', zIndex: 0 }}>
        {/* speech bubble rides the bot; without him the greeting is the hero */}
        {SHOW_BOT ? (
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
            animation: `${floaty} 3s ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
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
        ) : (
          <Typography sx={{ position: 'relative', zIndex: 2, fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, textAlign: 'center', textWrap: 'balance' }}>
            שלום, מארק! 👋
          </Typography>
        )}
        <MathSigns />
        {/* colorful glow halo behind ALFI */}
        {SHOW_BOT && (
        <Box sx={{
          position: 'absolute', zIndex: 0,
          width: { xs: 320, md: 520 }, height: { xs: 320, md: 520 }, borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(cyan[300], 0.55)} 0%, ${alpha(green[300], 0.35)} 45%, transparent 70%)`,
          filter: 'blur(20px)',
        }} />
        )}
        {SHOW_BOT && (
        <Box
          component="img"
          src="alfi-green.png"
          alt="אלפי"
          sx={{
            position: 'relative',
            top: '-20px',
            transform: 'translateX(-40px)',
            maxHeight: { xs: 440, md: 'min(880px, 78vh)' },
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
            filter: `drop-shadow(0 24px 40px ${alpha(green[700], 0.35)})`,
          }}
        />
        )}
      </Box>

      {/* Boxes — colorful, overlapping ALFI's hands. dashboard4 shows none. */}
      {variant !== 'empty' && (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 3fr' }, gap: 2, alignItems: 'stretch', position: 'relative', top: SHOW_BOT ? '-50px' : 0, zIndex: 1 }}>

        {/* Score gauge card */}
        <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[8], bgcolor: (t) => alpha(t.palette.background.paper, 0.96) }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* empty state mirrors the task card: headline as title, start-aligned body */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {variant === 'noGrade' ? 'עדיין אין ציון ממוצע' : 'הציון הממוצע שלי'}
            </Typography>
            {variant === 'noGrade' ? (
              <Typography sx={{ textAlign: 'start', flex: 1, textWrap: 'pretty', color: 'text.secondary' }}>
                אחרי הבוחן הראשון הציון יופיע כאן.
              </Typography>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <ScoreGauge value={78} />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Next task CTA card — simple white card, green primary CTA */}
        <Card sx={{ borderRadius: 4, boxShadow: theme.shadows[8] }}>
          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
              {variant === 'noNext' ? 'אין תרגילים חדשים כרגע' : 'התרגיל הבא שלי'}
            </Typography>
            {variant === 'noNext' ? (
              <>
                <Typography sx={{ textAlign: 'start', mb: 2.5, flex: 1, textWrap: 'pretty', color: 'text.secondary' }}>
                  כשהמורה תשלח משימה, היא תופיע כאן.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => nav.go('practice')}
                  sx={{ alignSelf: 'flex-start', fontWeight: 800 }}
                >
                  לכל התרגילים
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ textAlign: 'start', mb: 2.5, flex: 1, textWrap: 'pretty', color: 'text.secondary' }}>
                  יש לי 2 תרגילים חדשים מהמורה. בוא נתחיל עם אלגברה!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => nav.go('practice')}
                  endIcon={<ArrowForwardRoundedIcon className="dir-icon" />}
                  sx={{ alignSelf: 'flex-start', fontWeight: 800, '&:hover': { transform: 'scale(1.05)' } }}
                >
                  בוא נתרגל!
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      )}
    </Shell>
  );
}
