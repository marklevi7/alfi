import { alpha, keyframes, useTheme } from '@mui/material/styles';
import { indigo, blue, cyan, pink, amber } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { AuthForm, FeatureList, FeatureGrid, SectionLabel, Footer, BrandMark, AlfiImg, Tagline, gradientBrand, COPY } from './parts';
import { SHOW_BOT } from '../dashboard/Shell';

/* 1 — Split: form right, ENORMOUS full-height Alfi left, features over gradient */
function V1() {
  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: { xs: 4, sm: 8 } }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}><AuthForm /></Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', color: 'primary.contrastText', p: 5, background: gradientBrand }}>
        <BrandMark sx={{ position: 'relative', zIndex: 2 }} />
        <AlfiImg sx={{ position: 'absolute', insetInlineStart: '50%', bottom: 0, transform: 'translateX(-50%)', height: '78%', width: 'auto', maxWidth: 'none', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 360 }}>
          <Tagline align="inherit" />
          <Box sx={{ mt: 1 }}><FeatureList inverse dense /></Box>
        </Box>
      </Grid>
    </Grid>
  );
}

/* 2 — Centered card on gradient, Alfi avatar on top, features below form */
function V2() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 }, background: gradientBrand }}>
      <Paper elevation={10} sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 5 }, borderRadius: 4, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto', mb: 2 }}>
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }} />
          <AlfiImg sx={{ position: 'relative', width: '100%', height: '100%' }} />
        </Box>
        <Box sx={{ textAlign: 'start' }}><AuthForm /></Box>
        <Box sx={{ mt: 1, textAlign: 'start' }}><FeatureList dense /></Box>
      </Paper>
    </Box>
  );
}

/* 3 — Mirror split: brand right (RTL-first), form left */
function V3() {
  return (
    <Grid container component="main" sx={{ minHeight: '100vh', flexDirection: 'row-reverse' }}>
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: { xs: 4, sm: 8 } }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}><AuthForm /></Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', color: 'primary.contrastText', p: 5, background: gradientBrand }}>
        <BrandMark sx={{ position: 'relative', zIndex: 2 }} />
        <AlfiImg sx={{ position: 'absolute', insetInlineStart: '50%', bottom: 0, transform: 'translateX(-50%)', height: '78%', width: 'auto', maxWidth: 'none', zIndex: 1 }} />
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 360 }}>
          <Tagline align="inherit" />
          <Box sx={{ mt: 1 }}><FeatureList inverse dense /></Box>
        </Box>
      </Grid>
    </Grid>
  );
}

/* 4 — Hero band on top (Alfi + brand + features), form card overlapping below */
function V4() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ position: 'relative', color: 'primary.contrastText', background: gradientBrand, pt: 5, pb: 12, px: { xs: 3, md: 8 } }}>
        <BrandMark sx={{ mb: 2 }} />
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ flexWrap: 'wrap' }}>
          <AlfiImg sx={{ height: 200, width: 'auto' }} />
          <Box sx={{ maxWidth: 420 }}>
            <Tagline align="inherit" />
            <Box sx={{ mt: 1 }}><FeatureList inverse dense /></Box>
          </Box>
        </Stack>
      </Box>
      <Box sx={{ px: 2, mt: -8, pb: 6, display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={10} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
          <AuthForm />
        </Paper>
      </Box>
    </Box>
  );
}

/* 5 — Full gradient, big Alfi watermark on side, translucent glass card */
function V5() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'row', alignItems: 'stretch', background: gradientBrand, overflow: 'hidden' }}>
      {/* Form column — first child = RIGHT in RTL row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 6 }, width: { xs: '100%', md: 520 }, flexShrink: 0 }}>
        <Paper elevation={12} sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: (t) => alpha(t.palette.background.paper, 0.94) }}>
          <BrandMark variant="dark" size="xl" sx={{ mb: 3 }} />
          <AuthForm showTitle={false} showFooter={false} />
          <SectionLabel>למה אלפי?</SectionLabel>
          <FeatureGrid />
          <Footer />
        </Paper>
      </Box>
      {/* Robot column — second child = LEFT in RTL row */}
      <Box sx={{ flex: 1, position: 'relative', display: { xs: 'none', md: 'block' }, overflow: 'hidden' }}>
        <AlfiImg sx={{ position: 'absolute', bottom: 0, left: 0, height: '92%', width: 'auto', maxWidth: '100%', opacity: 0.96 }} />
      </Box>
    </Box>
  );
}

