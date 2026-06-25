import { useState } from 'react';
import type { ReactNode } from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { useNav, type Screen } from '../nav';
import { Logo } from '../components/Logo';
import robotImg from './assets/magnific_3d-a-white-robot-with-pur_ONKIwE6ynm.png';

export { robotImg };

export const NAV = [
  { label: 'מסך ראשי', short: 'מסך ראשי', icon: <HomeTwoToneIcon />, screen: 'dashboard' as const },
  { label: 'תרגילים ובחנים', short: 'תרגילים', icon: <AssignmentTwoToneIcon />, screen: 'practice' as const },
  { label: 'הציונים שלי', short: 'הציונים שלי', icon: <AssessmentTwoToneIcon />, screen: 'analytics' as const },
  { label: 'היסטוריה', short: 'היסטוריה', icon: <HistoryTwoToneIcon />, screen: 'history' as const },
];

export function Shell({ active, title, children, hideSidebarRobot = false, minH = '90vh' }: { active: Screen; title: string; children: ReactNode; hideSidebarRobot?: boolean; minH?: string }) {
  const navTo = useNav();
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
        sx={{ width: '100%', maxWidth: 1200, borderRadius: { xs: 0, md: 4 }, overflow: 'hidden' }}
      >
        <Grid container sx={{ minHeight: { md: `calc(${minH} - 64px)` } }}>
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
                      borderRadius: 2,
                      mb: 1,
                      py: 1.25,
                      '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                      '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                      '&.Mui-selected .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        textAlign: 'start',
                        sx: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>

              {!hideSidebarRobot && (
                <Box sx={{ mt: 'auto', flexShrink: 0, pb: 3 }}>
                  <Box
                    component="img"
                    src={robotImg}
                    alt="אלפי"
                    sx={{ width: 'calc(100% + 40px)', mx: -2.5, maxHeight: 576, objectFit: 'contain', display: 'block' }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Main */}
          <Grid item xs={12} md={9} lg={9} sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Mobile top bar */}
            <Stack direction="row" justifyContent="space-between" alignItems="center"
              sx={{ display: { xs: 'flex', md: 'none' }, px: 2.5, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Logo variant="dark" size="small" />
              <IconButton aria-label="תפריט" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                <MenuRoundedIcon />
              </IconButton>
            </Stack>

            {/* Header strip */}
            <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 1.5, md: 2 }, display: 'flex', alignItems: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography variant="h4" component="h1"
                  sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '2rem' }, textWrap: 'balance' }}>
                  {title}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Tooltip title="התראות">
                    <IconButton aria-label="התראות">
                      <Badge color="error" variant="dot">
                        <NotificationsRoundedIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <IconButton aria-label="תפריט" sx={{ display: { xs: 'none', md: 'inline-flex' } }} onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MenuRoundedIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <MenuItem onClick={() => setMenuAnchor(null)}>
                      <ListItemIcon><SettingsTwoToneIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="הגדרות" primaryTypographyProps={{ fontWeight: 600 }} />
                    </MenuItem>
                    <MenuItem onClick={() => { setMenuAnchor(null); navTo.go('login'); }}>
                      <ListItemIcon><LogoutTwoToneIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="התנתקות" primaryTypographyProps={{ fontWeight: 600 }} />
                    </MenuItem>
                  </Menu>
                </Stack>
              </Stack>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ p: { xs: 2.5, md: 4 }, flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {children}
              {/* Spacer so content clears the fixed mobile bottom nav */}
              <Box sx={{ height: { xs: 72, md: 0 }, flexShrink: 0 }} />
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
