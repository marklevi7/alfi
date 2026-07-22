import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';

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
        // fixed on purpose: one size everywhere, no per-screen override
        width: 36,
        height: 36,
        flexShrink: 0,
        bgcolor: (t) => alpha(t.palette.primary.main, 0.14),
        color: 'primary.main',
        '& svg': { fontSize: 20 },
      }}
    >
      {kind === 'בוחן' ? <TimerRoundedIcon /> : <EditNoteRoundedIcon />}
    </Avatar>
  );
}
