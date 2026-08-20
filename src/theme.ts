import { createTheme } from '@mui/material/styles';
import { deepPurple, green, teal, blue } from '@mui/material/colors';

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
  },
  components: {
    // Keyboard focus has to be visible (SI 5568 / WCAG 2.4.7). ButtonBase clears the
    // browser outline, so the design system puts a blue ring back — keyboard only,
    // so a mouse user never sees it. Blue, so it reads as a system state and never
    // as the brand green or purple.
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: `3px solid ${blue[700]}`,
            outlineOffset: 2,
          },
        },
      },
    },
    // The blue ring is the focus marker, so the grey wash behind a focused row
    // drops to the same weight as hover instead of MUI's heavier action.focus.
    // every button speaks in Fredoka, at its heaviest weight
    MuiButton: {
      styleOverrides: {
        root: {
          ...FREDOKA,
          // doubled selector so one weight wins over the per-screen sx values
          '&&': { fontWeight: 600 },
          // 18.8px is the smallest size that counts as "large text" once bold, which
          // drops the contrast bar from 4.5:1 to 3:1 and lets the brand green stay.
          fontSize: '1.175rem',
        },
        sizeSmall: { fontSize: '1.175rem' },
      },
    },
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
  palette: { primary: { light: green[400], main: green[700], dark: green[900] }, success: teal },
});
