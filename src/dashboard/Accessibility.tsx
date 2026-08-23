import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { Shell } from './Shell';

const DONE = [
  'ניווט מלא באמצעות מקלדת, עם סימון ברור של המיקום הנוכחי.',
  'תמיכה בתוכנות קוראות מסך: כותרות היררכיות, תוויות לשדות, וטקסט חלופי לתמונות.',
  'ניגודיות צבעים העומדת בדרישות התקן בכל הטקסטים והפקדים.',
  'גודל טקסט מינימלי של 15 פיקסלים בכל המסכים.',
  'אפשרות להגדיל את התצוגה עד 200% בלי לאבד מידע או פעולה.',
  'מתג לכיבוי האנימציות בתפריט הראשי.',
  'התאמות הנגישות מוטמעות בקוד המקור, ללא תוסף או סרגל נגישות.',
];

/** The fields only the operator can fill — left visibly empty on purpose. */
const TO_FILL = [
  ['שם הארגון המפעיל', '—'],
  ['רכז נגישות', '—'],
  ['טלפון', '—'],
  ['דוא״ל לפניות בנושא נגישות', '—'],
  ['תאריך עדכון ההצהרה', '—'],
];

export function Accessibility() {
  return (
    <Shell active="accessibility" title="הצהרת נגישות">
      <Paper variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 4 }, maxWidth: 800, mb: 3 }}>
        <Stack spacing={3}>
          <Typography variant="body1">
            אלפי היא מערכת לימוד מקוונת המיועדת לתלמידים, ואנחנו רואים חשיבות בכך שכל אחת
            ואחד יוכלו להשתמש בה באופן עצמאי ומלא.
          </Typography>

          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 1 }}>רמת הנגישות</Typography>
            <Typography variant="body1">
              המערכת הונגשה בהתאם לתקן הישראלי ת״י 5568 חלק 1, נגישות תכנים באינטרנט, המאמץ את
              הנחיות WCAG 2.0 ברמה A וברמה AA, ובהתאם לנוהל התאמות הנגישות והשמישות של משרד החינוך.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 1 }}>מה הונגש</Typography>
            <Stack component="ul" spacing={0.75} sx={{ m: 0, ps: 3 }}>
              {DONE.map((line) => (
                <Typography key={line} component="li" variant="body1">{line}</Typography>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 1 }}>פניות בנושא נגישות</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              נתקלתם בבעיה? נשמח לשמוע. אפשר לפנות אלינו בכל אחת מהדרכים האלה, ונחזור אליכם בהקדם.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.25}>
              {TO_FILL.map(([label, value]) => (
                <Stack key={label} direction="row" spacing={2} alignItems="baseline">
                  <Typography variant="body1" sx={{ fontWeight: 700, minWidth: 224 }}>{label}</Typography>
                  <Typography variant="body1" color="text.secondary">{value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Shell>
  );
}