/* 6 — Single centered card, two columns inside: gradient mini-panel + form */
function V6() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 0, sm: 4 }, bgcolor: 'background.default' }}>
      <Paper elevation={10} sx={{ width: '100%', maxWidth: 980, borderRadius: { xs: 0, sm: 4 }, overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 4, sm: 6 } }}>
            <Box sx={{ width: '100%', maxWidth: 380 }}><AuthForm /></Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', color: 'primary.contrastText', p: 5, background: gradientBrand }}>
            <AlfiImg sx={{ height: 240, width: 'auto', alignSelf: 'center', mb: 2 }} />
            <Tagline />
            <Box sx={{ mt: 2 }}><FeatureList inverse dense /></Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

/* 7 — Narrow gradient sidebar (Alfi + features), form fills the rest */
function V7() {
  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: { xs: 4, sm: 8 } }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}><AuthForm /></Box>
      </Grid>
      <Grid item xs={12} md={4} sx={{ position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', color: 'primary.contrastText', p: 4, background: gradientBrand }}>
        <BrandMark sx={{ mb: 3 }} />
        <AlfiImg sx={{ width: '100%', height: 'auto', mb: 2 }} />
        <Tagline align="inherit" />
        <Box sx={{ mt: 2 }}><FeatureList inverse dense /></Box>
      </Grid>
    </Grid>
  );
}

/* 8 — Minimal single column, small Alfi, features as plain list */
function V8() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, sm: 5 }, bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 1 }}>
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: (t) => alpha(t.palette.primary.main, 0.1) }} />
          <AlfiImg sx={{ position: 'relative', width: '100%', height: '100%' }} />
        </Box>
        <Box sx={{ textAlign: 'start' }}>
          <AuthForm />
          <Box sx={{ mt: 1 }}><FeatureList dense /></Box>
        </Box>
      </Box>
    </Box>
  );
}

/* 9 — Form left half, right half gradient: Alfi + features stacked beside */
function V9() {
  return (
    <Grid container component="main" sx={{ minHeight: '100vh', flexDirection: 'row-reverse' }}>
      <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: { xs: 4, sm: 8 } }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}><AuthForm /></Box>
      </Grid>
      <Grid item xs={12} md={7} sx={{ position: 'relative', overflow: 'hidden', display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4, color: 'primary.contrastText', p: 6, background: gradientBrand }}>
        <AlfiImg sx={{ height: '80%', width: 'auto', maxWidth: '55%' }} />
        <Box sx={{ flex: 1 }}>
          <BrandMark sx={{ mb: 2 }} />
          <Tagline align="inherit" />
          <Box sx={{ mt: 2 }}><FeatureList inverse /></Box>
        </Box>
      </Grid>
    </Grid>
  );
}

/* 10 — Card with gradient header band (Alfi + brand), body form, features grid */
function V10() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 0, sm: 4 }, bgcolor: 'background.default' }}>
      <Paper elevation={10} sx={{ width: '100%', maxWidth: 520, borderRadius: { xs: 0, sm: 4 }, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', color: 'primary.contrastText', background: gradientBrand, px: 4, pt: 4, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <BrandMark sx={{ mb: 1 }} />
            <Tagline align="inherit" />
          </Box>
          <AlfiImg sx={{ height: 150, width: 'auto' }} />
        </Box>
        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <AuthForm showTitle={false} />
          <Box sx={{ mt: 1 }}><FeatureList dense /></Box>
        </Box>
      </Paper>
    </Box>
  );
}

