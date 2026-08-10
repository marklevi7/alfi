import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { green, amber, brown, grey } from '@mui/material/colors';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { AlfiAvatar } from './Shell';
import { KindIcon, type Kind } from './KindIcon';

// one question inside the summary: what the student wrote, and how it was scored
export type SummaryQuestion = {
  short: string;
  answer: string;          // replay of what the student wrote, one line per row
  points?: number;         // בוחן only — what they got
  outOf?: number;          // בוחן only — what it was worth
  status: 'done' | 'partial' | 'notStarted';
};

export type Summary = {
  title: string;
  kind: Kind;
  when: string;
  score?: number;          // בוחן only
  insight: string;         // תובנות AI — what went well, what didn't
  questions: SummaryQuestion[];
};

// the same numbered-line treatment the chat uses, so the replay reads identically
function NumberedAnswer({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim() !== '');
  return (
    <Stack spacing={0.25}>
      {lines.map((line, i) => (
        <Stack key={i} direction="row" spacing={1.25} alignItems="baseline">
          <Typography component="span" variant="caption" sx={{ minWidth: 16, textAlign: 'center', flexShrink: 0, opacity: 0.55, fontWeight: 700, fontFeatureSettings: '"tnum","lnum"' }}>
            {i + 1}
          </Typography>
          <Typography component="span" variant="body2" sx={{ textAlign: 'start', whiteSpace: 'pre-wrap' }}>{line}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

/** צפה בסיכום — the whole task or test in one place: AI insight, points, and the full replay. */
export function SummaryDialog({ summary, onClose }: { summary: Summary | null; onClose: () => void }) {
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  if (!summary) return null;
  const isTest = summary.kind === 'בוחן';

  return (
    <Dialog open onClose={onClose} fullScreen={phone} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: phone ? 0 : 4 } }}>
      <DialogTitle component="div" sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <KindIcon kind={summary.kind} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{summary.title}</Typography>
            <Typography variant="caption" color="text.secondary">{summary.when}</Typography>
          </Box>
          {isTest && summary.score != null && (
            <Box sx={{ px: 1.5, py: 0.75, borderRadius: 2, bgcolor: green[800], display: 'inline-flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
              <Typography component="span" sx={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, color: 'common.white', fontFeatureSettings: '"tnum","lnum"' }}>{summary.score}</Typography>
              <Typography component="span" sx={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1, color: 'common.white', opacity: 0.9 }}>ציון</Typography>
            </Box>
          )}
          <IconButton onClick={onClose} aria-label="סגירה"><CloseRoundedIcon /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {/* תובנות AI — one short read on the whole thing, straight from Alfi */}
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 3 }}>
          <AlfiAvatar size={40} />
          <Paper variant="outlined" sx={{ flex: 1, borderRadius: 3, p: 2, bgcolor: 'grey.100', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
              מה אלפי אומר
            </Typography>
            <Typography variant="body2" sx={{ textWrap: 'pretty' }}>{summary.insight}</Typography>
          </Paper>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* every question: score, state, and exactly what the student wrote */}
        <Stack spacing={2}>
          {summary.questions.map((q, i) => {
            const half = q.status === 'partial';
            const none = q.status === 'notStarted';
            return (
              <Paper key={i} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ rowGap: 1, mb: q.answer ? 1.5 : 0 }}>
                  <Box
                    sx={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontFeatureSettings: '"tnum","lnum"',
                      ...(q.status === 'done'
                        ? { bgcolor: green[600], color: 'common.white' }
                        : half
                        ? { border: 2, borderColor: amber[700], color: brown[900], bgcolor: 'background.paper', backgroundImage: `linear-gradient(to left, ${amber[300]} 50%, transparent 50%)` }
                        : { border: 2, borderColor: grey[400], color: 'text.secondary' }),
                    }}
                  >
                    {q.status === 'done' ? <CheckRoundedIcon sx={{ fontSize: 20 }} /> : i + 1}
                  </Box>
                  <Typography sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}>{q.short}</Typography>
                  {isTest && q.outOf != null && (
                    <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: 'nowrap', color: q.points === q.outOf ? green[800] : brown[900] }}>
                      {q.points} מתוך {q.outOf} נק׳
                    </Typography>
                  )}
                </Stack>

                {q.answer
                  ? <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 1.5 }}><NumberedAnswer text={q.answer} /></Box>
                  : none && <Typography variant="body2" color="text.secondary">לא נענתה.</Typography>}
              </Paper>
            );
          })}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ py: 1.25, fontWeight: 800 }}>
          חזרה לתמונת מצב
        </Button>
      </DialogActions>
    </Dialog>
  );
}
