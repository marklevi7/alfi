import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { alpha, keyframes } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Portal from '@mui/material/Portal';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { deepPurple, blue, cyan, amber, brown, green, red, pink, grey } from '@mui/material/colors';
import { GREEN } from '../theme';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CalculateRoundedIcon from '@mui/icons-material/CalculateRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import KeyboardHideRoundedIcon from '@mui/icons-material/KeyboardHideRounded';
import BackspaceRoundedIcon from '@mui/icons-material/BackspaceRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
// the dialog still shows a real QR to scan — only the button wears the camera
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FolderTwoToneIcon from '@mui/icons-material/FolderTwoTone';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone';
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import { Shell, AlfiAvatar, FREDOKA } from './Shell';
import { GradePill } from './Practice';

// to = deadline; null means the teacher set no deadline (open-ended practice).
export type SolveTask = { id: number; title: string; total: number; solved: number; from: string; to: string | null; grade?: number; kind?: 'תרגול' | 'בוחן' };

// '29 ביוני 2026' → ', יום שני' (empty string when the date can't be parsed)
const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const HE_DAYS = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'];
function hebrewWeekday(dateStr: string): string {
  const m = dateStr.match(/^(\d{1,2}) ב(.+) (\d{4})$/);
  if (!m) return '';
  const month = HE_MONTHS.indexOf(m[2]);
  if (month === -1) return '';
  return `, ${HE_DAYS[new Date(Number(m[3]), month, Number(m[1])).getDay()]}`;
}

/* ---------- tiny math renderer (no external lib) ---------- */
function Frac({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', mx: 0.5, lineHeight: (t: Theme) => t.typography.h1.lineHeight }}>
      <Box component="span" sx={{ px: 0.5 }}>{n}</Box>
      <Box component="span" sx={{ px: 0.5, borderTop: `1.5px solid currentColor`, width: '100%', textAlign: 'center' }}>{d}</Box>
    </Box>
  );
}
const Eq = ({ children }: { children: ReactNode }) => (
  <Box component="span" sx={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: '1.15em', whiteSpace: 'nowrap' }}>{children}</Box>
);

type Turn = { title?: string; body: ReactNode };
// one round of the back-and-forth: what the student sent, and what Alfi answered
type PriorTurn = { answer: string; reply: ReactNode };
// solution is an array of lines — each gets a grey number so the AI can be asked about a specific line
type Question = { points: number; short: string; prompt: ReactNode; guide: Turn; solution: ReactNode[]; sampleAnswer?: string;
  // plain-text full solution — the secret click drops it straight into the answer box
  solutionText?: string;
  // demo: the first submission is treated as wrong and Alfi replies with this hint
  wrongHint?: ReactNode;
  // a half-solved question opens with this earlier attempt already in the chat, plus Alfi's correction
  priorAttempt?: string;
  // a long question opens with a whole conversation already behind it — attempt after attempt
  priorTurns?: PriorTurn[] };

/* ---------- question 3: the long conversation ----------
   The full solution, and the ten submissions that led up to it. Each try is the
   solution cut off at a line, with the lines the student got wrong swapped in —
   so every correction Alfi gives points at a line that really is wrong. */
const Q3_SOLUTION = [
  'א. תחום הגדרה: המכנה x²−9 מתאפס כאשר x=3 או x=−3',
  'לכן תחום ההגדרה: כל x ממשי פרט ל-x=3 ו-x=−3',
  'ב. חיתוך עם ציר x: המונה x²−4x=0',
  'x(x−4)=0 ולכן x=0 או x=4',
  'הנקודות: (0,0) ו-(4,0)',
  'חיתוך עם ציר y: מציבים x=0 ומקבלים y=0, אותה נקודה (0,0)',
  'ג. אסימפטוטות אנכיות: x=3 ו-x=−3',
  'סביב x=3: משמאל y שואף ל-+∞, מימין y שואף ל-−∞',
  'סביב x=−3: משמאל y שואף ל-+∞, מימין y שואף ל-−∞',
  'אסימפטוטה אופקית: מקדמי x² שווים במונה ובמכנה, לכן y=1',
  'ד. נגזרת: y′ = (4x²−18x+36)/(x²−9)²',
  'הדיסקרימינטה של המונה שלילית, לכן המונה לא מתאפס',
  'מכאן שאין נקודות קיצון',
  'ה. y′ חיובית בכל תחום ההגדרה',
  'לכן הפונקציה עולה בכל אחד משלושת הקטעים',
  'הסקיצה: שני ענפים עולים בין האסימפטוטות ועוד ענף עולה מימין ל-x=3',
];

const Q3_TRIES: { upto: number; bad?: [number, string][]; reply: ReactNode }[] = [
  {
    upto: 2,
    bad: [[1, 'א. תחום הגדרה: המכנה x²−9 מתאפס כאשר x=3'], [2, 'לכן תחום ההגדרה: כל x ממשי פרט ל-x=3']],
    reply: <>התחלה טובה. ב<b>שורה 1</b> — למשוואה x²−9=0 יש שני פתרונות, לא אחד. מה הפתרון השני?</>,
  },
  {
    upto: 4,
    bad: [[4, 'ולכן x=4']],
    reply: <>סעיף א׳ נכון עכשיו. ב<b>שורה 4</b> — הוצאת גורם משותף: x(x−4)=0. כמה פתרונות יש למכפלה שמתאפסת?</>,
  },
  {
    upto: 6,
    bad: [[6, 'חיתוך עם ציר y: אין חיתוך עם ציר y']],
    reply: <>שתי הנקודות נכונות. ב<b>שורה 6</b> — כדי למצוא חיתוך עם ציר y מציבים x=0 בפונקציה. מה מקבלים?</>,
  },
  {
    upto: 8,
    bad: [[7, 'ג. אסימפטוטה אנכית: x=3'], [8, 'אסימפטוטה אופקית: y=0']],
    reply: <>שתי הערות: ב<b>שורה 7</b> המכנה מתאפס בשתי נקודות, לא באחת. ב<b>שורה 8</b> — כשהחזקה הגבוהה במונה ובמכנה שווה, האסימפטוטה האופקית היא היחס בין המקדמים.</>,
  },
  {
    upto: 10,
    bad: [[8, 'סביב x=3: משמאל y שואף ל-−∞, מימין y שואף ל-+∞']],
    reply: <>האסימפטוטות נכונות. ב<b>שורה 8</b> — הצב x=2.9 ואחר כך x=3.1 ובדוק את הסימן בכל צד. יצא לך הפוך.</>,
  },
  {
    upto: 10,
    bad: [[9, 'סביב x=−3: משמאל y שואף ל-−∞, מימין y שואף ל-+∞']],
    reply: <>שורה 8 מתוקנת, יפה. עכשיו ב<b>שורה 9</b> — עשה בדיוק את אותה בדיקה עם x=−3.1 ועם x=−2.9.</>,
  },
  {
    upto: 11,
    bad: [[11, 'ד. נגזרת: y′ = (2x−4)/(2x)']],
    reply: <>ב<b>שורה 11</b> — אי אפשר לגזור מונה ומכנה בנפרד. השתמש בכלל המנה: (u/v)′ = (u′v − uv′)/v².</>,
  },
  {
    upto: 13,
    bad: [[12, 'הדיסקרימינטה של המונה חיובית, לכן המונה מתאפס'], [13, 'נקודות קיצון: x=1.5 ו-x=3']],
    reply: <>הנגזרת נכונה עכשיו. ב<b>שורה 12</b> — חשב שוב: 18² − 4·4·36 = −252. מה זה אומר על מספר הפתרונות?</>,
  },
  {
    upto: 15,
    bad: [[14, 'ה. y′ שלילית בכל תחום ההגדרה'], [15, 'לכן הפונקציה יורדת בכל אחד משלושת הקטעים']],
    reply: <>מצוין, אין נקודות קיצון. ב<b>שורה 14</b> — הצב x=0 בנגזרת ובדוק איזה סימן יוצא.</>,
  },
  {
    upto: 16,
    bad: [[16, 'הסקיצה: הגרף עולה לאורך כל הישר הממשי']],
    reply: <>כמעט סיימת! ב<b>שורה 16</b> — הפונקציה לא מוגדרת ב-x=3 וב-x=−3, אז אי אפשר לומר "כל הישר". תאר את הגרף לפי שלושת הקטעים ושלח שוב.</>,
  },
];

const Q3_PRIOR: PriorTurn[] = Q3_TRIES.map((t) => {
  const lines = Q3_SOLUTION.slice(0, t.upto);
  t.bad?.forEach(([n, text]) => { lines[n - 1] = text; });
  return { answer: lines.join('\n'), reply: t.reply };
});

