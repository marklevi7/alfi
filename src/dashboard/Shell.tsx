import { useState } from 'react';
import type { ReactNode } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useNav, type Screen } from '../nav';
import { Logo } from '../components/Logo';
import robotImg from './assets/magnific_3d-a-white-robot-with-pur_ONKIwE6ynm.png';

export { robotImg };

// Bot is hidden while it gets redesigned — flip to true to bring him back everywhere.
export const SHOW_BOT = false;

export const NAV = [
  { label: 'מסך ראשי', short: 'מסך ראשי', icon: <HomeRoundedIcon />, screen: 'dashboard' as const },
  { label: 'תרגילים ובחנים', short: 'תרגילים', icon: <AssignmentRoundedIcon />, screen: 'practice' as const },
  { label: 'תמונת מצב', short: 'תמונת מצב', icon: <HistoryRoundedIcon />, screen: 'history' as const },
];

export function Shell({ active, title, children, hideSidebarRobot = false, minH = '95vh', bgLayer }: { active: Screen; title: string; children: ReactNode; hideSidebarRobot?: boolean; minH?: string; bgLayer?: ReactNode }) {
  const navTo = useNav();
  const theme = useTheme();
  // green (v6) theme → use the green robot; purple (v5) → the purple one.
  const sidebarRobot = theme.palette.primary.main === green[700] ? 'alfi-green-body.png' : robotImg;
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
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
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        textAlign: 'start',
                        sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>

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
              <IconButton aria-label="תפריט" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MenuRoundedIcon />
              </IconButton>
            </Stack>

            {/* Header strip */}
            <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 4, md: 7 }, pt: { xs: 5, md: 7 }, pb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography variant="h4" component="h1"
                  sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, textWrap: 'balance' }}>
                  {title}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconButton aria-label="תפריט" sx={{ display: { xs: 'none', md: 'inline-flex' } }} onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MenuRoundedIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    slotProps={{ paper: { sx: { borderRadius: 3, mt: 1 } } }}
                    MenuListProps={{ sx: { py: 1 } }}
                  >
                    <MenuItem onClick={() => setMenuAnchor(null)} sx={{ py: 1.5, px: 3, minWidth: 220 }}>
                      <ListItemIcon sx={{ minWidth: 44 }}><SettingsRoundedIcon /></ListItemIcon>
                      <ListItemText primary="הגדרות" primaryTypographyProps={{ fontWeight: 600, fontSize: '1.05rem' }} />
                    </MenuItem>
                    <MenuItem onClick={() => { setMenuAnchor(null); navTo.go('login'); }} sx={{ py: 1.5, px: 3, minWidth: 220 }}>
                      <ListItemIcon sx={{ minWidth: 44 }}><LogoutRoundedIcon className="dir-icon" /></ListItemIcon>
                      <ListItemText primary="התנתקות" primaryTypographyProps={{ fontWeight: 600, fontSize: '1.05rem' }} />
                    </MenuItem>
                  </Menu>
                </Stack>
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
        sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', insetInline: '8px', bottom: '8px', zIndex: (t) => t.zIndex.appBar, borderRadius: 3 }}
      >
        <BottomNavigation showLabels value={NAV.findIndex((n) => n.screen === active)} sx={{
          borderRadius: 3,
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 3,
            mx: 0.5,
            '& .MuiSvgIcon-root': { color: 'primary.contrastText' },
          },
        }}>
          {NAV.map((item) => (
            <BottomNavigationAction key={item.label} label={item.short} icon={item.icon} onClick={() => item.screen && navTo.go(item.screen)} />
          ))}
        </BottomNavigation>
      </Paper>
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
