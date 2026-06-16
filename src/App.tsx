import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export function App() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      {/* Auth half — first in RTL so it renders on the right */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 4, sm: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Stack spacing={1} sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              ברוכים השבים 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              התחברו כדי להמשיך מהנקודה שבה הפסקתם.
            </Typography>
          </Stack>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ mb: 3 }}
            aria-label="התחברות או הרשמה"
          >
            <Tab label="התחברות" sx={{ fontWeight: 700 }} />
            <Tab label="הרשמה" sx={{ fontWeight: 700 }} />
          </Tabs>

          <Stack component="form" spacing={2.5}>
            <TextField
              label="אימייל"
              type="email"
              placeholder="הזינו כתובת אימייל"
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="סיסמה"
              type={showPassword ? 'text' : 'password'}
              placeholder="הזינו סיסמה"
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <FormControlLabel
                control={<Checkbox size="small" defaultChecked />}
                label={<Typography variant="body2">זכור אותי</Typography>}
              />
              <Link href="#" variant="body2" underline="hover" sx={{ fontWeight: 600 }}>
                שכחת את הסיסמה?
              </Link>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disableElevation
              sx={{ py: 1.25, fontWeight: 700, borderRadius: 2 }}
            >
              התחברות
            </Button>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 5, textAlign: 'center' }}
          >
            פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות · v10
          </Typography>
        </Box>
      </Grid>

      {/* Brand half — ENORMOUS full-height Alfi */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'flex-end',
          justifyContent: 'center',
          color: 'primary.contrastText',
          background: (t) =>
            `linear-gradient(150deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 60%, ${t.palette.primary.light} 100%)`,
        }}
      >
        {/* brand mark, top */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ position: 'absolute', top: 32, insetInlineEnd: 40, zIndex: 2 }}
        >
          <AutoAwesomeIcon fontSize="small" />
          <Box>
            <Typography variant="subtitle2" sx={{ letterSpacing: 3, fontWeight: 700 }}>
              KNOW-PROBLEM
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              EDU-AI learning platform
            </Typography>
          </Box>
        </Stack>

        {/* soft glow behind Alfi */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: '46%',
            insetInlineStart: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            paddingBottom: '80%',
            borderRadius: '50%',
            bgcolor: (t) => alpha(t.palette.common.white, 0.14),
          }}
        />

        {/* ENORMOUS Alfi, fills full height, anchored to bottom */}
        <Box
          component="img"
          src="alfi.png"
          alt="Alfi"
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            width: 'auto',
            maxWidth: 'none',
            objectFit: 'contain',
            objectPosition: 'bottom',
            filter: (t) => `drop-shadow(0 16px 40px ${alpha(t.palette.common.black, 0.3)})`,
          }}
        />

        {/* title overlay, bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            insetInlineStart: 0,
            insetInlineEnd: 0,
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <Typography variant="h2" component="p" sx={{ fontWeight: 800, lineHeight: 1 }}>
            ALFI
          </Typography>
          <Typography variant="h6" component="p" sx={{ fontWeight: 400, opacity: 0.92 }}>
            עוזר הלמידה החכם שלך
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