const QUESTIONS: Question[] = [
  {
    points: 20, short: 'חקירת פונקציה מלאה',
    prompt: <>נתונה הפונקציה <Eq>y = <Frac n={<>√(x²−1)</>} d={<>x−2</>} /></Eq>. ערוך חקירה מלאה: תחום הגדרה, נגזרת, אסימפטוטות, נקודות קיצון, ותחומי עלייה וירידה.</>,
    guide: { title: 'חקירה מלאה כוללת 5 שלבים', body: <>1. תחום הגדרה  2. נגזרת  3. אסימפטוטות  4. נקודות קיצון  5. תחומי עלייה וירידה.<br />נתחיל מהתחלה — <b>מה תחום ההגדרה לדעתך?</b></> },
    solution: [
      <><b>תחום הגדרה:</b> x²−1 ≥ 0 וגם x ≠ 2, לכן x ≤ −1 או x ≥ 1, x ≠ 2.</>,
      <><b>אסימפטוטות:</b> אנכית x = 2; אופקיות y = 1 (כאשר x → ∞) ו-y = −1 (כאשר x → −∞).</>,
      <><b>נגזרת ונקודות קיצון:</b> הנגזרת שלילית בכל התחום — אין נקודות קיצון.</>,
      <><b>עלייה וירידה:</b> הפונקציה יורדת בכל תחום ההגדרה.</>,
    ],
    solutionText: [
      'תחום הגדרה: x²−1 ≥ 0 וגם x ≠ 2, לכן x ≤ −1 או x ≥ 1, x ≠ 2',
      'אסימפטוטה אנכית: x = 2',
      'אסימפטוטות אופקיות: y = 1 כאשר x → ∞, ו-y = −1 כאשר x → −∞',
      'הנגזרת שלילית בכל התחום, לכן אין נקודות קיצון',
      'הפונקציה יורדת בכל תחום ההגדרה',
    ].join('\n'),
  },
  {
    points: 20, short: 'תחום הגדרה',
    prompt: <>מצא את תחום ההגדרה של הפונקציה <Eq>y = <Frac n={<>√x</>} d={<>x−9</>} /></Eq>.</>,
    guide: { body: <>לתחום צריך שני תנאים <b>בנפרד</b>: השורש חייב להיות ≥ 0, והמכנה ≠ 0. <b>מה יוצא מהתנאי הראשון?</b></> },
    solution: [
      <>מהשורש: x ≥ 0. מהמכנה: x − 9 ≠ 0 ולכן x ≠ 9.</>,
      <><b>תחום ההגדרה:</b> x ≥ 0 וגם x ≠ 9.</>,
    ],
    solutionText: [
      'מהשורש: x ≥ 0',
      'מהמכנה: x − 9 ≠ 0 ולכן x ≠ 9',
      'תחום ההגדרה: x ≥ 0 וגם x ≠ 9',
    ].join('\n'),
    priorAttempt: [
      'מהשורש: x > 0',
      'מהמכנה: x − 9 ≠ 0 ולכן x ≠ 9',
      'תחום ההגדרה: x > 0 וגם x ≠ 9',
    ].join('\n'),
  },
  {
    points: 30, short: 'חקירה מלאה עם אסימפטוטות',
    prompt: <>נתונה הפונקציה <Eq>y = <Frac n={<>x² − 4x</>} d={<>x² − 9</>} /></Eq>.<br />א. מצא את תחום ההגדרה.<br />ב. מצא את נקודות החיתוך עם הצירים.<br />ג. מצא את כל האסימפטוטות (אנכיות ואופקית) והסבר כיצד הפונקציה מתנהגת משני צידי כל אסימפטוטה אנכית.<br />ד. חשב את הנגזרת ומצא נקודות קיצון.<br />ה. קבע את תחומי העלייה והירידה וסרטס סקיצה של הגרף.</>,
    guide: { body: <>נתחיל בסדר: קודם תחום הגדרה (המכנה ≠ 0), אחר כך חיתוכים, ואז אסימפטוטות. <b>מה תחום ההגדרה?</b></> },
    solution: [
      <><b>תחום הגדרה:</b> x² − 9 ≠ 0 ולכן x ≠ 3 וגם x ≠ −3.</>,
      <><b>חיתוך עם ציר x:</b> x² − 4x = 0 → x(x−4) = 0 → (0, 0) ו-(4, 0).</>,
      <><b>חיתוך עם ציר y:</b> x = 0 נותן y = 0, כלומר אותה נקודה (0, 0).</>,
      <><b>אסימפטוטות אנכיות:</b> x = 3 ו-x = −3 (המכנה מתאפס והמונה שונה מאפס).</>,
      <><b>התנהגות סביב x = 3:</b> משמאל y → +∞, מימין y → −∞.</>,
      <><b>התנהגות סביב x = −3:</b> משמאל y → +∞, מימין y → −∞.</>,
      <><b>אסימפטוטה אופקית:</b> מקדמי x² שווים, לכן y = 1.</>,
      <><b>נגזרת:</b> y′ = (4x² − 18x + 36) / (x² − 9)².</>,
      <><b>נקודות קיצון:</b> המונה 4x² − 18x + 36 חסר שורשים ממשיים, לכן אין נקודות קיצון.</>,
      <><b>עלייה וירידה:</b> y′ &gt; 0 בכל תחום ההגדרה — הפונקציה עולה בכל אחד משלושת הקטעים.</>,
    ],
    sampleAnswer: Q3_SOLUTION.join('\n'),
    get solutionText() { return this.sampleAnswer; },
    // ten attempts already behind the student — the long-page case
    priorTurns: Q3_PRIOR,
  },
  {
    points: 20, short: 'תחום, נגזרת וקיצון',
    prompt: <>נתונה <Eq>y = <Frac n={<>x</>} d={<>√(x²−9)</>} /></Eq>. מצא את תחום ההגדרה, חשב את הנגזרת, ומצא נקודות קיצון אם קיימות.</>,
    guide: { body: <>נתחיל מהתחום: הביטוי תחת השורש חייב להיות חיובי <b>ממש</b>. <b>מה אי-השוויון שצריך לפתור?</b></> },
    sampleAnswer: ['תחום הגדרה: x²−9 ≥ 0', 'לכן x ≤ −3 או x ≥ 3'].join('\n'),
    wrongHint: <>כמעט! שים לב לשורה <b>1</b>: כתבת x²−9 ≥ 0, אבל השורש נמצא <b>במכנה</b> — אסור שהוא יתאפס.<br />לכן צריך <b>אי-שוויון חזק</b>: x²−9 &gt; 0. <b>מה יוצא עכשיו בשורה 2?</b></>,
    solution: [
      <><b>תחום הגדרה:</b> x²−9 &gt; 0 ולכן x &lt; −3 או x &gt; 3.</>,
      <><b>נגזרת:</b> y′ = −9 / (x²−9)^(3/2).</>,
      <><b>קיצון:</b> הנגזרת שלילית בכל התחום — אין נקודות קיצון.</>,
    ],
    solutionText: [
      'תחום הגדרה: x²−9 > 0 ולכן x < −3 או x > 3',
      'נגזרת: y′ = −9 / (x²−9)^(3/2)',
      'הנגזרת שלילית בכל התחום, לכן אין נקודות קיצון',
    ].join('\n'),
  },
  {
    points: 40, short: 'שאלה מורכבת — בעיית תנועה וחקירה',
    // the A4-length edge case: a full-page, multi-part question
    prompt: <>
      חברת הסעות מפעילה קו בין שתי ערים. המרחק בין הערים הוא 240 ק״מ.
      אוטובוס יצא מהעיר א׳ לעיר ב׳ במהירות קבועה. שעה לאחר מכן יצא מהעיר א׳ רכב פרטי באותו מסלול,
      במהירות הגדולה ב-20 קמ״ש ממהירות האוטובוס. הרכב הגיע לעיר ב׳ שעה אחת לפני האוטובוס.
      <br /><br />
      א. סמן ב-<Eq>x</Eq> את מהירות האוטובוס בקמ״ש, ובטא באמצעות <Eq>x</Eq> את זמן הנסיעה של האוטובוס ואת זמן הנסיעה של הרכב.
      <br />
      ב. הרכב את המשוואה המתאימה לנתוני השאלה ופתור אותה. מצא את מהירות האוטובוס ואת מהירות הרכב.
      <br />
      ג. כמה זמן נסע כל אחד מכלי הרכב? הצג את התשובה בשעות ובדקות.
      <br /><br />
      בהמשך, מחיר ההסעה לנוסע יחיד מתואר על ידי הפונקציה <Eq>P(x) = <Frac n={<>1200</>} d={<>x − 10</>} /> + 8</Eq>,
      כאשר <Eq>x</Eq> הוא מספר הנוסעים באוטובוס (<Eq>x &gt; 10</Eq>), ו-<Eq>P</Eq> הוא המחיר בשקלים.
      <br /><br />
      ד. מצא את תחום ההגדרה של הפונקציה <Eq>P(x)</Eq> בהקשר של הבעיה, והסבר מדוע.
      <br />
      ה. מצא את האסימפטוטות של הפונקציה והסבר את המשמעות שלהן במונחים של הבעיה.
      <br />
      ו. חשב את הנגזרת <Eq>P′(x)</Eq> וקבע האם הפונקציה עולה או יורדת בתחום ההגדרה.
      <br />
      ז. כמה נוסעים צריכים להיות באוטובוס כדי שמחיר ההסעה לנוסע יהיה לכל היותר 20 ש״ח?
      <br />
      ח. סרטט סקיצה של גרף הפונקציה בתחום הרלוונטי, וסמן עליה את התשובה לסעיף ז׳.
    </>,
    guide: { body: <>נתחיל מסעיף א׳: סמן את מהירות האוטובוס ב-<Eq>x</Eq>. <b>מה זמן הנסיעה של האוטובוס במונחי x?</b></> },
    solution: [
      <><b>א.</b> זמן האוטובוס: 240/x שעות. מהירות הרכב: x+20, זמן הרכב: 240/(x+20) שעות.</>,
      <><b>ב.</b> הרכב יצא שעה אחרי והגיע שעה לפני, לכן 240/x − 240/(x+20) = 2.</>,
      <><b>ב. פתרון:</b> x² + 20x − 2400 = 0 → x = 40. מהירות האוטובוס 40 קמ״ש, הרכב 60 קמ״ש.</>,
      <><b>ג.</b> האוטובוס נסע 6 שעות, הרכב נסע 4 שעות.</>,
      <><b>ד.</b> תחום ההגדרה: x &gt; 10, כי מספר הנוסעים חייב להיות גדול מ-10 והמכנה לא מתאפס.</>,
      <><b>ה.</b> אסימפטוטה אנכית x = 10 (ככל שמתקרבים ל-10 נוסעים המחיר מזנק), אופקית P = 8 (המחיר המינימלי לנוסע).</>,
      <><b>ו.</b> P′(x) = −1200/(x−10)² &lt; 0 — הפונקציה יורדת: ככל שיש יותר נוסעים המחיר יורד.</>,
      <><b>ז.</b> 1200/(x−10) + 8 ≤ 20 → x ≥ 110. צריך לפחות 110 נוסעים.</>,
      <><b>ח.</b> הגרף יורד מהאסימפטוטה x=10 ומתקרב ל-P=8; הנקודה (110, 20) מסומנת על הגרף.</>,
    ],
    solutionText: [
      'א. זמן האוטובוס: 240/x שעות',
      'מהירות הרכב: x+20, זמן הרכב: 240/(x+20) שעות',
      'ב. הרכב יצא שעה אחרי והגיע שעה לפני, לכן 240/x − 240/(x+20) = 2',
      'x² + 20x − 2400 = 0 ולכן x = 40',
      'מהירות האוטובוס 40 קמ״ש, מהירות הרכב 60 קמ״ש',
      'ג. האוטובוס נסע 6 שעות, הרכב נסע 4 שעות',
      'ד. תחום ההגדרה: x > 10, כי מספר הנוסעים גדול מ-10 והמכנה לא מתאפס',
      'ה. אסימפטוטה אנכית x = 10 — ככל שמתקרבים ל-10 נוסעים המחיר מזנק',
      'אסימפטוטה אופקית P = 8 — המחיר המינימלי לנוסע',
      'ו. P′(x) = −1200/(x−10)² < 0, הפונקציה יורדת: יותר נוסעים = מחיר נמוך יותר',
      'ז. 1200/(x−10) + 8 ≤ 20 ולכן x ≥ 110, צריך לפחות 110 נוסעים',
      'ח. הגרף יורד מהאסימפטוטה x=10 ומתקרב ל-P=8, והנקודה (110, 20) מסומנת עליו',
    ].join('\n'),
  },
];

