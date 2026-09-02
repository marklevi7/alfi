import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

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
import Fab from '@mui/material/Fab';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AnimationRoundedIcon from '@mui/icons-material/AnimationRounded';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import { green, lightGreen } from '@mui/material/colors';
import { visuallyHidden } from '@mui/utils';
import { useNav, type Screen } from '../nav';
import { useMotion } from '../motion';
import { FREDOKA, GREEN } from '../theme';
import { Logo } from '../components/Logo';
import robotImg from './assets/magnific_3d-a-white-robot-with-pur_ONKIwE6ynm.png';

export { robotImg };

// Bot is hidden while it gets redesigned — flip to true to bring him back everywhere.
export const SHOW_BOT = false;
/** The sidebar "יש לי שאלה" balloon and its phone twin. The same chat now opens
 *  from שאלה לאלפי inside the answer box, so this entry point is off. */
export const SHOW_SIDEBAR_ALFI = false;

// trying Fredoka on the nav and the page titles only — everything else keeps the default font.
// Fredoka stops at 700, so nothing wearing it asks for 800.
// the strip right above the scrolling content lifts off it once scrolling starts.
// the shade is painted by the strip itself, just under its bottom edge, so it never
// spills sideways over the logo or the sidebar the way a box-shadow would.
const liftSx = (on: boolean) => ({
  transition: (t: Theme) => t.transitions.create('background-color'),
  ...(on && { bgcolor: 'background.paper' }),
  '&::after': {
    // runs to the far rim of the page on the open side, and stops short of the
    // column edge on the side where the logo sits
    content: '""', position: 'absolute', insetInlineStart: { xs: 2.5, md: 4 }, insetInlineEnd: 0, top: '100%', height: (t: Theme) => t.spacing(1),
    pointerEvents: 'none', opacity: on ? 1 : 0,
    transition: (t: Theme) => t.transitions.create('opacity'),
    background: (t: Theme) => `linear-gradient(to bottom, ${t.palette.action.disabled}, ${alpha(t.palette.common.black, 0)})`,
  },
  '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&::after': { transition: 'none' } },
});

// one source of truth: the font token lives in the theme
export { FREDOKA };

export const NAV = [
  { label: 'מסך ראשי', short: 'מסך ראשי', icon: <HomeTwoToneIcon />, screen: 'dashboard' as const },
  { label: 'תרגולים ובחנים', short: 'תרגולים', icon: <AssignmentTwoToneIcon />, screen: 'practice' as const },
  { label: 'תמונת מצב', short: 'תמונת מצב', icon: <HistoryTwoToneIcon />, screen: 'history' as const },
];

// the real Alfi avatar — head shot, per theme version (green v7 / purple v5).
// neutral circle behind it: the PNG is transparent, and a tinted disc would read as a state color.
/** The app menu: the animation switch the Ministry asks for, and signing out. */
function AppMenu({ onLogout }: { onLogout: () => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const motion = useMotion();
  const nav = useNav();
  return (
    <>
      <IconButton aria-label="תפריט" aria-haspopup="true" onClick={(e) => setAnchor(e.currentTarget)}>
        <MenuRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { minWidth: 240, borderRadius: 3 } } }}
      >
        {/* the switch stays put when tapped — the menu is where you come to set it */}
        <MenuItem onClick={motion.toggle}>
          <ListItemIcon><AnimationRoundedIcon /></ListItemIcon>
          <ListItemText primary="אנימציות" />
          <Switch edge="end" size="small" checked={motion.on} inputProps={{ 'aria-label': 'אנימציות' }} />
        </MenuItem>
        {/* the law asks for this to sit in a fixed, obvious place */}
        <MenuItem onClick={() => { setAnchor(null); nav.go('accessibility'); }}>
          <ListItemIcon><AccessibilityNewRoundedIcon /></ListItemIcon>
          <ListItemText primary="הצהרת נגישות" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setAnchor(null); onLogout(); }}>
          <ListItemIcon><LogoutRoundedIcon className="dir-icon" /></ListItemIcon>
          <ListItemText primary="התנתקות" />
        </MenuItem>
      </Menu>
    </>
  );
}

/** The approved ALFI art. Three poses: waving hello, pointing at you, thumbs up.
 *  Each one is framed so the head lands in the middle of the circle. */
export const ALFI_POSE = {
  hi:    { src: 'alfi-hi.png',    scale: 1.2,  origin: '60% 50%' },
  point: { src: 'alfi-point.png', scale: 1.05, origin: '50% 42%' },
  ok:    { src: 'alfi-ok.png',    scale: 1.05, origin: '50% 42%' },
} as const;

/** One size and one background for every posed Alfi in the app. */
export const ALFI_SIZE = 56;
const ALFI_ART = 44 / ALFI_SIZE;   // the art keeps its old size inside the bigger circle

