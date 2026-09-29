import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';

export type Kind = 'תרגול' | 'בוחן';

/**
 * The one canonical task-kind icon. Every screen renders it through here so
 * תרגול / בוחן look identical everywhere — same glyph, size, and color.
 */
export function KindIcon({ kind }: { kind: Kind }) {
  return (
    <Avatar
      variant="rounded"
      aria-label={kind}
      sx={{
        // fixed on purpose: one size everywhere, no per-screen override.
        // 5.5 spacing units = 44px, and the glyph sits at the standard medium 24.
        width: (t) => t.spacing(5.5),
        height: (t) => t.spacing(5.5),
        flexShrink: 0,
        bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
        color: 'primary.main',
        '& svg': { fontSize: 24 },
      }}
    >
      {kind === 'בוחן' ? <TimerTwoToneIcon /> : <MenuBookTwoToneIcon />}
    </Avatar>
  );
}
