import { createTheme } from '@mui/material/styles';
import { deepPurple, teal } from '@mui/material/colors';

// Canonical MUI theme, RTL. Primary uses MUI's built-in deepPurple palette.
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: deepPurple,
    success: teal,
  },
  shape: {
    borderRadius: 5,
  },
  components: {
    // RTL at the design-system level. Layout/spacing already flip via
    // stylis-plugin-rtl + logical props. Directional glyphs (arrows, chevrons)
    // do NOT auto-mirror, so author them in LTR-forward orientation and add
    // `className="dir-icon"` — the DS flips them in RTL. Screens never hand-roll
    // an arrow direction.
    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.direction === 'rtl' && {
            '&.dir-icon': { transform: 'scaleX(-1)' },
          }),
        }),
      },
    },
  },
});
