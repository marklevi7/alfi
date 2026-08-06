import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import { useNav, type Screen } from '../nav';
import { Logo } from '../components/Logo';
import robotImg from './assets/magnific_3d-a-white-robot-with-pur_ONKIwE6ynm.png';

export { robotImg };

// Bot is hidden while it gets redesigned — flip to true to bring him back everywhere.
export const SHOW_BOT = false;

export const NAV = [
  { label: 'מסך ראשי', short: 'מסך ראשי', icon: <HomeTwoToneIcon />, screen: 'dashboard' as const },
  { label: 'תרגולים ובחנים', short: 'תרגולים', icon: <AssignmentTwoToneIcon />, screen: 'practice' as const },
  { label: 'תמונת מצב', short: 'תמונת מצב', icon: <HistoryTwoToneIcon />, screen: 'history' as const },
];

// the real Alfi avatar — head shot, per theme version (green v7 / purple v5).
// neutral circle behind it: the PNG is transparent, and a tinted disc would read as a state color.
export function AlfiAvatar({ size = 40 }: { size?: number }) {
  const theme = useTheme();
  const src = theme.palette.primary.main === green[700] ? 'alfi-green-head.png' : 'alfi.png';
  // the source art has a lot of air around the head — zoom in so the face fills the circle
  return (
    <Avatar
      src={src}
      alt="אלפי"
      sx={{ width: size, height: size, flexShrink: 0, bgcolor: 'grey.100', '& .MuiAvatar-img': { transform: 'scale(1.7)', transformOrigin: '50% 40%' } }}
    />
  );
}

// popout chat with Alfi — reachable from every screen via the floating balloon
type ChatMsg = { from: 'me' | 'alfi'; text: string };
const ALFI_REPLIES = [
  'שאלה מעולה! בוא נחשוב על זה יחד — מה כבר ניסית?',
  'כיוון טוב! נסה לפרק את הבעיה לשלבים קטנים. מה השלב הראשון לדעתך?',
  'אני כאן איתך 🙂 תסביר לי מה לא ברור ונפתור את זה יחד.',
];

function AlfiChat({ onClose }: { onClose: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ from: 'alfi', text: 'היי! אני אלפי 👋 אפשר לשאול אותי כל שאלה — במתמטיקה או על המערכת.' }]);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [msgs]);
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setMsgs((m) => [...m, { from: 'me', text }]);
    const reply = ALFI_REPLIES[msgs.filter((m) => m.from === 'me').length % ALFI_REPLIES.length];
    setTimeout(() => setMsgs((m) => [...m, { from: 'alfi', text: reply }]), 700);
  };
  return (
    <Paper
      elevation={6}
      sx={{
        // the speech bubble itself, grown into a chat — same spot, same tail, above Alfi's head
        position: 'relative', width: '100%', height: 440, maxHeight: '60vh',
        borderRadius: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        '&::after': {
          content: '""', position: 'absolute', bottom: -12, insetInlineStart: 26,
          borderWidth: '13px 13px 0 13px', borderStyle: 'solid',
          borderColor: (t) => `${t.palette.background.paper} transparent transparent transparent`,
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 1.5, bgcolor: 'grey.100' }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>אלפי</Typography>
          <Typography variant="caption" color="text.secondary">כאן לכל שאלה</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="סגירת הצ׳אט"><CloseRoundedIcon fontSize="small" /></IconButton>
      </Stack>
      <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
        {msgs.map((m, i) => (
          <Box
            key={i}
            sx={{
              // RTL: my messages on the RIGHT (inline start), Alfi answers from the LEFT
              alignSelf: m.from === 'me' ? 'flex-start' : 'flex-end',
              maxWidth: '85%',
              px: 1.5, py: 1, borderRadius: 3,
              ...(m.from === 'me'
                ? { bgcolor: 'primary.main', color: 'primary.contrastText', borderStartStartRadius: 4 }
                : { bgcolor: (t: Theme) => alpha(t.palette.primary.main, 0.08), borderStartEndRadius: 4 }),
            }}
          >
            <Typography variant="body2" sx={{ textAlign: 'start' }}>{m.text}</Typography>
          </Box>
        ))}
        <Box ref={endRef} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ p: 1.5, pt: 0.5 }}>
        <TextField
          fullWidth size="small" value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
          placeholder="כתוב לאלפי…"
        />
        <IconButton color="primary" onClick={send} disabled={!draft.trim()} aria-label="שליחה">
          <SendRoundedIcon className="dir-icon" />
        </IconButton>
      </Stack>
    </Paper>
  );
}