/* ---------- confetti: ONE shared component for every celebration in the app ---------- */
const CONFETTI = [deepPurple[400], blue[400], cyan[400], amber[400], green[400], pink[400], red[400], amber[600]];
const burst = keyframes`
  0%   { transform: translate(0,0) rotate(0deg) scale(0.6); opacity: 1; }
  15%  { transform: translate(calc(var(--dx) * 0.25), calc(var(--dy) * 0.55)) rotate(calc(var(--rot) * 0.3)) scale(1.2); opacity: 1; }
  100% { transform: translate(var(--dx), calc(var(--dy) * -0.4)) rotate(var(--rot)) scale(1); opacity: 0; }
`;
/** Big game-style confetti burst. Fills its positioned parent; harmless when reduced-motion is on. */
export function Confetti({ pieces = 80 }: { pieces?: number }) {
  return (
    <Box aria-hidden data-keep-motion sx={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 4 }}>
      {Array.from({ length: pieces }).map((_, i) => {
        const dx = (i % 2 ? 1 : -1) * (60 + (i * 37) % 520);
        const dy = -180 - (i * 53) % 420;
        const rot = 360 + (i * 97) % 900;
        const c = CONFETTI[i % CONFETTI.length];
        const w = 14 + (i % 4) * 6;
        const h = i % 3 === 0 ? w : Math.round(w * 0.5);
        const round = i % 4 === 1;
        return (
          <Box key={i} sx={{
            position: 'absolute', top: '45%', left: '50%',
            width: w, height: h, borderRadius: round ? '50%' : 0.75, bgcolor: c,
            ['--dx' as string]: `${dx}px`, ['--dy' as string]: `${dy}px`, ['--rot' as string]: `${rot}deg`,
            animation: `${burst} ${1600 + (i % 6) * 220}ms cubic-bezier(0.18, 0.9, 0.3, 1) ${(i % 5) * 70}ms forwards`,
            '@media (prefers-reduced-motion: reduce)': { display: 'none' },
          }} />
        );
      })}
    </Box>
  );
}

/* ---------- formula picker + QR dialogs ---------- */
// A real math keypad: opens beside the answer box and STAYS open, so the student can
// type on the keyboard and tap symbols at the same time. No modal, nothing blocked.
// symbols only — digits come from the keyboard, which stays usable the whole time
/* ---------- math keypad ----------
   The keys are content, not code: edit KEYS to change what a topic offers.
   The first 12 are the small pad; all 20 are the big one. No digits, no lim,
   no plus and no equals — the student types those. Division is a real fraction. */
type PadKey = { label: ReactNode; insert: string; aria: string };

const KEYS: PadKey[] = [
  // the 12 that every topic needs
  { label: '−', insert: '−', aria: 'מינוס' },
  { label: '×', insert: '×', aria: 'כפל' },
  { label: <Frac n="a" d="b" />, insert: '/', aria: 'שבר' },
  { label: '√', insert: '√', aria: 'שורש' },
  { label: 'x²', insert: 'x²', aria: 'בריבוע' },
  { label: 'xⁿ', insert: '^', aria: 'בחזקת' },
  { label: '(', insert: '(', aria: 'סוגר פותח' },
  { label: ')', insert: ')', aria: 'סוגר סוגר' },
  { label: '≠', insert: '≠', aria: 'שונה מ' },
  { label: '≤', insert: '≤', aria: 'קטן או שווה' },
  { label: '≥', insert: '≥', aria: 'גדול או שווה' },
  { label: 'π', insert: 'π', aria: 'פאי' },
  // the 8 the bigger pad adds
  { label: '<', insert: '<', aria: 'קטן מ' },
  { label: '>', insert: '>', aria: 'גדול מ' },
  { label: '±', insert: '±', aria: 'פלוס מינוס' },
  { label: '∞', insert: '∞', aria: 'אינסוף' },
  { label: 'x', insert: 'x', aria: 'איקס' },
  { label: 'y', insert: 'y', aria: 'וואי' },
  { label: 'f′', insert: 'f′', aria: 'נגזרת' },
  { label: '∫', insert: '∫', aria: 'אינטגרל' },
];

