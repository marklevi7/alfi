import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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

export const COPY = {
  welcomeTitle: 'ברוכים השבים 👋',
  welcomeSubtitle: 'התחברו כדי להמשיך מהנקודה שבה הפסקתם.',
  brandName: 'ALFI',
  tagline: 'עוזר הלמידה החכם שלך',
  footer: 'פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות · v11',
  features: [
    'תובנות מבוססות AI למורים ולתלמידים',
    'תרגול מותאם לתוכנית הלימודים עם משוב מיידי',
    'מעקב התקדמות בזמן אמת',
    'מותאם לתהליכי למידה מודרניים',
  ],
};

export function BrandMark({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={sx}>
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
  );
}

export function AlfiImg({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Box
      component="img"
      src="alfi.png"
      alt="Alfi"
      sx={{
        objectFit: 'contain',
        filter: (t) => `drop-shadow(0 16px 40px ${alpha(t.palette.common.black, 0.3)})`,
        ...sx,
      }}
    />
  );
}

export function FeatureList({
  inverse = false,
  dense = false,
}: {
  inverse?: boolean;
  dense?: boolean;
}) {
  return (
    <List dense={dense} sx={{ width: '100%' }}>
      {COPY.features.map((f) => (
        <ListItem key={f} disableGutters sx={{ py: 0.4 }}>
          <ListItemIcon sx={{ color: inverse ? 'inherit' : 'primary.main', minWidth: 38 }}>
            <CheckCircleRoundedIcon fontSize={dense ? 'small' : 'medium'} />
          </ListItemIcon>
          <ListItemText primary={f} primaryTypographyProps={{ fontWeight: 500 }} />
        </ListItem>
      ))}
    </List>
  );
}

export function AuthForm({ showTitle = true }: { showTitle?: boolean }) {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Box sx={{ width: '100%' }}>
      {showTitle && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            {COPY.welcomeTitle}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {COPY.welcomeSubtitle}
          </Typography>
        </Stack>
      )}

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
        <TextField label="אימייל" type="email" placeholder="הזינו כתובת אימייל" fullWidth autoComplete="email" />
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
        <Button type="submit" variant="contained" size="large" fullWidth disableElevation sx={{ py: 1.25, fontWeight: 700, borderRadius: 2 }}>
          התחברות
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
        {COPY.footer}
      </Typography>
    </Box>
  );
}

export const gradientBrand = (t: Theme) =>
  `linear-gradient(150deg, ${t.palette.primary.dark} 0%, ${t.palette.primary.main} 60%, ${t.palette.primary.light} 100%)`;

export function Tagline({ align = 'center' }: { align?: 'center' | 'inherit' }) {
  return (
    <Box sx={{ textAlign: align }}>
      <Typography variant="h3" component="p" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
        {COPY.brandName}
      </Typography>
      <Typography variant="h6" component="p" sx={{ fontWeight: 400, opacity: 0.92 }}>
        {COPY.tagline}
      </Typography>
    </Box>
  );
}
