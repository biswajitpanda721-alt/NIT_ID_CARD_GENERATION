const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// ── CONFIG ────────────────────────────────────────────────
const MONGO_URI = "mongodb+srv://biswajitpanda721:Q2YegVMdJ8iqRbxO@nitidcard.vy7bph5.mongodb.net/?appName=nitidcard";
const DB_NAME   = "nitdb";
const PORT = process.env.PORT || 3000;

// Admin credentials
const ADMIN_EMAIL = "admin@nitbbsr.ac.in";
const ADMIN_PASS  = "admin@123";

// ── MONGODB CONNECTION ────────────────────────────────────
let db;
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("✅ MongoDB Connected — nitdb");
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at: http://localhost:${PORT}`);
      console.log(`📄 Open: http://localhost:${PORT}/login.html\n`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ── HASH PASSWORD ─────────────────────────────────────────
function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

// ── GENERATE TOKEN ────────────────────────────────────────
function genToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ── AUTH MIDDLEWARE ───────────────────────────────────────
async function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  const session = await db.collection('sessions').findOne({ token });
  if (!session) return res.status(401).json({ error: 'Invalid token' });
  req.user = session.user;
  next();
}

// ═══════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ error: 'Email aur password dono dalo' });

    // Admin check
    if ((email === ADMIN_EMAIL || email === 'admin') && password === ADMIN_PASS) {
      const token = genToken();
      const user = { email: ADMIN_EMAIL, name: 'Administrator', role: 'superadmin' };
      await db.collection('sessions').insertOne({ token, user, createdAt: new Date() });
      return res.json({ success: true, token, user });
    }

    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ error: 'Email registered nahi hai. Sign Up karo.' });

    const hashed = hashPassword(password);
    if (user.password !== hashed) return res.json({ error: 'Password galat hai' });

    const token = genToken();
    await db.collection('sessions').insertOne({ token, user: { email: user.email, name: user.name, role: user.role, dept: user.dept || '' }, createdAt: new Date() });
    await db.collection('users').updateOne({ email: user.email }, { $set: { lastLogin: new Date() } });

    res.json({ success: true, token, user: { email: user.email, name: user.name, role: user.role, dept: user.dept || '' } });
  } catch (e) {
    console.error(e);
    res.json({ error: 'Server error: ' + e.message });
  }
});

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fname, lname, email, role, password, dept, rollNumber } = req.body;
    if (!fname || !email || !role || !password) return res.json({ error: 'Sab fields bharo' });

    const exists = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (exists) return res.json({ error: 'Email already registered hai. Login karo.' });

    const doc = {
      fname, lname, name: fname + ' ' + lname,
      email: email.toLowerCase(), role,
      password: hashPassword(password),
      dept: dept || '', rollNumber: rollNumber || '',
      createdAt: new Date(), lastLogin: null, status: 'active'
    };
    await db.collection('users').insertOne(doc);

    const token = genToken();
    await db.collection('sessions').insertOne({ token, user: { email: doc.email, name: doc.name, role: doc.role, dept: doc.dept }, createdAt: new Date() });

    res.json({ success: true, token, user: { email: doc.email, name: doc.name, role: doc.role } });
  } catch (e) {
    console.error(e);
    res.json({ error: 'Server error: ' + e.message });
  }
});

// POST /api/auth/verify — OTP is handled on frontend (EmailJS), just validate session
app.post('/api/auth/logout', async (req, res) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (token) await db.collection('sessions').deleteOne({ token });
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// USER ROUTES
// ═══════════════════════════════════════════════════════════

// GET /api/users
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.json({ users });
  } catch (e) { res.json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════
// ID CARD ROUTES
// ═══════════════════════════════════════════════════════════

// POST /api/cards — create card
app.post('/api/cards', authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    const cardNumber = 'NIT-' + Date.now().toString(36).toUpperCase();
    const doc = {
      ...data, cardNumber,
      createdBy: req.user.email,
      createdAt: new Date(),
      printCount: 0
    };
    const result = await db.collection('idcards').insertOne(doc);

    // Log history
    await db.collection('history').insertOne({
      cardNumber, action: 'created',
      actionDetails: `Card created for ${data.name}`,
      actionBy: req.user.name || req.user.email,
      createdAt: new Date()
    });

    res.json({ success: true, cardNumber, card: { ...doc, _id: result.insertedId } });
  } catch (e) {
    console.error(e);
    res.json({ error: e.message });
  }
});

