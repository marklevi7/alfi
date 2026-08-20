import { createTheme } from '@mui/material/styles';
import { deepPurple, green, teal, blue } from '@mui/material/colors';

// The one design-system primitive we set by hand: MUI's green 700 is 4.12:1 against
// white, just under the 4.5:1 the standard asks for. This is the same green a shade
// darker — the lightest tone that passes. Everything green in the app reads from it.
export const GREEN = { ...green, 700: '#2E7E32' };

// every raw length in this file comes off MUI's own spacing scale
const defaultTheme = createTheme();

// Fredoka: the nav, the page titles and every button wear it. It stops at 700,
// so nothing wearing it asks for 800.
export const FREDOKA = { fontFamily: '"Fredoka", Roboto, Helvetica, Arial, sans-serif', letterSpacing: '0.02em' } as const;

// Shared options both themes use (RTL, shape, dir-icon mirroring).
const base = {
  direction: 'rtl' as const,
  shape: { borderRadius: 8 },
  // subtitle1 is the label token — nav items and other actionable labels use it,
  // so the size lives here instead of being hardcoded per screen.
  typography: {
    subtitle1: { fontSize: '1.25rem', fontWeight: 700 },
    // `button` is MUI's own token for button text — every button reads from it,
    // so the family, size, weight and spacing live here and nowhere else.
    button: { ...FREDOKA, fontWeight: 600, letterSpacing: '0.02857em' },
  },
  components: {
    // Keyboard focus has to be visible (SI 5568 / WCAG 2.4.7). ButtonBase clears the
    // browser outline, so the design system puts a blue ring back — keyboard only,
    // so a mouse user never sees it. Blue, so it reads as a system state and never
    // as the brand green or purple.
    MuiButtonBase: {
      // no pulsing circle when a key lands on a control — the ring says it already
      defaultProps: { focusRipple: false },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: `${defaultTheme.spacing(0.375)} solid ${blue[700]}`,
            outlineOffset: defaultTheme.spacing(0.25),
          },
        },
      },
    },
    // a keyboard-focused card shows the blue ring only — no grey wash over it
    MuiCardActionArea: {
      styleOverrides: {
        root: { '&.Mui-focusVisible .MuiCardActionArea-focusHighlight': { opacity: 0 } },
      },
    },
    // one weight for every button, over the per-screen sx values
    MuiButton: {
      styleOverrides: {
        root: ({ theme }: { theme: { palette: { text: { secondary: string } } } }) => ({
          '&&': { fontWeight: 600 },
          // a switched-off button still has to be readable
          '&.Mui-disabled': { color: theme.palette.text.secondary },
        }),
      },
    },
    // The blue ring is the focus marker, so the grey wash behind a focused row
    // drops to the same weight as hover instead of MUI's heavier action.focus.
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }: { theme: { palette: { action: { hover: string } } } }) => ({
          '&.Mui-focusVisible:not(.Mui-selected)': { backgroundColor: theme.palette.action.hover },
        }),
      },
    },
    // RTL at the design-system level. Layout/spacing already flip via
    // stylis-plugin-rtl + logical props. Directional glyphs (arrows, chevrons)
    // do NOT auto-mirror, so author them in LTR-forward orientation and add
    // `className="dir-icon"` — the DS flips them in RTL. Screens never hand-roll
    // an arrow direction.
    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }: { theme: { direction: string } }) => ({
          ...(theme.direction === 'rtl' && {
            '&.dir-icon': { transform: 'scaleX(-1)' },
          }),
        }),
      },
    },
  },
};

// v5 (and default): purple. v6: green. Same DS, only the primary hue differs.
export const theme = createTheme({ ...base, palette: { primary: deepPurple, success: teal } });
export const greenTheme = createTheme({
  ...base,
  palette: { primary: { light: green[400], main: GREEN[700], dark: green[900] }, success: teal },
});