export function AlfiAvatar({ size = 40, pose }: { size?: number; pose?: keyof typeof ALFI_POSE }) {
  const theme = useTheme();
  if (pose) {
    const p = ALFI_POSE[pose];
    return (
      <Avatar
        src={p.src}
        alt="אלפי"
        sx={{
          width: ALFI_SIZE, height: ALFI_SIZE, flexShrink: 0,
          // no stop percentages: the RTL plugin rewrites them and breaks the ramp
          background: `linear-gradient(to bottom, ${green[500]}, ${lightGreen[500]})`,
          '& .MuiAvatar-img': { transform: `scale(${p.scale * ALFI_ART})`, transformOrigin: p.origin },
        }}
      />
    );
  }
  const src = theme.palette.primary.main === GREEN[700] ? 'alfi-green-head.png' : 'alfi.png';
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

export function AlfiChat({ onClose, full = false }: { onClose: () => void; full?: boolean }) {
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
      elevation={full ? 0 : 6}
      sx={{
        // the speech bubble itself, grown into a chat — same spot, same tail, above Alfi's head.
        // on a phone it takes the whole screen instead, so nothing behind it competes.
        position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        ...(full
          ? { height: '100%', borderRadius: 0 }
          : {
              height: 440, maxHeight: '60vh', borderRadius: 3,
              '&::after': {
                content: '""', position: 'absolute', bottom: -12, insetInlineStart: 26,
                borderWidth: '13px 13px 0 13px', borderStyle: 'solid',
                borderColor: (t) => `${t.palette.background.paper} transparent transparent transparent`,
              },
            }),
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 1.5, bgcolor: 'grey.100' }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: (t) => t.typography.h2.lineHeight }}>אלפי</Typography>
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
          inputProps={{ 'aria-label': 'הודעה לאלפי' }}
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
            <Typography variant="h6" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>יש לי שאלה</Typography>
          </Paper>
        )}
      </Box>
      <Box sx={{ paddingInlineStart: 1.25 }}><AlfiAvatar size={64} /></Box>
    </Box>
  );
}

/** Phone version of "יש לי שאלה": a small round button in the top bar.
 *  Alfi's face flips to a "?" three times, two seconds apart, and stays a "?". */
function AlfiMobileButton() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [question, setQuestion] = useState(false);
  useEffect(() => {
    // face → ? → face → ? → face → ? and stop: five turns, one every two seconds
    let turns = 0;
    const id = window.setInterval(() => {
      turns += 1;
      setQuestion((v) => !v);
      if (turns >= 5) window.clearInterval(id);
    }, 2000);
    return () => window.clearInterval(id);
  }, []);

  const face = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' } as const;
  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, flexShrink: 0 }}>
      <Fab
        size="small"
        aria-label="שאלה כללית לאלפי"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'grey.100' } }}
      >
        {/* two faces of one coin — it turns over instead of swapping */}
        <Box
          sx={{
            position: 'relative', width: 34, height: 34,
            transformStyle: 'preserve-3d',
            transform: question ? 'rotateY(180deg)' : 'none',
            transition: (t) => t.transitions.create('transform', { duration: 600, easing: t.transitions.easing.easeInOut }),
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        >
          <Box sx={face}><AlfiAvatar size={34} /></Box>
          <Box sx={{ ...face, transform: 'rotateY(180deg)' }}>
            <QuestionMarkRoundedIcon sx={{ fontSize: 24, color: 'primary.main' }} />
          </Box>
        </Box>
      </Fab>

      {/* on a phone the chat owns the whole screen — it covers everything behind it */}
      <Dialog fullScreen open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <AlfiChat onClose={() => setAnchor(null)} full />
      </Dialog>
    </Box>
  );
}