// GET /api/cards — list with search/filter/pagination
app.get('/api/cards', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 15, search, type, status } = req.query;
    const filter = {};
    if (type) filter.cardType = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cardNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    const total = await db.collection('idcards').countDocuments(filter);
    const cards = await db.collection('idcards')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    res.json({ cards, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (e) { res.json({ error: e.message }); }
});

// GET /api/cards/:id
app.get('/api/cards/:id', authMiddleware, async (req, res) => {
  try {
    let card;
    try { card = await db.collection('idcards').findOne({ _id: new ObjectId(req.params.id) }); }
    catch { card = await db.collection('idcards').findOne({ cardNumber: req.params.id }); }
    if (!card) return res.json({ error: 'Card not found' });
    res.json(card);
  } catch (e) { res.json({ error: e.message }); }
});

// DELETE /api/cards/:id
app.delete('/api/cards/:id', authMiddleware, async (req, res) => {
  try {
    let result;
    try { result = await db.collection('idcards').deleteOne({ _id: new ObjectId(req.params.id) }); }
    catch { result = await db.collection('idcards').deleteOne({ cardNumber: req.params.id }); }
    await db.collection('history').insertOne({
      cardNumber: req.params.id, action: 'deleted',
      actionDetails: 'Card deleted by admin',
      actionBy: req.user.name || req.user.email,
      createdAt: new Date()
    });
    res.json({ success: true });
  } catch (e) { res.json({ error: e.message }); }
});

// POST /api/cards/:id/print
app.post('/api/cards/:id/print', authMiddleware, async (req, res) => {
  try {
    let card;
    try { await db.collection('idcards').updateOne({ _id: new ObjectId(req.params.id) }, { $inc: { printCount: 1 } }); }
    catch { await db.collection('idcards').updateOne({ cardNumber: req.params.id }, { $inc: { printCount: 1 } }); }
    await db.collection('history').insertOne({
      cardNumber: req.params.id, action: 'printed',
      actionDetails: 'Card printed',
      actionBy: req.user.name || req.user.email,
      createdAt: new Date()
    });
    res.json({ success: true });
  } catch (e) { res.json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════
// DASHBOARD ROUTE
// ═══════════════════════════════════════════════════════════
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const [totalCards, activeCards, studentCards, facultyCards, staffCards, todayCards, totalUsers, recentActivity] = await Promise.all([
      db.collection('idcards').countDocuments({}),
      db.collection('idcards').countDocuments({ status: 'active' }),
      db.collection('idcards').countDocuments({ cardType: 'student' }),
      db.collection('idcards').countDocuments({ cardType: 'faculty' }),
      db.collection('idcards').countDocuments({ cardType: 'staff' }),
      db.collection('idcards').countDocuments({ createdAt: { $gte: today } }),
      db.collection('users').countDocuments({}),
      db.collection('history').find({}).sort({ createdAt: -1 }).limit(5).toArray()
    ]);
    res.json({ totalCards, activeCards, studentCards, facultyCards, staffCards, todayCards, totalUsers, recentActivity });
  } catch (e) { res.json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════
// HISTORY ROUTE
// ═══════════════════════════════════════════════════════════
app.get('/api/history', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, action } = req.query;
    const filter = {};
    if (action) filter.action = action;
    const total = await db.collection('history').countDocuments(filter);
    const history = await db.collection('history')
      .find(filter).sort({ createdAt: -1 })
      .skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit)).toArray();
    res.json({ history, total, page: parseInt(page), pages: Math.ceil(total/parseInt(limit)) });
  } catch (e) { res.json({ error: e.message }); }
});

app.get('/api/history/:cardId', authMiddleware, async (req, res) => {
  try {
    const history = await db.collection('history').find({ cardNumber: req.params.cardId }).sort({ createdAt: -1 }).toArray();
    res.json({ history, total: history.length });
  } catch (e) { res.json({ error: e.message }); }
});

// Root redirect
app.get('/', (req, res) => res.redirect('/login.html'));
