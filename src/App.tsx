import { useState } from 'react';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const features = [
  'תובנות מבוססות AI למורים ולתלמידים',
  'תרגול מותאם לתוכנית הלימודים עם משוב מיידי',
  'גישה מאובטחת',
  'מותאם לתהליכי למידה מודרניים',
];

export function App() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      {/* Brand / welcome panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 4, md: 8 },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
          <AutoAwesomeIcon />
          <Box>
            <Typography variant="subtitle2" sx={{ letterSpacing: 2 }}>
              KNOW-PROBLEM
            </Typography>
            <Typography variant="caption">EDU-AI learning platform</Typography>
          </Box>
        </Stack>

        <Box
          component="img"
          src="alfi.png"
          alt="Alfi"
          sx={{ width: { xs: 120, md: 160 }, height: 'auto', mb: 3, alignSelf: 'flex-start' }}
        />

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          ברוכים השבים ל-ALFI
        </Typography>
        <Typography variant="h6" component="p" sx={{ fontWeight: 400, mb: 3, opacity: 0.9 }}>
          התחברו כדי להמשיך מהנקודה שבה הפסקתם, לעקוב אחר התקדמות התלמידים ולתרגל עם Alfi.
        </Typography>

        <List dense>
          {features.map((f) => (
            <ListItem key={f} disableGutters>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <CheckCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={f} />
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Auth panel */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 6 } }}
      >
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 440, p: { xs: 3, md: 4 } }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3 }}
            aria-label="התחברות או הרשמה"
          >
            <Tab label="התחברות" />
            <Tab label="הרשמה" />
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
            <Button type="submit" variant="contained" size="large" fullWidth>
              התחברות
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="#" underline="hover">
                שכחת את הסיסמה?
              </Link>
            </Box>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
            פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות · v3
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
