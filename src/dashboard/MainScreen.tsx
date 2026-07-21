import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { DashboardV1 } from './DashboardV1';
import { DashboardV2 } from './DashboardV2';
import { DashboardV4 } from './DashboardV4';
import { DashboardV5 } from './DashboardV5';
import { DashboardV6 } from './DashboardV6';
import { Dashboard } from './Dashboard';

export const DASH_VERSIONS = [
  { label: 'v1', Comp: DashboardV1 },
  { label: 'v2', Comp: DashboardV2 },
  { label: 'v3', Comp: Dashboard },
  { label: 'v4', Comp: DashboardV4 },
  { label: 'v5', Comp: DashboardV5 },
  { label: 'v6', Comp: DashboardV6 },
];

/** Always-on-top version switcher bar (dark). */
export function VersionBar({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ bgcolor: grey[900], px: 2, py: 1, position: 'sticky', top: 0, zIndex: (t) => t.zIndex.modal + 1 }}
    >
      <Typography variant="caption" sx={{ color: grey[500], fontWeight: 700, me: 1 }}>גרסה</Typography>
      {DASH_VERSIONS.map((ver, i) => (
        <Button
          key={ver.label}
          size="small"
          variant={i === value ? 'contained' : 'outlined'}
          onClick={() => onChange(i)}
          sx={{
            minWidth: 48,
            borderRadius: 2,
            fontWeight: 700,
            ...(i === value
              ? {}
              : { color: grey[300], borderColor: grey[700], '&:hover': { borderColor: grey[500], bgcolor: 'transparent' } }),
          }}
        >
          {ver.label}
        </Button>
      ))}
    </Stack>
  );
}
