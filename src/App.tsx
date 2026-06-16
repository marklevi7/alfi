import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0, sm: 3, md: 5 },
        background: (t) =>
          `linear-gradient(135deg, ${alpha(t.palette.primary.light, 0.25)} 0%, ${alpha(
            t.palette.primary.main,
            0.12,
          )} 100%)`,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 1040,
          borderRadius: { xs: 0, sm: 4 },
          overflow: 'hidden',
          minHeight: { md: 620 },
        }}
      >
        <Grid container sx={{ minHeight: 'inherit' }}>
          {/* Auth panel — first in RTL so it renders on the right */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 4, sm: 6 },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 380 }}>
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
                פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות · v8
              </Typography>
            </Box>
          </Grid>

          {/* Brand / welcome panel with big Alfi */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'primary.contrastText',
              p: { xs: 5, md: 7 },
              background: (t) =>
                `linear-gradient(150deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 55%, ${t.palette.primary.light} 100%)`,
            }}
          >
            {/* decorative glows */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: -100,
                insetInlineStart: -100,
                width: 320,
                height: 320,
                borderRadius: '50%',
                bgcolor: (t) => alpha(t.palette.common.white, 0.12),
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                bottom: -140,
                insetInlineEnd: -120,
                width: 360,
                height: 360,
                borderRadius: '50%',
                bgcolor: (t) => alpha(t.palette.common.white, 0.08),
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ position: 'relative', mb: 2 }}
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

            {/* Big Alfi hero */}
            <Box
              sx={{
                position: 'relative',
                alignSelf: 'center',
                width: { xs: 280, md: 440 },
                height: { xs: 280, md: 440 },
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  bgcolor: (t) => alpha(t.palette.common.white, 0.16),
                }}
              />
              <Box
                component="img"
                src="alfi.png"
                alt="Alfi"
                sx={{
                  position: 'relative',
                  width: '92%',
                  height: '92%',
                  objectFit: 'contain',
                  filter: (t) => `drop-shadow(0 12px 24px ${alpha(t.palette.common.black, 0.25)})`,
                }}
              />
            </Box>

            <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
              <Typography variant="h3" component="p" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                ALFI
              </Typography>
              <Typography variant="h6" component="p" sx={{ fontWeight: 400, opacity: 0.92 }}>
                עוזר הלמידה החכם שלך
              </Typography>
            </Box>

            <List sx={{ position: 'relative', maxWidth: 460, mx: 'auto' }}>
              {features.map((f) => (
                <ListItem key={f} disableGutters sx={{ py: 0.4 }}>
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <CheckCircleRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={f} primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
