import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';

// First-login popup: the student must accept the terms of use before using ALFI.
// Not dismissable — no backdrop/Esc close; the only way through is the CTA.
export function TermsDialog() {
  const [open, setOpen] = useState(true);
  const [agreed, setAgreed] = useState(false);
  // on a phone the terms take the whole screen instead of floating in a card
  const theme = useTheme();
  const phone = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      fullScreen={phone}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: phone ? 0 : 4, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 0.5 }}>
        ברוכים הבאים לאלפי! 👋
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary', mb: 2, textWrap: 'pretty' }}>
          לפני שמתחילים לתרגל, נשאר רק דבר אחד קטן: לאשר את תנאי השימוש.
        </Typography>
        <Box sx={{ maxHeight: 180, overflowY: 'auto' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
            {`1. אלפי היא מערכת לימוד ותרגול במתמטיקה לתלמידים.
2. השימוש במערכת מיועד ללמידה אישית בלבד.
3. ההתקדמות והתשובות שלך נשמרות כדי להתאים לך את התרגול.
4. המורה שלך יכולה לצפות בהתקדמות שלך במערכת.
5. אין לשתף את פרטי ההתחברות שלך עם אף אחד.
6. אנחנו שומרים על הפרטיות שלך בהתאם למדיניות הפרטיות.`}
          </Typography>
        </Box>
        <FormControlLabel
          sx={{ mt: 2 }}
          control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />}
          label={
            <Typography variant="body2">
              קראתי ואני מסכים/ה ל
              <Link href="#" underline="hover" sx={{ fontWeight: 700 }}>תנאי השימוש</Link>
              {' '}ול
              <Link href="#" underline="hover" sx={{ fontWeight: 700 }}>מדיניות הפרטיות</Link>
            </Typography>
          }
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={!agreed}
          onClick={() => setOpen(false)}
          sx={{ fontWeight: 800 }}
        >
          מאשר/ת, בואו נתחיל!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