/* ---- 3 takes on #5 (glass card on gradient, mirrored Alfi) ---- */

/* Floating math signs over the zone where Alfi stood (same language as the dashboard). */
const floatSign = keyframes`
  0%   { transform: translateY(0) rotate(0deg); }
  50%  { transform: translateY(-18px) rotate(8deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;
const twinkle = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50%      { opacity: 1; transform: scale(1.12); }
`;
const SIGN_CHARS = ['+', '−', '×', '÷', '=', 'π', '√', '%', '∞', 'Σ', '≈', '≠'];
const SPARK_CHARS = ['✦', '✧', '⋆', '·'];
// deterministic "randomness" — same galaxy on every load, no hydration drift
const pr = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

// A little galaxy: 3 concentric diagonal ellipses (tilted, rising toward the
// card), jittered so it feels hand-scattered. Outermost ring slides behind the
// card (container is full-bleed; the card sits above at zIndex 2).
// +25° here renders as a visual rise toward the card: the RTL cache mirrors `left`.
type Sign = { top: number; left: number; ch: string; size: number; big: boolean };
function buildGalaxy(): Sign[] {
  const th = (25 * Math.PI) / 180;
  const cx = 46, cy = 50;
  const rings = [
    { a: 52, b: 26, n: 16, size: 30, signs: true },
    { a: 37, b: 17, n: 11, size: 22, signs: true },
    { a: 64, b: 34, n: 12, size: 16, signs: false }, // outer sparkle ring, dips behind the card
  ];
  const out: Sign[] = [];
  let k = 0;
  for (const r of rings) {
    for (let i = 0; i < r.n; i++) {
      k++;
      const t = (i / r.n) * Math.PI * 2 + pr(k) * 0.5;           // angular jitter
      const wob = 1 + (pr(k * 3) - 0.5) * 0.16;                  // radial jitter
      const a = r.a * wob, b = r.b * wob;
      const left = cx + a * Math.cos(t) * Math.cos(th) - b * Math.sin(t) * Math.sin(th);
      const top = cy + a * Math.cos(t) * Math.sin(th) + b * Math.sin(t) * Math.cos(th);
      if (top < 4 || top > 96 || left < 1 || left > 99) continue;
      const ch = r.signs
        ? SIGN_CHARS[Math.floor(pr(k * 7) * SIGN_CHARS.length)]
        : SPARK_CHARS[Math.floor(pr(k * 7) * SPARK_CHARS.length)];
      out.push({ top, left, ch, size: r.size + Math.round(pr(k * 13) * 12), big: r.signs });
    }
  }
  return out;
}
const GALAXY = buildGalaxy();

function LoginSigns() {
  const theme = useTheme();
  // primary-driven so v5 stays purple and v6/v7 stay green
  const colors = [theme.palette.primary.light, blue[400], cyan[500], pink[400], amber[500], theme.palette.primary.main, blue[300], pink[300]];
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', display: { xs: 'none', md: 'block' } }}>
      {GALAXY.map((s, i) => {
        const c = colors[i % colors.length];
        const dur = 3.5 + pr(i + 99) * 3;
        const delay = pr(i + 51) * 2;
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute', top: `${s.top}%`, left: `${s.left}%`,
              fontWeight: 900, fontSize: s.size, lineHeight: 1, color: c,
              opacity: s.big ? 1 : 0.8,
              textShadow: `0 0 14px ${alpha(c, 0.85)}, 0 0 28px ${alpha(c, 0.5)}`,
              animation: `${floatSign} ${dur}s ease-in-out ${delay}s infinite, ${twinkle} ${dur * 0.8}s ease-in-out ${delay}s infinite`,
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {s.ch}
          </Box>
        );
      })}
    </Box>
  );
}

