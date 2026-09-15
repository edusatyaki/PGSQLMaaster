/* Module 06 - DBMS & SQL rapid fire: Apps Script endpoint and round settings. */
/* =====================================================================
   CONFIG — the only file you normally need to edit.
   ===================================================================== */

const CONFIG = {

  /* Paste the Apps Script Web App URL here after deploying (see README).
     It must end in /exec — NOT /dev.
     Leave it as "" to run the quiz offline (results stay in the browser). */
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxLmowTF1RI_dS_vpkZ_wvCqZUkTUyl2pgmCC8IkQJJDgTODwCVuUjMG7uoJ_uV4-gzYQ/exec",

  /* Branding shown on the start screen */
  QUIZ_TITLE:    "DBMS <i>&amp;</i> SQL <i>Rapid Fire</i>",
  QUIZ_SUBTITLE: "100 questions · 20 seconds each · no going back",
  FOOTER_NOTE:   "Lectures 1–3 + PostgreSQL Functions",

  /* Go fullscreen when the student presses Start. Note that this is a
     presentation choice, not a lockdown — Esc or F11 leaves it at any time
     and no web page can prevent that. */
  FULLSCREEN_ON_START: true,

  /* Timing & round settings */
  SECONDS_PER_QUESTION: 20,   // countdown per question
  QUESTIONS_PER_ROUND:  100,  // how many of the bank to serve
  FEEDBACK_MS:          550,  // how long the green/red flash lasts
  TIMEOUT_FEEDBACK_MS:  900,  // longer pause when the clock runs out

  /* ---------------- Student details collected before the round -------- */

  /* Sections offered in the dropdown. Set to [] for a free-text box instead. */
  SECTIONS: ["A", "B", "C", "D", "E"],

  /* Optional format check for the enrolment number, as a regex string.
     Example: "^[0-9]{10}$" for exactly ten digits. "" disables the check. */
  ENROLMENT_PATTERN: "",
  ENROLMENT_HINT:    "",   // message shown when the pattern does not match

  /* ------------------------- IP address capture ----------------------- */

  /* A static site cannot see its own visitor's IP, and Apps Script does not
     expose it either — so it is looked up in the browser from a public
     service. That makes it client-supplied, and therefore spoofable: treat
     it as a soft signal, never as proof of who sat the quiz.
     Set to false to stop collecting it entirely. */
  CAPTURE_IP: true,
  IP_LOOKUP_URLS: [
    "https://api.ipify.org?format=json",              // -> { "ip": "..." }
    "https://api64.ipify.org?format=json",
    "https://ipapi.co/json/"                          // -> { "ip": "...", ... }
  ],

  /* ---------------------- Live progress tracking ---------------------- */

  /* Sends a checkpoint to the sheet as the student works, so you still see
     how far someone got if they close the tab mid-round. */
  PROGRESS_TRACKING: true,
  PROGRESS_EVERY:    10,   // send a checkpoint every N questions

  /* ------------------------- Celebration ------------------------------ */

  /* Confetti fires at the end when accuracy is ABOVE this percentage.
     Set to 0 to celebrate every round, or 101 to switch it off entirely.
     It is skipped automatically for anyone who prefers reduced motion. */
  CONFETTI_MIN_ACCURACY: 70,

  /* Behaviour */
  SHUFFLE_QUESTIONS: true,
  SHUFFLE_OPTIONS:   true,
  SHOW_LEADERBOARD:  true,    // fetch top scores from the sheet after a round
  ALLOW_REVIEW:      true     // show the answer review on the result screen
};
