import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { VARIANTS } from './login/variants';

export function App() {
  const [i, setI] = useState(0);
  const prev = () => setI((v) => (v - 1 + VARIANTS.length) % VARIANTS.length);
  const next = () => setI((v) => (v + 1) % VARIANTS.length);
  const Current = VARIANTS[i].Comp;

  return (
    <Box>
      <Current />

      {/* Variant switcher */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 16,
          insetInlineStart: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1300,
          px: 1.5,
          py: 0.75,
          borderRadius: 999,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={prev} aria-label="פריסה קודמת" size="small">
            <ChevronRightIcon />
          </IconButton>

          <Select
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            size="small"
            variant="standard"
            disableUnderline
            sx={{ minWidth: 170, fontWeight: 700 }}
            aria-label="בחירת פריסה"
          >
            {VARIANTS.map((v, idx) => (
              <MenuItem key={v.name} value={idx}>
                {idx + 1}. {v.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 44, textAlign: 'center' }}>
            {i + 1}/{VARIANTS.length}
          </Typography>

          <IconButton onClick={next} aria-label="פריסה הבאה" size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Stack>
      </Paper>
    </Box>
  );
}
