require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'errornest_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

app.use(cors());
app.use(express.json());

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const users = db.getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });

  const users = db.getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: 'Email already registered.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    role: role || 'developer'
  };

  db.saveUsers([...users, newUser]);
  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ─── Email Helper ─────────────────────────────────────────────────────────────
function triggerSimulatedEmail(toName, bugId, bugTitle, priority, severity, reporter, type = 'assigned') {
  if (!toName || toName === 'Unassigned') return;
  const emailAddress = `${toName.toLowerCase().replace(/\s+/g, '.')}@errornest.com`;
  let subject = '', body = '';

  if (type === 'assigned') {
    subject = `[ERROR NEST] New Bug Assignment: ${bugId}`;
    body = `Hello ${toName},\n\nYou have been assigned a ${priority} priority bug: "${bugTitle}" (ID: ${bugId}).\n\nPriority: ${priority}\nSeverity: ${severity}\nReporter: ${reporter}\n\nPlease inspect at http://localhost:5173/`;
  } else if (type === 'status_change') {
    subject = `[ERROR NEST] Bug Status Updated: ${bugId}`;
    body = `Hello,\n\nThe status of bug "${bugTitle}" (ID: ${bugId}) has been updated to: ${severity}.\n\nTrack at http://localhost:5173/`;
  }

  const newEmail = {
    id: `em-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: emailAddress, subject, body,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };

  db.saveEmails([newEmail, ...db.getEmails()]);
}

// ─── Bugs ─────────────────────────────────────────────────────────────────────
app.get('/api/bugs', authMiddleware, (req, res) => {
  res.json(db.getBugs());
});

app.post('/api/bugs', authMiddleware, (req, res) => {
  const { title, description, steps, expected, actual, priority, severity, assignee, reporter, tags } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: 'Title and Description are required.' });

  const bugs = db.getBugs();
  const numericIds = bugs.map(b => parseInt(b.id.replace('EN-', ''), 10)).filter(n => !isNaN(n));
  const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101;
  const newId = `EN-${nextNum}`;

  const newBug = {
    id: newId, title, description,
    steps: steps || '', expected: expected || '', actual: actual || '',
    priority: priority || 'medium', severity: severity || 'medium',
    assignee: assignee || 'Unassigned',
    reporter: reporter || req.user.name,
    tags: tags || ['bug'],
    status: 'backlog',
    createdDate: new Date().toISOString(),
    comments: []
  };

  db.saveBugs([newBug, ...bugs]);

  const activities = db.getActivities();
  db.saveActivities([{
    id: `act-${Date.now()}`,
    user: reporter || req.user.name,
    action: 'reported a new bug',
    target: newId,
    time: 'Just now'
  }, ...activities]);

  if (assignee && assignee !== 'Unassigned')
    triggerSimulatedEmail(assignee, newId, title, priority, severity, reporter, 'assigned');

  res.status(201).json(newBug);
});

app.put('/api/bugs/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const bugs = db.getBugs();
  const index = bugs.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Bug not found.' });

  const oldBug = bugs[index];
  const newBug = { ...oldBug, ...req.body };
  bugs[index] = newBug;
  db.saveBugs(bugs);

  if (oldBug.assignee !== newBug.assignee && newBug.assignee !== 'Unassigned')
    triggerSimulatedEmail(newBug.assignee, newBug.id, newBug.title, newBug.priority, newBug.severity, newBug.reporter, 'assigned');

  res.json(newBug);
});

app.delete('/api/bugs/:id', authMiddleware, (req, res) => {
  const bugs = db.getBugs();
  const filtered = bugs.filter(b => b.id !== req.params.id);
  if (bugs.length === filtered.length) return res.status(404).json({ error: 'Bug not found.' });
  db.saveBugs(filtered);
  res.json({ message: `Bug ${req.params.id} deleted.` });
});

// ─── Team ─────────────────────────────────────────────────────────────────────
app.get('/api/team', authMiddleware, (req, res) => res.json(db.getTeam()));

app.post('/api/team', authMiddleware, (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'Name and Role are required.' });
  const newMember = {
    id: `usr-${Date.now()}`, name, role,
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  };
  db.saveTeam([...db.getTeam(), newMember]);
  res.status(201).json(newMember);
});

app.delete('/api/team/:id', authMiddleware, (req, res) => {
  const team = db.getTeam();
  const filtered = team.filter(m => m.id !== req.params.id);
  if (team.length === filtered.length) return res.status(404).json({ error: 'Member not found.' });
  db.saveTeam(filtered);
  res.json({ message: 'Team member removed.' });
});

// ─── Activities ───────────────────────────────────────────────────────────────
app.get('/api/activities', authMiddleware, (req, res) => res.json(db.getActivities()));

app.post('/api/activities', authMiddleware, (req, res) => {
  const { user, action, target } = req.body;
  if (!user || !action || !target)
    return res.status(400).json({ error: 'User, action, and target are required.' });
  const newActivity = {
    id: `act-${Date.now()}`, user, action, target, time: 'Just now'
  };
  db.saveActivities([newActivity, ...db.getActivities()]);
  res.status(201).json(newActivity);
});

// ─── Emails ───────────────────────────────────────────────────────────────────
app.get('/api/emails', authMiddleware, (req, res) => res.json(db.getEmails()));

app.post('/api/emails/clear', authMiddleware, (req, res) => {
  db.saveEmails([]);
  res.json({ message: 'Email log cleared.' });
});

// ─── Reset ────────────────────────────────────────────────────────────────────
app.post('/api/reset', authMiddleware, (req, res) => {
  db.resetDb();
  res.json({ message: 'Database reset successfully.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ERROR NEST backend running on http://localhost:${PORT}`);
});