/* 5A — Alfi full-height bottom-left, glass card right (ref) */
function V5a() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, p: { xs: 2, md: 8 }, bgcolor: indigo[50] }}>
      {SHOW_BOT && (
        <AlfiImg src="alfi-green-head.png" sx={{ position: 'absolute', insetInlineEnd: { md: '4%' }, bottom: 0, height: { md: '82%' }, width: 'auto', maxWidth: 'none', display: { xs: 'none', md: 'block' }, transform: 'translateX(-100px)' }} />
      )}
      <LoginSigns />
      <Paper elevation={4} sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: 'background.paper' }}>
        <BrandMark variant="dark" size="xl" sx={{ mb: 3 }} />
        <AuthForm showTitle={false} showFooter={false} />
        <Footer />
      </Paper>
    </Box>
  );
}

/* 5B — Alfi huge with soft halo, narrower translucent card centered-right */
function V5b() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, p: { xs: 2, md: 10 }, background: gradientBrand }}>
      <Box aria-hidden sx={{ position: 'absolute', insetInlineEnd: '8%', top: '50%', transform: 'translateY(-50%)', width: { md: 620 }, height: { md: 620 }, borderRadius: '50%', bgcolor: (t) => alpha(t.palette.common.white, 0.14), display: { xs: 'none', md: 'block' } }} />
      <AlfiImg src="alfi-mirror.png" sx={{ position: 'absolute', insetInlineEnd: { md: '4%' }, top: '50%', transform: 'translateY(-50%)', height: { md: '84%' }, width: 'auto', maxWidth: 'none', display: { xs: 'none', md: 'block' } }} />
      <Paper elevation={12} sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 380, p: { xs: 3, sm: 4 }, borderRadius: 5, bgcolor: (t) => alpha(t.palette.background.paper, 0.88) }}>
        <BrandMark variant="dark" size="xl" sx={{ mb: 3 }} />
        <AuthForm showTitle={false} showFooter={false} />
        <SectionLabel>למה אלפי?</SectionLabel>
        <FeatureGrid />
        <Footer />
      </Paper>
    </Box>
  );
}

/* 5C — Alfi bottom-left, wide card right with tagline + features */
function V5c() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: { xs: 'center', md: 'flex-start' }, p: { xs: 2, md: 6 }, background: gradientBrand }}>
      <AlfiImg src="alfi-mirror.png" sx={{ position: 'absolute', insetInlineEnd: 0, bottom: 0, height: { md: '88%' }, width: 'auto', maxWidth: 'none', display: { xs: 'none', md: 'block' } }} />
      <Paper elevation={12} sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 460, p: { xs: 3, sm: 5 }, mb: { md: 6 }, borderRadius: 4, bgcolor: (t) => alpha(t.palette.background.paper, 0.95) }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <BrandMark variant="dark" size="xl" />
        </Stack>
        <AuthForm showTitle={false} showFooter={false} />
        <SectionLabel>למה אלפי?</SectionLabel>
        <FeatureGrid />
        <Footer />
      </Paper>
    </Box>
  );
}

export const VARIANTS: { name: string; Comp: () => JSX.Element }[] = [
  { name: 'פיצול · אלפי ענק', Comp: V1 },
  { name: 'כרטיס במרכז', Comp: V2 },
  { name: 'פיצול הפוך', Comp: V3 },
  { name: 'באנר עליון', Comp: V4 },
  { name: 'זכוכית על גרדיאנט', Comp: V5 },
  { name: 'כרטיס דו-טורי', Comp: V6 },
  { name: 'סרגל צד', Comp: V7 },
  { name: 'מינימלי', Comp: V8 },
  { name: 'טור תכונות', Comp: V9 },
  { name: 'כותרת גרדיאנט', Comp: V10 },
  { name: '5A · זכוכית קלאסי', Comp: V5a },
  { name: '5B · הילה + אלפי ענק', Comp: V5b },
  { name: '5C · כרטיס רחב', Comp: V5c },
];

void COPY;
