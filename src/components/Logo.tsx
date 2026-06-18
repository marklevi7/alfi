import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const FANCY = '"Fredoka", "Suez One", sans-serif';

type Props = {
  /** light text for dark/gradient backgrounds, dark for light backgrounds */
  variant?: 'light' | 'dark';
  /** show the small tagline under the wordmark */
  tagline?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
  sx?: SxProps<Theme>;
};

const sizes = {
  small: { circle: 40, alef: '1.4rem', word: '1.5rem', tag: 'caption' as const },
  medium: { circle: 56, alef: '2rem', word: '2.1rem', tag: 'caption' as const },
  large: { circle: 76, alef: '2.7rem', word: '2.9rem', tag: 'body2' as const },
  xl: { circle: 104, alef: '3.6rem', word: '4rem', tag: 'body1' as const },
};

export function Logo({ variant = 'dark', tagline = true, size = 'medium', sx }: Props) {
  const isLight = variant === 'light';
  const s = sizes[size];
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={sx}>
      {/* circle with the Hebrew letter Alef */}
      <Box
        sx={{
          width: s.circle,
          height: s.circle,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isLight ? 'common.white' : 'primary.main',
          color: isLight ? 'primary.main' : 'primary.contrastText',
          boxShadow: 2,
        }}
      >
        <Box
          component="span"
          sx={{ fontFamily: FANCY, fontWeight: 600, fontSize: s.alef, lineHeight: 1, mt: '-2px' }}
        >
          א
        </Box>
      </Box>

      <Box sx={{ textAlign: 'start' }}>
        <Typography
          component="span"
          sx={{
            display: 'block',
            fontFamily: FANCY,
            fontWeight: 600,
            fontSize: s.word,
            lineHeight: 1.05,
            color: isLight ? 'common.white' : 'primary.main',
          }}
        >
          אלפי
        </Typography>
        {tagline && (
          <Typography
            variant={s.tag}
            sx={{ opacity: 0.85, color: isLight ? 'common.white' : 'text.secondary' }}
          >
            הלמידה החכמה שמתאימה לכל תלמיד
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
