import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { VARIANTS } from './login/variants';
import { VersionBar, DASH_VERSIONS, type Device } from './dashboard/MainScreen';
import { Analytics } from './dashboard/Analytics';
import { Practice } from './dashboard/Practice';
import { History } from './dashboard/History';
import { NavContext, type Screen } from './nav';
import { AuthViewContext, AUTH_VIEWS, type AuthView } from './login/parts';
import { theme, greenTheme } from './theme';

function LoginSwitcher() {
  const [i, setI] = useState(10);
  const prev = () => setI((v) => (v - 1 + VARIANTS.length) % VARIANTS.length);
  const next = () => setI((v) => (v + 1) % VARIANTS.length);
  const Current = VARIANTS[i].Comp;

  const SHOW_SWITCHER = false; // hidden until Mark asks for it back

  return (
    <Box>
      <Current />

      {/* Variant switcher — fades out when idle */}
      {SHOW_SWITCHER && (
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 16,
          insetInlineStart: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
          opacity: 0.12,
          transition: (t) =>
            t.transitions.create('opacity', { duration: 1200, easing: t.transitions.easing.easeInOut }),
          '&:hover, &:focus-within': {
            opacity: 1,
            transition: (t) =>
              t.transitions.create('opacity', { duration: 150, easing: t.transitions.easing.easeOut }),
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={prev} aria-label="פריסה קודמת" size="small">
            <ChevronRightRoundedIcon />
          </IconButton>
          <Select
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            size="small"
            variant="standard"
            disableUnderline
            sx={{ minWidth: 170, fontWeight: 700 }}
            aria-label="בחירת פריסה"
          >
            {VARIANTS.map((v, idx) => (
              <MenuItem key={v.name} value={idx}>
                {idx + 1}. {v.name}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 44, textAlign: 'center' }}>
            {i + 1}/{VARIANTS.length}
          </Typography>
          <IconButton onClick={next} aria-label="פריסה הבאה" size="small">
            <ChevronLeftRoundedIcon />
          </IconButton>
        </Stack>
      </Paper>
      )}
    </Box>
  );
}

export function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [ver, setVer] = useState(() => Math.max(0, DASH_VERSIONS.findIndex((v) => v.label === 'v7')));
  const [sub, setSub] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [device, setDevice] = useState<Device>('desktop');
  const active = DASH_VERSIONS[ver];
  const DashVariant = active.Comp;
  const variant = active.subs?.[sub]?.variant;
  // The selected version themes the WHOLE app: v6/v7 = green, everything else = purple.
  const activeTheme = active.label === 'v6' || active.label.startsWith('v7') ? greenTheme : theme;
  return (
    <NavContext.Provider value={{ go: setScreen }}>
      <ThemeProvider theme={activeTheme}>
        {/* invisible hotspot — top-right corner toggles the dev control bar (hidden by default) */}
        <Box
          onClick={() => setShowBar((v) => !v)}
          aria-label="הצגת בקרות פיתוח"
          sx={{ position: 'fixed', top: 0, insetInlineStart: 0, width: 56, height: 56, zIndex: (t) => t.zIndex.modal + 2, cursor: 'default' }}
        />
        {showBar && (
          <VersionBar
            value={ver} onChange={setVer} sub={sub} onSubChange={setSub}
            onClose={() => setShowBar(false)} device={device} onDeviceChange={setDevice}
            screens={screen === 'login'
              ? { items: AUTH_VIEWS, active: AUTH_VIEWS.findIndex((v) => v.view === authView), onPick: (i) => setAuthView(AUTH_VIEWS[i].view) }
              : undefined}
          />
        )}
        {device === 'mobile' ? (
          // real mobile viewport: the app runs inside a phone-sized iframe so xs breakpoints apply
          <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.900', py: 3 }}>
            <Box
              component="iframe"
              src={window.location.href}
              title="תצוגת מובייל"
              sx={{ width: 390, height: 'min(844px, 92vh)', border: 0, borderRadius: 6, boxShadow: 24, bgcolor: 'background.paper' }}
            />
          </Box>
        ) : (
          <>
            {screen === 'login' ? <AuthViewContext.Provider value={{ view: authView, setView: setAuthView }}><LoginSwitcher /></AuthViewContext.Provider>
              : screen === 'analytics' ? <Analytics />
              : screen === 'practice' ? <Practice />
              : screen === 'history' ? <History />
              : <DashVariant variant={variant} />}
          </>
        )}
      </ThemeProvider>
    </NavContext.Provider>
  );
}