const balloonBob = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
`;

/** "יש לי שאלה" bubble that grows into the chat — the teaching-assistant, only inside תרגול. */
export function AlfiWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <Box sx={{ display: { xs: 'none', md: 'block' }, width: '100%', position: 'relative' }}>
      {/* the bubble grows upward out of the same spot, so Alfi's head never moves */}
      <Box
        sx={{
          position: 'absolute', bottom: '100%', width: '100%', mb: 2,
          zIndex: (t) => t.zIndex.appBar,
          animation: chatOpen ? 'none' : `${balloonBob} 2.6s ease-in-out infinite`,
          '&:hover': { animationPlayState: 'paused' },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        {chatOpen ? (
          <AlfiChat onClose={() => setChatOpen(false)} />
        ) : (
          <Paper
            component="button"
            elevation={6}
            onClick={() => setChatOpen(true)}
            aria-label="שאלה כללית לאלפי"
            sx={{
              position: 'relative', width: '100%', textAlign: 'start',
              cursor: 'pointer', font: 'inherit', border: 0,
              borderRadius: 3, px: 2.5, py: 1.25,
              transition: (t) => t.transitions.create('box-shadow'),
              '&:hover': { boxShadow: 12 },
              '&::after': {
                content: '""', position: 'absolute', bottom: -12, insetInlineStart: 26,
                borderWidth: '13px 13px 0 13px', borderStyle: 'solid',
                borderColor: (t) => `${t.palette.background.paper} transparent transparent transparent`,
              },
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', whiteSpace: 'nowrap' }}>יש לי שאלה</Typography>
          </Paper>
        )}
      </Box>
      <Box sx={{ paddingInlineStart: 1.25 }}><AlfiAvatar size={64} /></Box>
    </Box>
  );
}

export function Shell({ active, title, children, hideSidebarRobot = false, minH = '100vh', bgLayer, alfi = false }: { active: Screen; title: string; children: ReactNode; hideSidebarRobot?: boolean; minH?: string; bgLayer?: ReactNode; alfi?: boolean }) {
  const navTo = useNav();
  const theme = useTheme();
  // green (v6) theme → use the green robot; purple (v5) → the purple one.
  const sidebarRobot = theme.palette.primary.main === green[700] ? 'alfi-green-body.png' : robotImg;
  const [confirmLogout, setConfirmLogout] = useState(false);
  return (
    <Box
      sx={{
        minHeight: minH,
        bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
        display: 'flex',
        justifyContent: 'center',
        p: { xs: 0, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: '100%', maxWidth: 1200, height: { xs: 'auto', md: `calc(${minH} - 64px)` }, borderRadius: { xs: 0, md: 4 }, overflow: 'hidden' }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Sidebar — first in RTL = right */}
          <Grid item md={3} lg={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper
              square
              elevation={0}
              sx={(t) => ({
                height: '100%',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                borderInlineStart: `1px solid ${t.palette.divider}`,
              })}
            >
              <Box sx={{ mb: 4 }}>
                <Logo variant="dark" size="large" />
              </Box>

              <List>
                {NAV.map((item) => (
                  <ListItemButton
                    key={item.label}
                    selected={item.screen === active}
                    onClick={() => item.screen && navTo.go(item.screen)}
                    sx={{
                      borderRadius: 4,
                      mb: 1.5,
                      py: 2,
                      px: 2.5,
                      bgcolor: 'transparent',
                      transition: (t) => t.transitions.create(['background-color', 'transform']),
                      '& .MuiListItemIcon-root': { color: 'text.disabled' },
                      '& .MuiSvgIcon-root': { fontSize: 30 },
                      '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.04), transform: 'scale(1.02)' },
                      '&.Mui-selected': { bgcolor: (t) => alpha(t.palette.primary.main, 0.12), color: 'primary.dark' },
                      '&.Mui-selected:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.18) },
                      '&.Mui-selected .MuiListItemText-primary': { fontWeight: 800 },
                      '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.main' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 46 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'subtitle1',
                        textAlign: 'start',
                        sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>

              {/* "יש לי שאלה" lives at the bottom of the sidebar, part of the chrome */}
              {alfi && (
                <Box sx={{ mt: 'auto', flexShrink: 0, pt: 3 }}>
                  <AlfiWidget />
                </Box>
              )}

              {SHOW_BOT && !hideSidebarRobot && (
                <Box sx={{ mt: 'auto', flexShrink: 0, pb: 3 }}>
                  <Box
                    component="img"
                    src={sidebarRobot}
                    alt="אלפי"
                    sx={{ width: 'calc(100% + 40px)', mx: -2.5, maxHeight: 576, objectFit: 'contain', display: 'block' }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Main */}
          <Grid item xs={12} md={9} lg={9} sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: { md: '100%' } }}>
            {/* Full-bleed background layer (covers header + content, no hard edges) */}
            {bgLayer}
            {/* Mobile top bar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center"
              sx={{ position: 'relative', zIndex: 1, display: { xs: 'flex', md: 'none' }, px: 2.5, py: 1.5 }}>
              <Logo variant="dark" size="small" />
              <IconButton aria-label="התנתקות" onClick={() => setConfirmLogout(true)}>
                <LogoutRoundedIcon className="dir-icon" />
              </IconButton>
            </Stack>

            {/* Header strip */}
            <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 4, md: 7 }, pt: { xs: 5, md: 7 }, pb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography variant="h4" component="h1"
                  sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, textWrap: 'balance' }}>
                  {title}
                </Typography>
                <IconButton aria-label="התנתקות" sx={{ display: { xs: 'none', md: 'inline-flex' } }} onClick={() => setConfirmLogout(true)}>
                  <LogoutRoundedIcon className="dir-icon" />
                </IconButton>
              </Stack>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ px: { xs: 2.5, md: 4 }, pb: { xs: 2.5, md: 3 }, pt: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {children}
                {/* Spacer so content clears the fixed mobile bottom nav */}
                <Box sx={{ height: { xs: 72, md: 0 }, flexShrink: 0 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Mobile bottom navigation */}
      <Paper
        elevation={3}
        sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', insetInline: '8px', bottom: '8px', zIndex: (t) => t.zIndex.appBar, borderRadius: 3, overflow: 'hidden' }}
      >
        <BottomNavigation showLabels value={NAV.findIndex((n) => n.screen === active)} sx={{
          borderRadius: 3,
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            // fills its slot edge to edge — the paper's own radius clips the corners
            borderRadius: 3,
            '& .MuiSvgIcon-root': { color: 'primary.contrastText' },
          },
        }}>
          {NAV.map((item) => (
            <BottomNavigationAction key={item.label} label={item.short} icon={item.icon} onClick={() => item.screen && navTo.go(item.screen)} />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Confirm before signing out */}
      <Dialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        PaperProps={{ sx: { borderRadius: 4, px: 1, py: 0.5, maxWidth: 380 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>להתנתק מאלפי?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center' }}>
            נצטרך להתחבר מחדש בכניסה הבאה. ההתקדמות שלך נשמרת.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmLogout(false)} variant="outlined" fullWidth sx={{ fontWeight: 700 }}>
            נשארים
          </Button>
          <Button onClick={() => { setConfirmLogout(false); navTo.go('login'); }} variant="contained" fullWidth startIcon={<LogoutRoundedIcon className="dir-icon" />} sx={{ fontWeight: 800 }}>
            התנתקות
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/** Placeholder screen: chrome + centered title, for screens not yet designed. */
export function EmptyScreen({ active, title }: { active: Screen; title: string }) {
  return (
    <Shell active={active} title={title}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.disabled' }}>{title}</Typography>
      </Box>
    </Shell>
  );
}
