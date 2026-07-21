import { createTheme } from '@mui/material/styles';
import { deepPurple, green, teal } from '@mui/material/colors';

// Shared options both themes use (RTL, shape, dir-icon mirroring).
const base = {
  direction: 'rtl' as const,
  shape: { borderRadius: 8 },
  components: {
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
