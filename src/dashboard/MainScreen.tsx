import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { DashboardV5 } from './DashboardV5';
import { DashboardV7 } from './DashboardV7';

// A version can carry sub-dashboards (v7: full / no-grade / no-next-task states).
export type DashVersion = {
  label: string;
  Comp: (props: { variant?: 'full' | 'noGrade' | 'noNext' | 'empty' }) => JSX.Element;
  subs?: { label: string; variant: 'full' | 'noGrade' | 'noNext' | 'empty' }[];
};

// Only the two live directions are exposed: v5 (purple) and v7 (green).
// Older versions stay in the repo, just unlisted.
export const DASH_VERSIONS: DashVersion[] = [
  { label: 'v5', Comp: DashboardV5 },
  {
    label: 'v7',
    Comp: DashboardV7,
    subs: [
      { label: 'dashboard1', variant: 'full' },
      { label: 'dashboard2', variant: 'noGrade' },
      { label: 'dashboard3', variant: 'noNext' },
      { label: 'dashboard4', variant: 'empty' },
    ],
  },
];

const barBtnSx = (selected: boolean) => ({
  minWidth: 48,
  borderRadius: 2,
  fontWeight: 700,
  ...(selected
    ? {}
    : { color: grey[300], borderColor: grey[700], '&:hover': { borderColor: grey[500], bgcolor: 'transparent' } }),
});

/** Always-on-top version switcher bar (dark). Second row = sub-dashboards of the active version. */
export function VersionBar({ value, onChange, sub, onSubChange }: { value: number; onChange: (i: number) => void; sub: number; onSubChange: (i: number) => void }) {
  const subs = DASH_VERSIONS[value].subs;
  return (
    <Stack sx={{ bgcolor: grey[900], px: 2, py: 1, position: 'sticky', top: 0, zIndex: (t) => t.zIndex.modal + 1 }} spacing={0.75}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="caption" sx={{ color: grey[500], fontWeight: 700, me: 1 }}>גרסה</Typography>
        {DASH_VERSIONS.map((ver, i) => (
          <Button
            key={ver.label}
            size="small"
            variant={i === value ? 'contained' : 'outlined'}
            onClick={() => { onChange(i); onSubChange(0); }}
            sx={barBtnSx(i === value)}
          >
            {ver.label}
          </Button>
        ))}
      </Stack>
      {subs && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" sx={{ color: grey[500], fontWeight: 700, me: 1 }}>מסך</Typography>
          {subs.map((s, i) => (
            <Button
              key={s.label}
              size="small"
              variant={i === sub ? 'contained' : 'outlined'}
              onClick={() => onSubChange(i)}
              sx={barBtnSx(i === sub)}
            >
              {s.label}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
