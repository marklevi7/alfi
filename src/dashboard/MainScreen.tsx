import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import { grey } from '@mui/material/colors';
import { DashboardV5 } from './DashboardV5';
import { DashboardV7 } from './DashboardV7';

// A version can carry sub-dashboards (v7: full / no-grade / no-next-task states).
export type DashVariant = 'full' | 'noGrade' | 'noNext' | 'empty' | 'terms';
export type DashVersion = {
  label: string;
  Comp: (props: { variant?: DashVariant }) => JSX.Element;
  subs?: { label: string; variant: DashVariant }[];
};

// Only the two live directions are exposed: v7 (green, default) and v5 (purple).
// Older versions stay in the repo, just unlisted.
export const DASH_VERSIONS: DashVersion[] = [
  {
    label: 'v7',
    Comp: DashboardV7,
    subs: [
      { label: 'main screen 1', variant: 'full' },
      { label: 'main screen 2', variant: 'noGrade' },
      { label: 'main screen 3', variant: 'noNext' },
      { label: 'main screen 4', variant: 'empty' },
      { label: 'terms of use', variant: 'terms' },
    ],
  },
  {
    label: 'v5',
    Comp: DashboardV5,
    subs: [
      { label: 'main screen 1', variant: 'full' },
      { label: 'terms of use', variant: 'terms' },
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

/** Always-on-top switcher (dark, one line): version dropdown · divider · sub-dashboards. */
export type Device = 'desktop' | 'mobile';

export function VersionBar({ value, onChange, sub, onSubChange, onClose, device, onDeviceChange, screens, hideSubs }: { value: number; onChange: (i: number) => void; sub: number; onSubChange: (i: number) => void; onClose: () => void; device: Device; onDeviceChange: (d: Device) => void;
  // when the login screen is up, its own states replace the dashboard sub-screens
  screens?: { items: { label: string }[]; active: number; onPick: (i: number) => void };
  // the dashboard sub-screens mean nothing on תרגולים / תמונת מצב
  hideSubs?: boolean }) {
  const subs = screens || hideSubs ? undefined : DASH_VERSIONS[value].subs;
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ bgcolor: grey[900], px: 2, py: 1, position: 'sticky', top: 0, zIndex: (t) => t.zIndex.modal + 1 }}>
      <Select
        size="small"
        value={value}
        onChange={(e) => { onChange(Number(e.target.value)); onSubChange(0); }}
        sx={{
          minWidth: 84,
          fontWeight: 700,
          color: grey[100],
          '& .MuiOutlinedInput-notchedOutline': { borderColor: grey[700] },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: grey[500] },
          '& .MuiSvgIcon-root': { color: grey[400] },
        }}
      >
        {DASH_VERSIONS.map((ver, i) => (
          <MenuItem key={ver.label} value={i} sx={{ fontWeight: 700 }}>{ver.label}</MenuItem>
        ))}
      </Select>
      {(subs || screens) && <Divider orientation="vertical" flexItem sx={{ borderColor: grey[700] }} />}
      {screens?.items.map((s, i) => (
        <Button
          key={s.label}
          size="small"
          variant={i === screens.active ? 'contained' : 'outlined'}
          onClick={() => screens.onPick(i)}
          sx={barBtnSx(i === screens.active)}
        >
          {s.label}
        </Button>
      ))}
      {subs?.map((s, i) => (
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
      <Box sx={{ flex: 1 }} />
      {/* device preview toggle — leftmost cluster, next to close */}
      <IconButton size="small" onClick={() => onDeviceChange('desktop')} aria-label="תצוגת מחשב" sx={{ color: device === 'desktop' ? grey[100] : grey[500], '&:hover': { color: grey[100] } }}>
        <DesktopWindowsRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onDeviceChange('mobile')} aria-label="תצוגת מובייל" sx={{ color: device === 'mobile' ? grey[100] : grey[500], '&:hover': { color: grey[100] } }}>
        <SmartphoneRoundedIcon fontSize="small" />
      </IconButton>
      <Divider orientation="vertical" flexItem sx={{ borderColor: grey[700] }} />
      <IconButton size="small" onClick={onClose} aria-label="סגירת בקרות" sx={{ color: grey[400], '&:hover': { color: grey[100] } }}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