function MathPad({ onPick, onClose }: { onPick: (s: string) => void; onClose: () => void }) {
  // two sizes of the same pad — a topic with few formulas gets the small one
  const [size, setSize] = useState<12 | 20>(12);
  const keys = KEYS.slice(0, size);
  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5, width: { xs: '100%', md: 300 }, flexShrink: 0, alignSelf: 'flex-start' }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 1.25 }}>
        <Typography sx={{ fontWeight: 800, flex: 1 }}>מחשבון מתמטי</Typography>
        <IconButton size="small" onClick={onClose} aria-label="סגירת המחשבון"><CloseRoundedIcon fontSize="small" /></IconButton>
      </Stack>

      <ToggleButtonGroup
        size="small"
        exclusive
        fullWidth
        value={size}
        onChange={(_, v) => v && setSize(v)}
        sx={{ mb: 1.25, '& .MuiToggleButton-root': { fontWeight: 700, textTransform: 'none', py: 0.25 } }}
      >
        <ToggleButton value={12}>12 מקשים</ToggleButton>
        <ToggleButton value={20}>20 מקשים</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.75 }}>
        {keys.map((k) => (
          <Button
            key={k.aria}
            onClick={() => onPick(k.insert)}
            aria-label={k.aria}
            variant="outlined"
            sx={{ minWidth: 0, px: 0, minHeight: 44, fontSize: (t: Theme) => t.typography.body1.fontSize, fontWeight: 700, textTransform: 'none', lineHeight: 1 }}
          >
            {k.label}
          </Button>
        ))}
      </Box>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => onPick('\n')}
        sx={{ mt: 0.75, minHeight: 44, fontWeight: 700 }}
      >
        שורה חדשה
      </Button>
    </Paper>
  );
}

function QrDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
        העלאת פתרון דרך הטלפון
        <IconButton onClick={onClose} aria-label="סגירה" sx={{ position: 'absolute', insetInlineEnd: 8, top: 8 }}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>סרוק את ה-QR בטלפון וצלם את הפתרון הכתוב.</Typography>
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 3, bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}>
          <QrCode2RoundedIcon sx={{ fontSize: 160, color: 'text.primary' }} />
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2, color: 'success.dark' }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>ממתין להעלאה</Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- fake macOS Finder open-file dialog (in-app, sham content) ---------- */
const FINDER_FAV = ['שולחן העבודה', 'מסמכים', 'הורדות', 'תמונות', 'iCloud Drive'];
const FINDER_FILES = [
  { name: 'פתרון_שאלה_1.pdf', kind: 'pdf', when: 'היום 14:32' },
  { name: 'גיאומטריה_מחברת.jpg', kind: 'img', when: 'אתמול 20:11' },
  { name: 'תרגיל_בית_אלגברה.png', kind: 'img', when: '2 בספט׳ 2026' },
  { name: 'נוסחאות_בגרות.pdf', kind: 'pdf', when: '28 באוג׳ 2026' },
  { name: 'סריקה_001.jpg', kind: 'img', when: '28 באוג׳ 2026' },
  { name: 'חקירת_פונקציה.pdf', kind: 'pdf', when: 'שבוע שעבר' },
];
const fileIcon = (k: string) => (k === 'pdf'
  ? <PictureAsPdfTwoToneIcon sx={{ color: red[400] }} />
  : <ImageTwoToneIcon sx={{ color: blue[400] }} />);

