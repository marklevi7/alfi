import { useState, createContext, useContext } from 'react';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
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
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { useNav } from '../nav';
import { Logo } from '../components/Logo';

export const COPY = {
  welcomeTitle: 'ברוכים השבים 👋',
  welcomeSubtitle: 'התחברו כדי להמשיך מהנקודה שבה הפסקתם.',
  brandName: 'ALFI',
  tagline: 'עוזר הלמידה החכם שלך',
  footer: 'פלטפורמת EDU-AI · Know-Problem · כל הזכויות שמורות · v201',
  features: [
    'תובנות מבוססות AI למורים ולתלמידים',
    'תרגול מותאם לתוכנית הלימודים עם משוב מיידי',
    'מעקב התקדמות בזמן אמת',
    'מותאם לתהליכי למידה מודרניים',
  ],
};

export function BrandMark({
  sx,
  variant = 'light',
  size = 'medium',
}: {
  sx?: SxProps<Theme>;
  variant?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large' | 'xl';
}) {
  return <Logo variant={variant} size={size} tagline={false} sx={sx} />;
}

export function AlfiImg({ sx, src = 'alfi.png' }: { sx?: SxProps<Theme>; src?: string }) {
  return (
    <Box
      component="img"
      src={src}
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

const featureCards = [
  { icon: <AutoAwesomeRoundedIcon />, text: COPY.features[0] },
  { icon: <BoltRoundedIcon />, text: COPY.features[1] },
  { icon: <TrendingUpRoundedIcon />, text: COPY.features[2] },
  { icon: <SchoolRoundedIcon />, text: COPY.features[3] },
];

/** Tidy 2×2 grid of cute feature tiles. */
export function FeatureGrid() {
  return (
    <Grid container spacing={1.25}>
      {featureCards.map((f) => (
        <Grid item xs={6} key={f.text}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              height: '100%',
              p: 1,
              borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
            }}
          >
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
                color: 'primary.main',
                flexShrink: 0,
              }}
            >
              {f.icon}
            </Avatar>
            <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
              {f.text}
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

/** Section break with a tiny centered label. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Divider sx={{ my: 2.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
        {children}
      </Typography>
    </Divider>
  );
}

export function Footer() {
  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
      {COPY.footer}
    </Typography>
  );
}

// the four steps of "שכחתי סיסמה", inside the same card so nothing jumps
type ResetStep = 'email' | 'code' | 'password' | 'done';

// every state the auth card can be in — the dev control bar drives it from outside
export type AuthView = 'login' | 'login-error' | 'login-timeout' | 'new-password' | 'signup' | 'reset-email' | 'reset-code' | 'reset-password' | 'reset-done';
export const AUTH_VIEWS: { label: string; view: AuthView }[] = [
  { label: 'log in', view: 'login' },
  { label: 'wrong details', view: 'login-error' },
  { label: 'timed out', view: 'login-timeout' },
  { label: 'new password', view: 'new-password' },
  { label: 'sign up', view: 'signup' },
  { label: 'reset 1', view: 'reset-email' },
  { label: 'reset 2', view: 'reset-code' },
  { label: 'reset 3', view: 'reset-password' },
  { label: 'reset 4', view: 'reset-done' },
];
export const AuthViewContext = createContext<{ view: AuthView; setView: (v: AuthView) => void } | null>(null);

export function AuthForm({ showTitle = true, showFooter = true }: { showTitle?: boolean; showFooter?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  // the control bar owns the view when it's mounted; otherwise the card keeps its own
  const ctx = useContext(AuthViewContext);
  const [localView, setLocalView] = useState<AuthView>('login');
  const view = ctx?.view ?? localView;
  const setView = ctx?.setView ?? setLocalView;
  const tab = view === 'signup' ? 1 : 0;
  // the session expired on its own — tell the student why they're back here
  const timedOut = view === 'login-timeout';
  // wrong email or password — the card says what happened and both fields turn red
  const loginError = view === 'login-error';
  const setTab = (i: number) => setView(i === 1 ? 'signup' : 'login');
  const reset: ResetStep | null =
    view === 'reset-email' ? 'email'
    : view === 'reset-code' ? 'code'
    : view === 'reset-password' ? 'password'
    : view === 'reset-done' ? 'done'
    : null;
  const setReset = (step: ResetStep | null) => setView(step ? (`reset-${step}` as AuthView) : 'login');
  const nav = useNav();

  // signed in with a temporary password — a permanent one has to be set before anything else
  if (view === 'new-password') return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          בחירת סיסמה חדשה
        </Typography>
        <Typography variant="body1" color="text.secondary">
          התחברתם עם סיסמה זמנית. בחרו סיסמה קבועה כדי להמשיך.
        </Typography>
      </Stack>

      <Stack
        component="form"
        spacing={2.5}
        sx={{ minHeight: 355 }}
        onSubmit={(e) => { e.preventDefault(); nav.go('dashboard'); }}
      >
        <TextField
          label="סיסמה חדשה" type={showPassword ? 'text' : 'password'} placeholder="בחרו סיסמה" fullWidth autoFocus
          autoComplete="new-password" helperText="לפחות 8 תווים"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'} onClick={() => setShowPassword((v) => !v)} edge="end">
                  {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField label="אימות סיסמה" type={showPassword ? 'text' : 'password'} placeholder="הזינו שוב את הסיסמה" fullWidth autoComplete="new-password" />

        <Button type="submit" variant="contained" size="large" fullWidth disableElevation sx={{ py: 1.25, fontWeight: 700 }}>
          שמירה והמשך
        </Button>
      </Stack>

      {showFooter && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
          {COPY.footer}
        </Typography>
      )}
    </Box>
  );

  if (reset) return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          {reset === 'done' ? 'הסיסמה הוחלפה 🎉' : 'איפוס סיסמה'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {reset === 'email' && 'הזינו את כתובת האימייל שלכם ונשלח אליכם קוד אימות.'}
          {reset === 'code' && 'שלחנו קוד בן 6 ספרות לאימייל שלכם. הזינו אותו כאן.'}
          {reset === 'password' && 'בחרו סיסמה חדשה, לפחות 8 תווים.'}
          {reset === 'done' && 'אפשר להתחבר עכשיו עם הסיסמה החדשה.'}
        </Typography>
      </Stack>

      <Stack
        component="form"
        spacing={2.5}
        sx={{ minHeight: 355 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (reset === 'email') setReset('code');
          else if (reset === 'code') setReset('password');
          else if (reset === 'password') setReset('done');
          else setReset(null);
        }}
      >
        {reset === 'email' && (
          <TextField label="אימייל" type="email" placeholder="הזינו כתובת אימייל" fullWidth autoComplete="email" autoFocus />
        )}

        {reset === 'code' && (
          <>
            <TextField
              label="קוד אימות" placeholder="6 ספרות" fullWidth autoFocus autoComplete="one-time-code"
              inputProps={{ inputMode: 'numeric', maxLength: 6, style: { letterSpacing: '0.5em', fontWeight: 700 } }}
            />
            <Typography variant="body2" color="text.secondary">
              לא הגיע קוד? <Link component="button" type="button" underline="hover" variant="body2" sx={{ fontWeight: 700 }}>שליחה מחדש</Link>
            </Typography>
          </>
        )}

        {reset === 'password' && (
          <>
            <TextField
              label="סיסמה חדשה" type={showPassword ? 'text' : 'password'} placeholder="בחרו סיסמה" fullWidth autoFocus
              autoComplete="new-password" helperText="לפחות 8 תווים"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'} onClick={() => setShowPassword((v) => !v)} edge="end">
                      {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField label="אימות סיסמה" type={showPassword ? 'text' : 'password'} placeholder="הזינו שוב את הסיסמה" fullWidth autoComplete="new-password" />
          </>
        )}

        {reset === 'done' && (
          <Stack spacing={1.5} alignItems="center" sx={{ py: 3 }}>
            <CheckCircleRoundedIcon color="primary" sx={{ fontSize: 72 }} />
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              הסיסמה שלכם עודכנה בהצלחה.
            </Typography>
          </Stack>
        )}

        <Button type="submit" variant="contained" size="large" fullWidth disableElevation sx={{ py: 1.25, fontWeight: 700 }}>
          {reset === 'email' ? 'שליחת קוד' : reset === 'code' ? 'אימות הקוד' : reset === 'password' ? 'שמירת הסיסמה' : 'התחברות'}
        </Button>

        {reset !== 'done' && (
          <Button onClick={() => setReset(null)} variant="outlined" size="large" fullWidth sx={{ py: 1.25, fontWeight: 700 }}>
            חזרה להתחברות
          </Button>
        )}
      </Stack>

      {showFooter && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
          {COPY.footer}
        </Typography>
      )}
    </Box>
  );

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

      {timedOut && (
        <Alert severity="info" sx={{ mb: 2.5, fontWeight: 600 }}>
          נותקת מהמערכת עקב חוסר שימוש
        </Alert>
      )}
      {loginError && (
        <Alert severity="error" sx={{ mb: 2.5, fontWeight: 600 }}>
          האימייל או הסיסמה שגויים. בדקו ונסו שוב.
        </Alert>
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

      <Stack
        component="form"
        spacing={2.5}
        // fixed to the taller (signup) layout so switching tabs never resizes the card
        sx={{ minHeight: 355 }}
        onSubmit={(e) => {
          e.preventDefault();
          nav.go('dashboard');
        }}
      >
        {/* signup asks for a name; login doesn't */}
        {tab === 1 && (
          <TextField label="שם מלא" placeholder="הזינו שם מלא" fullWidth autoComplete="name" />
        )}
        <TextField
          key={`email-${view}`}
          label="אימייל" type="email" placeholder="הזינו כתובת אימייל" fullWidth autoComplete="email"
          error={loginError}
          {...(loginError && { defaultValue: 'mark@school.co.il' })}
        />
        <TextField
          key={`password-${view}`}
          label="סיסמה"
          type={showPassword ? 'text' : 'password'}
          placeholder={tab === 0 ? 'הזינו סיסמה' : 'בחרו סיסמה'}
          fullWidth
          autoComplete={tab === 0 ? 'current-password' : 'new-password'}
          error={loginError}
          {...(loginError && { defaultValue: '12345678' })}
          helperText={loginError ? 'שכחתם את הסיסמה? אפשר לאפס אותה כאן למטה.' : tab === 1 ? 'לפחות 8 תווים' : undefined}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {tab === 0 ? (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox size="small" defaultChecked />}
              label={<Typography variant="body2">זכור אותי</Typography>}
            />
            <Link component="button" type="button" onClick={() => setReset('email')} variant="body2" underline="hover" sx={{ fontWeight: 600 }}>
              שכחת את הסיסמה?
            </Link>
          </Stack>
        ) : (
          <FormControlLabel
            control={<Checkbox size="small" />}
            label={
              <Typography variant="body2">
                קראתי ואני מסכים ל<Link href="#" underline="hover" sx={{ fontWeight: 600 }}>תנאי השימוש</Link>
              </Typography>
            }
          />
        )}
        <Button type="submit" variant="contained" size="large" fullWidth disableElevation sx={{ py: 1.25, fontWeight: 700 }}>
          {tab === 0 ? 'התחברות' : 'הרשמה'}
        </Button>
      </Stack>

      {showFooter && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
          {COPY.footer}
        </Typography>
      )}
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
