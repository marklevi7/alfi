import { useState } from 'react';
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
import { VersionBar, DASH_VERSIONS } from './dashboard/MainScreen';
import { Analytics } from './dashboard/Analytics';
import { Practice } from './dashboard/Practice';
import { History } from './dashboard/History';
import { NavContext, type Screen } from './nav';

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
  const [ver, setVer] = useState(DASH_VERSIONS.length - 1);
  const DashVariant = DASH_VERSIONS[ver].Comp;
  return (
    <NavContext.Provider value={{ go: setScreen }}>
      {screen !== 'login' && <VersionBar value={ver} onChange={setVer} />}
      {screen === 'login' ? <LoginSwitcher />
        : screen === 'analytics' ? <Analytics />
        : screen === 'practice' ? <Practice />
        : screen === 'history' ? <History />
        : <DashVariant />}
    </NavContext.Provider>
  );
}
