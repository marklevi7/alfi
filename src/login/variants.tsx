import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { AuthForm, FeatureList, BrandMark, AlfiImg, Tagline, gradientBrand, COPY } from './parts';

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
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, p: { xs: 2, md: 8 }, background: gradientBrand }}>
      <AlfiImg sx={{ position: 'absolute', insetInlineEnd: { md: '4%' }, bottom: 0, height: { md: '92%' }, width: 'auto', maxWidth: 'none', display: { xs: 'none', md: 'block' }, opacity: 0.96 }} />
      <Paper elevation={12} sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: (t) => alpha(t.palette.background.paper, 0.94) }}>
        <BrandMark sx={{ mb: 2, color: 'primary.main' }} />
        <AuthForm />
        <Box sx={{ mt: 1 }}><FeatureList dense /></Box>
      </Paper>
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
];

void COPY;