function FinderDialog({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (name: string) => void }) {
  const [sel, setSel] = useState(0);
  const choose = () => { onPick(FINDER_FILES[sel].name); onClose(); };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2.5, overflow: 'hidden' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25, bgcolor: grey[100], borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={0.75}>
          {[red[400], amber[400], green[400]].map((c) => <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />)}
        </Stack>
        <Typography variant="body2" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, color: 'text.secondary' }}>בחירת קובץ</Typography>
        <Box sx={{ width: 56 }} />
      </Box>
      <Box sx={{ display: 'flex', height: 320 }}>
        <Box sx={{ width: 192, flexShrink: 0, bgcolor: grey[50], borderInlineEnd: 1, borderColor: 'divider', py: 1, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="caption" sx={{ px: 2, color: 'text.disabled', fontWeight: 700 }}>מועדפים</Typography>
          <List dense>
            {FINDER_FAV.map((f, i) => (
              <ListItemButton key={f} selected={i === 1} sx={{ mx: 1, borderRadius: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><FolderTwoToneIcon fontSize="small" sx={{ color: amber[600] }} /></ListItemIcon>
                <ListItemText primary={f} primaryTypographyProps={{ variant: 'body2', noWrap: true }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List dense disablePadding>
            {FINDER_FILES.map((f, i) => (
              <ListItemButton key={f.name} selected={i === sel} onClick={() => setSel(i)} onDoubleClick={choose} sx={{ px: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{fileIcon(f.kind)}</ListItemIcon>
                <ListItemText primary={f.name} secondary={f.when} primaryTypographyProps={{ variant: 'body2', fontWeight: 600, noWrap: true }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: grey[50] }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>ביטול</Button>
        <Button onClick={choose} variant="contained" sx={{ fontWeight: 800 }}>פתיחה</Button>
      </Box>
    </Dialog>
  );
}

/* ---------- gamified quest progress: one circle per question, V when solved ---------- */
const popIn = keyframes`
  0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
  60%  { transform: scale(1.25) rotate(6deg); opacity: 1; }
  80%  { transform: scale(0.94) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;
// solved circles keep celebrating for a couple of seconds after the track fills
const cheer = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.14); }
`;
// solved + more questions ahead → the next-question button nudges the student on
const nudge = keyframes`
  0%, 70%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
  78%           { transform: scale(1.07); }
  85%           { transform: scale(1.02); }
`;
const railFill = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`;

function QuestProgress({ total, solved, started, current, size: sizeProp, onPick, onHover, hovered, hideCount }: { total: number; solved: Set<number>; started?: Set<number>; current?: number; size?: number; onPick?: (i: number) => void; onHover?: (i: number | null) => void; hovered?: number | null; hideCount?: boolean }) {
  const done = solved.size;
  const phone = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  // the circles shrink on a phone so the "x/y שאלות" caption always fits beside them
  const size = sizeProp ?? (phone ? 34 : 44);
  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ rowGap: 1, py: 1, overflow: 'visible' }}>
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: `${Math.round(size * 0.6)}px`, py: 0.5, overflow: 'visible' }}>
        {/* rail behind the circles + animated green fill up to the solved count */}
        <Box sx={{ position: 'absolute', insetInline: size / 2, height: 7, borderRadius: 4, bgcolor: (t) => alpha(t.palette.text.primary, 0.1) }} />
        <Box sx={{
          position: 'absolute', insetInlineStart: size / 2, height: 7, borderRadius: 4,
          width: `calc((100% - ${size}px) * ${Math.min(1, done / Math.max(1, total - 1))})`,
          bgcolor: 'primary.main', transformOrigin: '0% 50%',
          animation: `${railFill} 1600ms cubic-bezier(0.22, 1, 0.36, 1) 700ms both`,
          '[dir="rtl"] &': { transformOrigin: '100% 50%' },
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }} />
        {Array.from({ length: total }, (_, i) => {
          const isSolved = solved.has(i);
          // started but not finished — same half-filled amber dot as the תמונת מצב timeline
          const isStarted = !isSolved && !!started?.has(i);
          const isCurrent = current === i;
          return (
            <Box
              key={i}
              {...(onPick && { component: 'button' as const, onClick: () => onPick(i), 'aria-label': `שאלה ${i + 1}` })}
              {...(onHover && { onMouseEnter: () => onHover(i), onMouseLeave: () => onHover(null), onFocus: () => onHover(i), onBlur: () => onHover(null) })}
              sx={{
                position: 'relative', zIndex: 1,
                width: size, height: size, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: size * 0.42, fontFeatureSettings: '"tnum","lnum"',
                ...(onPick && { cursor: 'pointer', p: 0, font: 'inherit', fontWeight: 800,
                  // plain buttons, so the design system's keyboard ring is spelled out here
                  '&:focus-visible': { outline: (th: Theme) => `${th.spacing(0.375)} solid ${blue[700]}`, outlineOffset: (th: Theme) => th.spacing(0.25) } }),
                // linked to the matching question card: hovering either one lifts both
                transition: (t) => t.transitions.create(['transform', 'box-shadow']),
                ...(hovered === i && { transform: 'scale(1.18)', boxShadow: 6 }),
                ...(isSolved
                  ? { bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: 3 }
                  : isStarted
                  ? { border: 2, borderColor: amber[700], color: brown[900], bgcolor: 'background.paper',
                      backgroundImage: `linear-gradient(to left, ${amber[300]} 50%, transparent 50%)` }
                  : { bgcolor: 'background.paper', border: 2, borderColor: isCurrent ? 'primary.main' : grey[400], color: isCurrent ? 'primary.dark' : 'text.secondary' }),
                // pop in one by one, then solved ones keep cheering for ~2.5s
                animation: isSolved
                  ? `${popIn} 600ms cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 160}ms both, ${cheer} 600ms ease-in-out ${900 + i * 160}ms 3`
                  : `${popIn} 600ms cubic-bezier(0.34, 1.4, 0.64, 1) ${i * 160}ms both`,
                '@media (prefers-reduced-motion: reduce)': { animation: 'none', transition: 'none' },
              }}
            >
              {isSolved ? <CheckRoundedIcon sx={{ fontSize: size * 0.62 }} /> : i + 1}
            </Box>
          );
        })}
      </Box>
      {!hideCount && (
      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontWeight: 700, flexShrink: 0 }}>
        {done === total ? 'סיימת! כל הכבוד 🎉' : `${done}/${total} שאלות`}
      </Typography>
      )}
    </Stack>
  );
}

/* ---------- shared header bits ---------- */
// just the number, in a soft round badge — no "שאלה" label
export function QMeta({ index, solved, started, size = 'h6' }: { index: number; solved: boolean; started?: boolean; size?: 'h6' | 'h5' }) {
  const d = size === 'h5' ? 44 : 36;
  // half-filled amber dot = opened and answered, not solved yet (same language as תמונת מצב)
  const half = !solved && !!started;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: d, height: d, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 2, borderColor: grey[400], color: 'text.primary',
          fontWeight: 800, fontSize: size === 'h5' ? '1.6rem' : '1.3rem',
          fontFeatureSettings: '"tnum","lnum"',
        }}
      >
        {index + 1}
      </Box>
      {solved && <CheckCircleTwoToneIcon sx={{ color: GREEN[700] }} />}
      {half && (
        <Box sx={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          border: 2, borderColor: amber[700],
          backgroundImage: `linear-gradient(to left, ${amber[300]} 50%, transparent 50%)`,
        }} />
      )}
    </Stack>
  );
}

/* ---------- a sent answer, numbered line by line so Alfi can point at "שורה 3" ---------- */
function NumberedAnswer({ text }: { text: string }) {
  const lines = text.split('\n').filter((l, i, arr) => l.trim() !== '' || i < arr.length - 1);
  return (
    <Stack spacing={0.25}>
      {lines.map((line, i) => (
        <Stack key={i} direction="row" spacing={1.25} alignItems="baseline">
          <Typography
            component="span"
            variant="caption"
            sx={{ minWidth: 16, textAlign: 'center', flexShrink: 0, color: (t) => alpha(t.palette.common.white, 0.7), fontWeight: 700, fontFeatureSettings: '"tnum","lnum"' }}
          >
            {i + 1}
          </Typography>
          <Typography component="span" sx={{ textAlign: 'start', whiteSpace: 'pre-wrap' }}>{line || ' '}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

/* ---------- chat bubble ---------- */
function Bubble({ from, children, pose = 'point' }: { from: 'student' | 'ai'; children: ReactNode; pose?: 'point' | 'ok' }) {
  const isAi = from === 'ai';
  return (
    // RTL: the student's message sits on the RIGHT (inline start), Alfi answers from the LEFT.
    // Alfi's avatar comes AFTER the bubble in DOM order so it lands on the far left, hugging the edge.
    <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent={isAi ? 'flex-end' : 'flex-start'} sx={{ width: '100%' }}>
      {/* the student's own bubble is blue so it never reads as a system "correct" state */}
      <Box sx={{
        maxWidth: '80%', px: 2, py: 1.25, borderRadius: 3,
        // Alfi speaks on a neutral grey surface — colour is reserved for real states
        bgcolor: isAi ? 'grey.100' : blue[700],
        color: isAi ? 'text.primary' : 'common.white',
        borderStartStartRadius: isAi ? 24 : 4, borderStartEndRadius: isAi ? 4 : 24,
      }}>
        {children}
      </Box>
      {isAi && <AlfiAvatar pose={pose} />}
    </Stack>
  );
}


/* ---------- the phone's own keyboard ---------- */
// A stand-in for the device keyboard so the prototype shows what the student
// really sees: it takes the bottom 40% of the screen while the field has focus.
const KB_ROWS = [
  ['ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
  ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
  ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ'],
];

function PhoneKeyboard({ onKey, onBackspace, onClose }: { onKey: (ch: string) => void; onBackspace: () => void; onClose: () => void }) {
  // mousedown is swallowed so the field never loses focus while typing
  const hold = (e: React.MouseEvent) => e.preventDefault();
  const keySx = {
    flex: 1, minWidth: 0, height: '100%', px: 0, borderRadius: 1,
    bgcolor: 'background.paper', color: 'text.primary',
    boxShadow: 1, fontWeight: 500,
  } as const;
  return (
    <Portal>
    <Paper
      square elevation={8}
      sx={{
        position: 'fixed', insetInline: 0, bottom: 0, height: '40vh',
        zIndex: (t) => t.zIndex.modal, bgcolor: 'grey.200',
        display: { xs: 'flex', md: 'none' }, flexDirection: 'column',
        px: 0.5, py: 1, gap: 0.75,
      }}
    >
      {KB_ROWS.map((row, i) => (
        <Stack key={i} direction="row" spacing={0.5} sx={{ flex: 1, px: i === 1 ? 1.5 : 0 }}>
          {row.map((ch) => (
            <Button key={ch} onMouseDown={hold} onClick={() => onKey(ch)} sx={keySx}>{ch}</Button>
          ))}
        </Stack>
      ))}
      <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
        <Button onMouseDown={hold} onClick={onClose} aria-label="סגירת המקלדת" sx={{ ...keySx, flex: 1.4, bgcolor: 'grey.400' }}>
          <KeyboardHideRoundedIcon />
        </Button>
        <Button onMouseDown={hold} onClick={() => onKey(' ')} sx={{ ...keySx, flex: 4 }}>רווח</Button>
        <Button onMouseDown={hold} onClick={onBackspace} aria-label="מחיקה" sx={{ ...keySx, flex: 1.4, bgcolor: 'grey.400' }}>
          <BackspaceRoundedIcon className="dir-icon" />
        </Button>
      </Stack>
    </Paper>
    </Portal>
  );
}

/* ---------- the AI chat / answer panel ---------- */
/** Alfi's opening line on a fresh question. No gendered forms — Ministry rule. */
const KICKOFF: [string, string][] = [
  ['יאללה, מתחילים!', 'אני כאן לכל שאלה בדרך.'],
  ['קדימה, מתחילים מכאן!', 'שלב אחרי שלב, בקצב שלך.'],
  ['נצא לדרך!', 'לא צריך לדעת הכול מראש.'],
  ['נפתור את זה יחד.', 'כל טעות בדרך היא חלק מהפתרון.'],
  ['אפשר להתחיל!', 'תמיד אפשר לשאול אותי באמצע.'],
];
/** A בוחן has no chat, so Alfi says so up front. Placeholder until Nerit's copy arrives. */
const QUIZ_INTRO: [string, string] = ['בהצלחה! 💪', 'בבוחן אני לא עונה על שאלות — כותבים את התשובה ושולחים.'];

/** What Alfi says to a question. Nothing here judges the answer — that is the point. */
const ALFI_ANSWERS = [
  'שאלה טובה. נתחיל מהנתונים: מה ידוע לנו, ומה צריך למצוא?',
  'אפשר לפרק את זה לשלבים. איזה כלל מתאים לביטוי הזה?',
  'אין בעיה — אפשר לכתוב רק את השלב הראשון, ונמשיך משם יחד.',
  'זה מקום נפוץ להיתקע בו. מה הדבר האחרון שהיה ברור?',
];

type Msg = { from: 'student' | 'ai'; node: ReactNode; pose?: 'point' | 'ok' };
const approvedNode = (
  <Stack direction="row" spacing={1} alignItems="center">
    <CheckCircleTwoToneIcon sx={{ color: 'primary.main' }} />
    <Typography>כל הכבוד! תשובה נכונה! 🎉</Typography>
  </Stack>
);

// first line that differs from the stored solution; 0 = the whole answer matches
function firstBadLine(answer: string, expected?: string) {
  if (!expected) return 0;
  const norm = (t: string) => t.replace(/\s+/g, ' ').trim();
  const mine = answer.split('\n');
  const right = expected.split('\n');
  for (let i = 0; i < Math.max(mine.length, right.length); i++) {
    if (norm(mine[i] ?? '') !== norm(right[i] ?? '')) return i + 1;
  }
  return 0;
}

const hintNode = (body: ReactNode) => (
  <Stack direction="row" spacing={0.75} alignItems="flex-start">
    <ErrorOutlineRoundedIcon sx={{ color: 'warning.dark', mt: 0.25 }} />
    <Typography component="div">{body}</Typography>
  </Stack>
);

function ChatPanel({ q, qIndex, onSolved, onStarted, savedAnswer, locked, started, canAsk, onKeyboard }: { q: Question; qIndex: number; onSolved: (answer: string) => void; onStarted?: () => void; savedAnswer?: string; locked?: boolean; started?: boolean;
  // a בוחן is a test: there is nobody to ask, so the button never renders
  canAsk?: boolean;
  // the page shrinks while the on-screen keyboard is up
  onKeyboard?: (open: boolean) => void }) {
  // re-entering a solved question replays the conversation instead of an empty box.
  // questions that were already solved before this session have no saved text — show the solution itself.
  const shown = savedAnswer ?? (locked ? q.solutionText : undefined);
  // one line per question, always the same one for the same question
  const kickoff = qIndex % KICKOFF.length;
  const intro = canAsk ? KICKOFF[kickoff] : QUIZ_INTRO;
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    if (shown) return [{ from: 'student', node: <NumberedAnswer text={shown} /> }, { from: 'ai', node: approvedNode, pose: 'ok' }];
    // a long question carries its whole history: every attempt and every correction
    if (q.priorTurns) {
      return q.priorTurns.flatMap((t): Msg[] => [
        { from: 'student', node: <NumberedAnswer text={t.answer} /> },
        { from: 'ai', node: hintNode(t.reply) },
      ]);
    }
    // half-solved: the earlier attempt and Alfi's correction are already on screen
    if (started && q.priorAttempt) {
      const bad = firstBadLine(q.priorAttempt, q.solutionText);
      return [
        { from: 'student', node: <NumberedAnswer text={q.priorAttempt} /> },
        { from: 'ai', node: hintNode(<>כמעט! יש טעות ב<b>שורה {bad}</b>. בדוק אותה שוב, תקן ושלח לי את הפתרון עוד פעם.</>) },
      ];
    }
    return [];
  });
  // some questions ship with a full worked answer already typed in, ready to send
  const [draft, setDraft] = useState(q.sampleAnswer ?? '');
  const [thinking, setThinking] = useState(false);
  const [tries, setTries] = useState(q.priorTurns?.length ?? (started && q.priorAttempt ? 1 : 0));
  const [confetti, setConfetti] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [asked, setAsked] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);
  const phone = useMediaQuery((t: Theme) => t.breakpoints.down('sm'));
  const [fileOpen, setFileOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showKeyboard = (open: boolean) => { setKbOpen(open); onKeyboard?.(open); };

  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);
  // walking back into a question that was already solved gets a celebration too
  useEffect(() => {
    if (!locked) return;
    setConfetti(true);
    const id = window.setTimeout(() => setConfetti(false), 1800);
    return () => window.clearTimeout(id);
  }, [locked]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' }); }, [msgs.length, thinking]);

  // symbols land where the cursor is, and the caret stays put so typing continues naturally
  const insertAtCursor = (sym: string) => {
    const el = inputRef.current;
    const start = el ? el.selectionStart ?? draft.length : draft.length;
    const end = el ? el.selectionEnd ?? start : start;
    setDraft(draft.slice(0, start) + sym + draft.slice(end));
    window.setTimeout(() => {
      el?.focus();
      el?.setSelectionRange(start + sym.length, start + sym.length);
    }, 0);
  };

  // "שאלה לאלפי" — the same box and the same conversation, only nothing is graded.
  // It is the safe way to ask: no right or wrong, just an answer.
  const ask = () => {
    if (!draft.trim() || thinking) return;
    const question = draft.trim();
    setMsgs((m) => [...m, { from: 'student', node: <Typography sx={{ whiteSpace: 'pre-wrap' }}>{question}</Typography> }]);
    setDraft('');
    setThinking(true);
    const reply = ALFI_ANSWERS[asked % ALFI_ANSWERS.length];
    setAsked((n) => n + 1);
    window.setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [...m, { from: 'ai', node: <Typography>{reply}</Typography> }]);
    }, 1400);
  };

  const send = () => {
    if (!draft.trim() || thinking) return;
    const answer = draft.trim();
    setMsgs((m) => [...m, { from: 'student', node: <NumberedAnswer text={answer} /> }]);
    setDraft('');
    setThinking(true);
    // demo checking: the answer is compared line by line against the stored solution,
    // so editing any number in the pre-typed answer produces a real correction.
    const badLine = firstBadLine(answer, q.solutionText); // 1-based; 0 = nothing wrong
    const scripted = !!q.wrongHint && tries === 0 && badLine > 0;
    if (tries === 0) onStarted?.(); // first submission marks the question as started
    setTries((n) => n + 1);
    window.setTimeout(() => {
      setThinking(false);
      if (badLine > 0) {
        setMsgs((m) => [...m, { from: 'ai', node: hintNode(
          scripted ? q.wrongHint : <>כמעט! יש טעות ב<b>שורה {badLine}</b>. בדוק אותה שוב, תקן ושלח לי את הפתרון עוד פעם.</>
        ) }]);
        return;
      }
      setMsgs((m) => [...m, { from: 'ai', node: approvedNode, pose: 'ok' }]);
      setConfetti(true);
      window.setTimeout(() => { setConfetti(false); onSolved(answer); }, 3200);
    }, 1400);
  };

  return (
    <Paper variant="outlined" sx={{ position: 'relative', borderRadius: 3, p: { xs: 2, md: 2.5 } }}>
      {confetti && <Confetti />}
      <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.25 }}>{canAsk ? 'התרגול שלי' : 'הפתרון שלי'}</Typography>

      {!locked && (
        <Typography variant="body2" color="text.secondary">
          {/* secret: clicking the word "פתרון" drops the full solution into the box */}
          {canAsk ? (
            <>
              תשאל את אלפי שאלות או תן לו לבדוק את{' '}
              <Box component="span" onClick={() => q.solutionText && setDraft(q.solutionText)} sx={{ cursor: 'text' }}>הפיתרון</Box>{' '}
              שלך
            </>
          ) : (
            <>
              כתוב כאן את{' '}
              <Box component="span" onClick={() => q.solutionText && setDraft(q.solutionText)} sx={{ cursor: 'text' }}>הפתרון</Box>{' '}
              שלך.
            </>
          )}
        </Typography>
      )}

      <Divider sx={{ mt: 1.5, mb: 3 }} />

      {!locked && (
        /* every new question opens with Alfi kicking it off */
        <Stack direction="row-reverse" spacing={1.5} alignItems="flex-start" justifyContent="flex-start" sx={{ mb: 2 }}>
          {/* a bigger circle, the art itself unchanged, on the logo's own gradient */}
          <AlfiAvatar pose="point" />
          <Box
            sx={{
              position: 'relative', bgcolor: 'grey.100', color: 'text.primary',
              borderRadius: 3, px: 2, py: 1.25,
              '&::before': {
                content: '""', position: 'absolute', top: 14, insetInlineEnd: -8,
                borderWidth: '8px 0 8px 8px', borderStyle: 'solid',
                borderColor: (t) => `transparent transparent transparent ${t.palette.grey[100]}`,
              },
            }}
          >
            <Typography>{intro[0]}</Typography>
            <Typography color="text.secondary">{intro[1]}</Typography>
          </Box>
        </Stack>
      )}

      <Stack spacing={1.5} sx={{ mb: msgs.length || thinking ? 2 : 0 }}>
        {msgs.map((m, i) => <Bubble key={i} from={m.from} pose={m.pose}>{m.node}</Bubble>)}
        {thinking && (
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Box sx={{ minWidth: 200 }}>
              <LinearProgress sx={{ borderRadius: 4, mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary">מעבד תשובה… עוד כמה שניות</Typography>
            </Box>
            <AlfiAvatar pose="point" />
          </Stack>
        )}
        <Box ref={endRef} />
      </Stack>

      {!locked && <>
      {/* One box holds everything: the answer on top, the tools and the two actions
          along the bottom. The keypad opens beside it. */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 1 }}>
        <Paper
          variant="outlined"
          sx={{
            flex: 1, minWidth: 0, borderRadius: 3, p: 1.5,
            borderColor: 'primary.main',
            display: 'flex', flexDirection: 'column', gap: 1.5,
          }}
        >
          <TextField
            fullWidth multiline minRows={mathOpen ? 8 : 3} value={draft}
            inputRef={inputRef}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); send(); } }}
            onFocus={() => { if (phone) showKeyboard(true); }}
            placeholder="כתוב כאן את התשובה שלך…"
            inputProps={{ 'aria-label': 'הפתרון שלי' }}
            disabled={thinking}
            variant="standard"
            InputProps={{ disableUnderline: true }}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ rowGap: 1, columnGap: 1 }}>
            {/* a phone gets one line: the keypad and a plus on the start side */}
            <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ rowGap: 1, columnGap: 1 }}>
              {!phone && (
                <Button size="small" variant="outlined" startIcon={<AttachFileRoundedIcon />} onClick={() => setFileOpen(true)} sx={{ fontWeight: 700 }}>צרף קובץ</Button>
              )}
              <Button size="small" variant={mathOpen ? 'contained' : 'outlined'} disableElevation startIcon={<CalculateRoundedIcon />} onClick={() => setMathOpen((v) => !v)} sx={{ fontWeight: 700 }}>MATH</Button>
              {phone ? (
                <IconButton
                  size="small" aria-label="עוד דרכים לענות"
                  onClick={() => setMoreOpen(true)}
                  sx={{ border: 1, borderColor: 'primary.main', color: 'primary.main', borderRadius: 1.5 }}
                >
                  <AddRoundedIcon />
                </IconButton>
              ) : (
                <Button size="small" variant="outlined" startIcon={<PhotoCameraRoundedIcon />} onClick={() => setQrOpen(true)} sx={{ fontWeight: 700 }}>צלם תשובה</Button>
              )}
            </Stack>
            {/* and the two actions at the far end — icons only on a phone */}
            <Stack direction="row" flexWrap="wrap" alignItems="center" sx={{ rowGap: 1, columnGap: 1 }}>
              {canAsk && (
                phone ? (
                  <IconButton
                    aria-label="שאלה לאלפי" onClick={ask} disabled={thinking || !draft.trim()}
                    sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: 1.5,
                          '&:hover': { bgcolor: 'secondary.dark' },
                          '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' } }}
                  >
                    <HelpRoundedIcon />
                  </IconButton>
                ) : (
                  <Button
                    size="small" variant="contained" color="secondary" disableElevation
                    endIcon={<HelpRoundedIcon />}
                    onClick={ask} disabled={thinking || !draft.trim()}
                    sx={{ fontWeight: 800 }}
                  >
                    שאלה לאלפי
                  </Button>
                )
              )}
              {phone ? (
                <IconButton
                  aria-label="שליחת התשובה" onClick={send} disabled={thinking || !draft.trim()}
                  sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 1.5,
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' } }}
                >
                  <SendRoundedIcon className="dir-icon" />
                </IconButton>
              ) : (
                <Button
                  size="small" variant="contained" onClick={send} disabled={thinking || !draft.trim()}
                  endIcon={!thinking && <SendRoundedIcon className="dir-icon" />}
                  sx={{ fontWeight: 800 }}
                >
                  {thinking ? 'שולח…' : 'שלח תשובה'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
        {mathOpen && <MathPad onClose={() => setMathOpen(false)} onPick={insertAtCursor} />}
      </Stack>
      </>}

      <QrDialog open={qrOpen} onClose={() => setQrOpen(false)} />
      {kbOpen && (
        <PhoneKeyboard
          onKey={(ch) => insertAtCursor(ch)}
          onBackspace={() => setDraft((d) => d.slice(0, -1))}
          onClose={() => { showKeyboard(false); inputRef.current?.blur(); }}
        />
      )}

      {/* the plus: the two other ways to answer, from the bottom of the screen */}
      <Drawer
        anchor="bottom" open={moreOpen} onClose={() => setMoreOpen(false)}
        // above the bottom nav, which is pinned higher than a drawer normally sits
        sx={{ zIndex: (t) => t.zIndex.modal }}
        PaperProps={{ sx: { borderStartStartRadius: 16, borderStartEndRadius: 16, pb: 1 } }}
      >
        <List>
          <ListItemButton onClick={() => { setMoreOpen(false); setFileOpen(true); }}>
            <ListItemIcon><AttachFileRoundedIcon /></ListItemIcon>
            <ListItemText primary="צרף קובץ" />
          </ListItemButton>
          <ListItemButton onClick={() => { setMoreOpen(false); setQrOpen(true); }}>
            <ListItemIcon><PhotoCameraRoundedIcon /></ListItemIcon>
            <ListItemText primary="צלם תשובה" />
          </ListItemButton>
        </List>
      </Drawer>

      <FinderDialog open={fileOpen} onClose={() => setFileOpen(false)} onPick={(name) => setDraft((d) => (d ? d + '\n' : '') + `📎 ${name}`)} />
    </Paper>
  );
}

/* ---------- full question page ---------- */
function QuestionPage({ q, index, total, solved, started, onBack, onSolved, onStarted, onNext, savedAnswer, showPoints, canAsk }: {
  q: Question; index: number; total: number; solved: boolean; started: boolean; onBack: () => void; onSolved: (answer: string) => void; onStarted: () => void; onNext: (() => void) | null; savedAnswer?: string; canAsk?: boolean;
  // points are a בוחן thing — תרגול is never scored, anywhere
  showPoints?: boolean;
}) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, [index]);
  // Students asked to keep the question in sight while they answer, so the screen
  // splits in two: the question on top, the answer under it, each scrolling on its
  // own. Unpinning gives the old single column back.
  const [pinned, setPinned] = useState(true);
  // the on-screen keyboard eats the bottom 40% — the page lives above it
  const [kbOpen, setKbOpen] = useState(false);
  useEffect(() => { setPinned(true); }, [index]);

  const header = (
    <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ rowGap: 1, mb: 2 }}>
      <QMeta index={index} solved={solved} started={started} size="h5" />
      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* solved questions get a stamp instead of a whole different layout */}
        {solved && (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ px: 1.25, py: 0.5, borderRadius: 1.5, border: 2, borderColor: 'primary.main', color: 'primary.dark', transform: 'rotate(-4deg)' }}>
            <CheckRoundedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 900, letterSpacing: (t) => t.typography.caption.letterSpacing }}>הצלחת!</Typography>
          </Stack>
        )}
        {showPoints && <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{q.points} נק׳</Typography>}
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>שאלה {index + 1} מתוך {total}</Typography>
        <Button
          size="small"
          color={pinned ? 'primary' : 'inherit'}
          onClick={() => setPinned((v) => !v)}
          startIcon={pinned ? <PushPinRoundedIcon /> : <PushPinOutlinedIcon />}
          sx={{ fontWeight: 700, ...(pinned ? {} : { color: 'text.secondary' }) }}
        >
          הצמדת השאלה
        </Button>
      </Stack>
    </Stack>
  );

  const questionBody = (
    <>
      <Divider sx={{ mb: 3 }} />
      <Typography component="div" variant="h6" sx={{ fontWeight: 400, lineHeight: 2.1, textAlign: 'start' }}>
        {q.prompt}
      </Typography>
    </>
  );

  const nextButton = (onNext || solved) && (
    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
      {onNext
        ? <Button
            variant="contained"
            onClick={onNext}
            endIcon={<ArrowForwardRoundedIcon className="dir-icon" />}
            sx={{
              fontWeight: 800,
              ...(solved && {
                animation: `${nudge} 2.2s ease-in-out infinite`,
                '&:hover': { animationPlayState: 'paused' },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }),
            }}
          >
            לשאלה הבאה
          </Button>
        : <Button variant="contained" onClick={onBack} sx={{ fontWeight: 800 }}>סיימת! חזרה לשאלות</Button>}
    </Stack>
  );

  const chat = <ChatPanel q={q} qIndex={index} onSolved={onSolved} onStarted={onStarted} savedAnswer={savedAnswer} locked={solved} started={started} canAsk={canAsk} onKeyboard={setKbOpen} />;

  // unpinned: the old single column, the whole page scrolls as one
  if (!pinned) {
    return (
      <>
        <Paper elevation={2} sx={{ borderRadius: 3, p: { xs: 3, md: 4.5 } }}>
          {header}
          {questionBody}
        </Paper>
        {chat}
        {nextButton}
      </>
    );
  }

  // pinned: the screen splits down the middle, each half scrolls on its own
  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2, pb: kbOpen ? '40vh' : 0 }}>
      {/* the question takes the height it needs, and never more than half the screen */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3, px: { xs: 3, md: 4.5 }, py: { xs: 2.5, md: 3 },
          flexShrink: 0, maxHeight: '50%', minHeight: 0, overflowY: 'auto',
        }}
      >
        {header}
        {questionBody}
      </Paper>

      {/* the answer takes whatever is left */}
      <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {chat}
        {nextButton}
      </Box>
    </Box>
  );
}

/* ---------- question list card ---------- */
// the question window every card shares, so the cards all end up the same height.
// a phone wraps far more, so it gets two lines where the desktop needs one.
const PROMPT_H = { xs: 100, md: 56 };

function QuestionCard({ q, index, solved, started, onOpen, onHover, hovered, showPoints }: { q: Question; index: number; solved: boolean; started?: boolean; onOpen: () => void; onHover: (i: number | null) => void; hovered: number | null; showPoints?: boolean }) {
  // a question longer than the window fades out and says so
  const promptRef = useRef<HTMLDivElement | null>(null);
  const [clipped, setClipped] = useState(false);
  useEffect(() => {
    const el = promptRef.current;
    if (!el) return;
    const measure = () => setClipped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [q.prompt]);
  return (
    <Card
      variant="outlined"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      sx={{
        borderRadius: 3, borderColor: solved ? 'primary.light' : 'divider',
        bgcolor: (t) => solved ? alpha(t.palette.primary.main, 0.06) : 'background.paper',
        transition: (t) => t.transitions.create(['box-shadow', 'border-color', 'transform']),
        '&:hover': { boxShadow: 4, borderColor: 'primary.main' },
        // paired with its numbered circle in the quest track above
        ...(hovered === index && { boxShadow: 6, borderColor: 'primary.main', transform: 'translateY(-2px)' }),
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <CardActionArea onClick={onOpen} sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <QMeta index={index} solved={solved} started={started} />
              {showPoints && <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{q.points} נק׳</Typography>}
            </Stack>
            {/* every card is the same height: the question gets a fixed window and
                fades out at the bottom when there is more of it to read */}
            <Box
              ref={promptRef}
              sx={{
                height: PROMPT_H, overflow: 'hidden',
                ...(clipped && {
                  maskImage: 'linear-gradient(to top, transparent 0, #000 40px)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 0, #000 40px)',
                }),
              }}
            >
              <Typography component="div" sx={{ color: 'text.primary', textAlign: 'start', lineHeight: (t) => t.typography.button.lineHeight }}>
                {q.prompt}
              </Typography>
            </Box>
            {/* one fixed-height line for the status and the "there's more" hint */}
            <Stack direction="row" alignItems="center" sx={{ height: 22, mt: 1 }}>
              {solved && <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 700 }}>סיכום צ׳אט · התשובה נשמרה</Typography>}
              {clipped && (
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, marginInlineStart: 'auto' }}>
                  ראה עוד
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

/* ---------- task detail (list <-> question page) ---------- */
export function TaskDetail({ task, onBack }: { task: SolveTask; onBack: () => void }) {
  const questions = QUESTIONS.slice(0, Math.max(1, Math.min(task.total, QUESTIONS.length)));
  // the task's solved count seeds the page: those questions arrive already solved
  // the task's solved count seeds the page: those questions arrive already solved,
  // and the very next one is the half-solved one the student already tried once.
  const seedSolved = Math.min(task.solved, questions.length);
  const [solved, setSolved] = useState<Set<number>>(() => new Set(Array.from({ length: seedSolved }, (_, i) => i)));
  // opened and answered at least once, but not solved yet — half-filled dot
  // every unsolved question that already carries an attempt in its chat is a started one
  const [started, setStarted] = useState<Set<number>>(() => new Set(
    questions.flatMap((q, i) => (i >= seedSolved && (q.priorAttempt || q.priorTurns) ? [i] : []))
  ));
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [hoverQ, setHoverQ] = useState<number | null>(null);
  // the student's own text per question — kept so the solved view still shows it
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const done = solved.size;
  // coming back into a fully finished task is a celebration too — confetti on entry
  const [entryConfetti, setEntryConfetti] = useState(done === questions.length);
  useEffect(() => {
    if (!entryConfetti) return;
    const id = window.setTimeout(() => setEntryConfetti(false), 1800);
    return () => window.clearTimeout(id);
  }, [entryConfetti]);

  const markSolved = (i: number, answer?: string) => {
    setSolved((s) => new Set(s).add(i));
    if (answer) setAnswers((a) => ({ ...a, [i]: answer }));
  };
  const nextUnsolved = (from: number) => {
    for (let j = from + 1; j < questions.length; j++) if (!solved.has(j)) return j;
    for (let j = 0; j < questions.length; j++) if (j !== from && !solved.has(j)) return j;
    return null;
  };

  // "יש לי שאלה" — the teaching-assistant lives ONLY inside תרגול (never בוחן), in the sidebar
  const alfi = task.kind === 'תרגול';
  // ...and the mirror image: points exist ONLY inside בוחן. תרגול shows none, anywhere.
  const showPoints = task.kind === 'בוחן';

  if (openQ !== null) {
    const nx = nextUnsolved(openQ);
    return (
      <Shell
        active="practice" title="" alfi={alfi} mobileBack={() => setOpenQ(null)}
        mobileHeader={<QuestProgress total={questions.length} solved={solved} started={started} current={openQ} onPick={setOpenQ} hideCount />}
        headerAction={
          /* the 50/50 split needs every pixel, so the question strip sits in the header */
          <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
            <Button onClick={() => setOpenQ(null)} variant="outlined" startIcon={<ArrowForwardRoundedIcon />} sx={{ fontWeight: 700, flexShrink: 0, display: { xs: 'none', md: 'inline-flex' } }}>
              חזרה לשאלות
            </Button>
            <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}>
              <QuestProgress total={questions.length} solved={solved} started={started} current={openQ} onPick={setOpenQ} />
            </Box>
          </Stack>
        }
      >
        <QuestionPage
          q={questions[openQ]}
          index={openQ}
          total={questions.length}
          solved={solved.has(openQ)}
          started={started.has(openQ)}
          onBack={() => setOpenQ(null)}
          onSolved={(answer) => markSolved(openQ, answer)}
          onStarted={() => setStarted((s) => new Set(s).add(openQ))}
          savedAnswer={answers[openQ]}
          showPoints={showPoints}
          canAsk={alfi}
          onNext={nx === null ? null : () => setOpenQ(nx)}
        />
      </Shell>
    );
  }

  return (
    <Shell
      active="practice" title="" alfi={alfi} mobileBack={onBack}
      headerAction={
        <Button onClick={onBack} variant="outlined" startIcon={<ArrowForwardRoundedIcon />} sx={{ fontWeight: 700, display: { xs: 'none', md: 'inline-flex' } }}>
          חזרה לרשימת המשימות
        </Button>
      }
    >
      {/* re-entering a finished task celebrates again */}
      {entryConfetti && (
        <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: (t) => t.zIndex.modal }}>
          <Confetti />
        </Box>
      )}


      {/* header — title, then meta line with the progress tucked under it as helper text */}
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="h4" sx={{ ...FREDOKA, fontWeight: 600 }}>{task.title}</Typography>
          {/* finished test: the grade pill sits right by the title, same style as the list card */}
          {task.grade != null && (
            <Box sx={{ alignSelf: 'center' }}><GradePill grade={task.grade} /></Box>
          )}
          {/* new until the first question is solved — same rule as the task list */}
          {done === 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ alignSelf: 'center' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'info.dark' }}>חדש</Typography>
            </Stack>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{task.to ? `להגשה עד ${task.to}${hebrewWeekday(task.to)}.` : 'להגשה עד סוף השנה.'}</Typography>
        <Box sx={{ mt: 2 }}>
          <QuestProgress total={questions.length} solved={solved} started={started} onPick={setOpenQ} onHover={setHoverQ} hovered={hoverQ} />
        </Box>
      </Box>

      <Divider sx={{ mt: 2.5, mb: 1 }} />

      <Stack spacing={2.5} sx={{ mt: 1 }}>
        {questions.map((q, i) => (
          <QuestionCard key={i} q={q} index={i} solved={solved.has(i)} started={started.has(i)} onOpen={() => setOpenQ(i)} onHover={setHoverQ} hovered={hoverQ} showPoints={showPoints} />
        ))}
      </Stack>

    </Shell>
  );
}