export function Shell({ active, title, children, hideSidebarRobot = false, minH = '100dvh', bgLayer, alfi = false, mobileBack, mobileHeader, headerAction }: { active: Screen; title: string; children: ReactNode; hideSidebarRobot?: boolean; minH?: string; bgLayer?: ReactNode; alfi?: boolean;
  // inner screens (a task or a test) show a plain back arrow on a phone instead of the wordmark
  mobileBack?: () => void;
  // sits in the header strip on desktop, inline with the sign-out button
  // rides in the phone's top bar beside the back arrow, where there is room to spare
  mobileHeader?: ReactNode;
  headerAction?: ReactNode }) {
  const navTo = useNav();
  const theme = useTheme();
  // green (v6) theme → use the green robot; purple (v5) → the purple one.
  const sidebarRobot = theme.palette.primary.main === GREEN[700] ? 'alfi-green-body.png' : robotImg;
  const [confirmLogout, setConfirmLogout] = useState(false);
  // the header lifts off the page once content starts sliding under it
  const [scrolled, setScrolled] = useState(false);
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
        sx={{ width: '100%', maxWidth: 1200, height: { xs: minH, md: `calc(${minH} - 64px)` }, borderRadius: { xs: 0, md: 4 }, overflow: 'hidden' }}
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
                      // label and icon always carry the same colour, in both states.
                      // text.secondary, not text.disabled: 5.7:1 on white, so it clears AA.
                      '& .MuiListItemIcon-root, & .MuiListItemText-primary': { color: 'text.secondary' },
                      '& .MuiSvgIcon-root': { fontSize: 30 },
                      '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.04), transform: 'scale(1.02)' },
                      // primary.main on the tinted pill is only 3.6:1 — primary.dark takes it to 6.8:1
                      '&.Mui-selected': { bgcolor: (t) => alpha(t.palette.primary.main, 0.12), color: 'primary.dark' },
                      '&.Mui-selected:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.18) },
                      // every item wears the same weight — the live one is told apart by colour alone
                      '&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary': { color: 'primary.dark' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 46 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'subtitle1',
                        // a menu name is not a chapter title — plain text, so the page
                        // outline a screen reader announces holds only real headings
                        component: 'span',
                        textAlign: 'start',
                        // trying Fredoka on the main nav only — the rest of the app keeps its font
                        sx: { ...FREDOKA, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>

              {/* "יש לי שאלה" lives at the bottom of the sidebar, part of the chrome */}
              {alfi && SHOW_SIDEBAR_ALFI && (
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
          <Grid item xs={12} md={9} lg={9} sx={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: '100%' }}>
            {/* Full-bleed background layer (covers header + content, no hard edges) */}
            {bgLayer}
            {/* Mobile top bar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center"
              spacing={1.5}
              sx={{ position: 'relative', zIndex: 2, display: { xs: 'flex', md: 'none' }, px: 2.5, py: 1.5, ...liftSx(scrolled && !title) }}>
              {mobileBack ? (
                <>
                  <IconButton aria-label="חזרה" onClick={mobileBack} sx={{ flexShrink: 0 }}>
                    <ArrowForwardRoundedIcon />
                  </IconButton>
                  {mobileHeader && <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>{mobileHeader}</Box>}
                  {/* Alfi sits at the far end of the bar — the corner a thumb reaches, out of the back button's way */}
                  {alfi && SHOW_SIDEBAR_ALFI && <AlfiMobileButton />}
                </>
              ) : (
                <>
                  {/* the wordmark takes the whole width of the bar, next to the sign-out button */}
                  <Logo variant="dark" size="small" sx={{ flex: 1, minWidth: 0, alignItems: 'stretch', '& svg': { width: '67%', height: 'auto', marginInlineStart: 'auto' } }} />
                  <AppMenu onLogout={() => setConfirmLogout(true)} />
                </>
              )}
            </Stack>

            {/* the page names itself even when the strip that would show it is hidden */}
            {!title && <Typography component="h1" sx={visuallyHidden}>{NAV.find((n) => n.screen === active)?.label ?? ''}</Typography>}

            {/* Header strip — a screen with no title (a task, a question) keeps its space back */}
            <Box sx={{
              position: 'relative', zIndex: 2, px: { xs: 2.5, md: 4 }, pt: { xs: 1.5, md: 3.5 }, pb: { xs: 2, md: 3 },
              display: title ? 'flex' : { xs: 'none', md: 'flex' }, alignItems: 'center',
              ...liftSx(scrolled),
            }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                {/* every screen carries a real page title. Screens that show no title on
                    the page still name themselves for a screen reader, off-screen. */}
                {/* the first slot always takes the width it can, so sign-out stays pinned
                    to the far end of the row even on a screen with no title */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {title ? (
                  <Typography variant="h4" component="h1"
                    sx={{ ...FREDOKA, fontWeight: 600, fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize }, textWrap: 'balance' }}>
                    {title}
                  </Typography>
                  ) : (
                  headerAction
                  )}
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                  <AppMenu onLogout={() => setConfirmLogout(true)} />
                </Box>
              </Stack>
            </Box>

            {/* Scrollable content */}
            <Box
              onScroll={(e) => setScrolled((e.target as HTMLElement).scrollTop > 0)}
              sx={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
            >
              {/* minHeight 0 lets a screen bound itself to the viewport instead of growing */}
              <Box sx={{ px: { xs: 2.5, md: 4 }, pb: { xs: 2.5, md: 3 }, pt: 0, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        // pinned to the bottom of the screen and above everything the page can draw;
        // a dialog still covers it
        sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', insetInline: '8px', bottom: '8px', zIndex: (t) => t.zIndex.drawer + 1, borderRadius: 3, overflow: 'hidden' }}
      >
        <BottomNavigation showLabels value={NAV.findIndex((n) => n.screen === active)} sx={{
          borderRadius: 3,
          // full nav names, same as desktop — they need to fit three across a phone
          '& .MuiBottomNavigationAction-root': { minWidth: 0, px: 0.5 },
          '& .MuiBottomNavigationAction-label': { ...FREDOKA, fontSize: (t: Theme) => t.typography.caption.fontSize, whiteSpace: 'nowrap' },
          '& .MuiBottomNavigationAction-label.Mui-selected': { fontSize: (t: Theme) => t.typography.caption.fontSize },
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            // fills its slot edge to edge — the paper's own radius clips the corners
            borderRadius: 3,
            '& .MuiSvgIcon-root': { color: 'primary.contrastText' },
          },
        }}>
          {NAV.map((item) => (
            <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} onClick={() => item.screen && navTo.go(item.screen)} />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Confirm before signing out */}
      <Dialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        PaperProps={{ sx: { borderRadius: 4, px: 1, py: 0.5, maxWidth: 384 } }}
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
