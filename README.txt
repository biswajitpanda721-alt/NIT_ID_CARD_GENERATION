═══════════════════════════════════════════════
  NIT BHUBANESWAR ID CARD SYSTEM — RUN GUIDE
═══════════════════════════════════════════════

PEHLI BAAR SETUP (sirf ek baar karna hai):
───────────────────────────────────────────
1. Node.js install karo (agar nahi hai):
   https://nodejs.org  →  LTS version download karo

2. Bas itna!

═══════════════════════════════════════════════
ROJE CHALANE KE LIYE:
═══════════════════════════════════════════════

  ► start.bat pe DOUBLE CLICK karo

  Browser automatically khul jaayega:
  http://localhost:3000/login.html

═══════════════════════════════════════════════
LOGIN:
═══════════════════════════════════════════════

  ADMIN:
    Email:    admin@nitbbsr.ac.in
    Password: admin@123
    → admin.html pe redirect hoga

  STUDENT/FACULTY/STAFF:
    Pehle Sign Up karo → OTP aayega email pe → Login

═══════════════════════════════════════════════
ADMIN PASSWORD CHANGE KARNA HO:
═══════════════════════════════════════════════
  server.js file kholo → line 10-11 update karo:
    const ADMIN_EMAIL = "apna@email.com";
    const ADMIN_PASS  = "naya_password";

═══════════════════════════════════════════════
