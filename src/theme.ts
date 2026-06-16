import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

// Canonical MUI theme, RTL. Primary uses MUI's built-in deepPurple palette.
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: deepPurple,
  },
});
