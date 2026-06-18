import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type Props = {
  /** light text for dark/gradient backgrounds, dark for light backgrounds */
  variant?: 'light' | 'dark';
  /** show the small tagline under the wordmark */
  tagline?: boolean;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
};

export function Logo({ variant = 'dark', tagline = true, size = 'medium', sx }: Props) {
  const isLight = variant === 'light';
  const avatarSize = size === 'small' ? 36 : 44;
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={sx}>
      <Avatar
        sx={{
          width: avatarSize,
          height: avatarSize,
          bgcolor: isLight ? 'common.white' : 'primary.main',
          color: isLight ? 'primary.main' : 'primary.contrastText',
        }}
      >
        <AutoAwesomeIcon fontSize={size === 'small' ? 'small' : 'medium'} />
      </Avatar>
      <Box sx={{ textAlign: 'start' }}>
        <Typography
          variant={size === 'small' ? 'subtitle1' : 'h6'}
          sx={{ fontWeight: 800, lineHeight: 1.1, color: isLight ? 'common.white' : 'primary.main' }}
        >
          אלפי
        </Typography>
        {tagline && (
          <Typography variant="caption" sx={{ opacity: 0.85, color: isLight ? 'common.white' : 'text.secondary' }}>
            הלמידה החכמה שמתאימה לכל תלמיד
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
