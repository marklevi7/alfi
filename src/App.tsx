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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const features = [
  'תובנות מבוססות AI למורים ולתלמידים',
  'תרגול מותאם לתוכנית הלימודים עם משוב מיידי',
  'מעקב התקדמות בזמן אמת',
  'מותאם לתהליכי למידה מודרניים',
];

export function App() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      {/* Auth panel — first in RTL so it renders on the right */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 3, sm: 6 },
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
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                      onClick={() => setShowPassword((s) => !s)}
                      edge="start"
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
            פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות · v5
          </Typography>
        </Box>
      </Grid>

      {/* Brand / welcome panel */}
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'primary.contrastText',
          p: { md: 8, lg: 10 },
          background: (t) =>
            `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 60%, ${t.palette.primary.light} 100%)`,
        }}
      >
        {/* soft decorative glow */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -120,
            insetInlineStart: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            bgcolor: (t) => alpha(t.palette.common.white, 0.12),
          }}
        />

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 6 }}>
          <AutoAwesomeIcon />
          <Box>
            <Typography variant="subtitle2" sx={{ letterSpacing: 3, fontWeight: 700 }}>
              KNOW-PROBLEM
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              EDU-AI learning platform
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Box
            sx={{
              width: 132,
              height: 132,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (t) => alpha(t.palette.common.white, 0.15),
            }}
          >
            <Box component="img" src="alfi.png" alt="Alfi" sx={{ width: 116, height: 116, objectFit: 'cover' }} />
          </Box>
          <Box>
            <Typography variant="h2" component="p" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              ALFI
            </Typography>
            <Typography variant="h6" component="p" sx={{ fontWeight: 400, opacity: 0.9 }}>
              עוזר הלמידה החכם שלך
            </Typography>
          </Box>
        </Stack>

        <Typography variant="h6" component="p" sx={{ fontWeight: 400, mb: 4, maxWidth: 520, opacity: 0.92 }}>
          עקבו אחר התקדמות התלמידים, תרגלו עם Alfi וקבלו משוב מיידי, הכל במקום אחד.
        </Typography>

        <List sx={{ maxWidth: 520 }}>
          {features.map((f) => (
            <ListItem key={f} disableGutters sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <CheckCircleRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={f} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
