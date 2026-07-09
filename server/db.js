const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Default initial database content
const defaultData = {
  users: [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'admin@errornest.com',
      password: '$2a$10$IzEosxT6a1hbaUMNZtW2vuxhyeOloGFGs607XZoKYHlggaFIM2MIa',
      role: 'admin'
    },
    {
      id: 'user-2',
      name: 'John Miller',
      email: 'dev@errornest.com',
      password: '$2a$10$IzEosxT6a1hbaUMNZtW2vuxhyeOloGFGs607XZoKYHlggaFIM2MIa',
      role: 'developer'
    },
    {
      id: 'user-3',
      name: 'Diana Prince',
      email: 'qa@errornest.com',
      password: '$2a$10$IzEosxT6a1hbaUMNZtW2vuxhyeOloGFGs607XZoKYHlggaFIM2MIa',
      role: 'qa'
    }
  ],
  team: [
    { id: 'usr-1', name: 'Alice Vance', role: 'Project Manager', avatar: 'AV' },
    { id: 'usr-2', name: 'Bob Miller', role: 'Developer', avatar: 'BM' },
    { id: 'usr-3', name: 'Charlie Green', role: 'Developer', avatar: 'CG' },
    { id: 'usr-4', name: 'Diana Prince', role: 'QA Engineer', avatar: 'DP' },
  ],
  bugs: [
    {
      id: 'EN-101',
      title: 'Payment Gateway timeout on Checkout page during Peak hours',
      description: 'During checkout processing, users are experiencing intermittent 504 Gateway Timeout errors when submitting credit card info. This is leading to abandoned carts and double charges in rare cases.',
      steps: '1. Add items to cart\n2. Proceed to checkout\n3. Input test credit card information\n4. Click "Pay Now" during simulated high traffic\n5. Observe timeout loader and subsequent 504 error screen.',
      expected: 'Payment processes within 3 seconds, redirection to success page, checkout state cleared.',
      actual: 'Spinner spins indefinitely, eventually failing with 504 Gateway Timeout.',
      status: 'in-progress',
      priority: 'critical',
      severity: 'critical',
      tags: ['billing', 'backend', 'api'],
      assignee: 'Bob Miller',
      reporter: 'Diana Prince',
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          id: 'c-1',
          author: 'Bob Miller',
          text: 'I investigated the logs; Stripe webhook retries are blocking the main processing thread. Optimizing the database transaction query should fix this.',
          timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'c-2',
          author: 'Alice Vance',
          text: 'This is blocking our release. Bob, please prioritize this today and let us know if you need help.',
          timestamp: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'EN-102',
      title: 'Dashboard charts are cut off on small tablet screens (responsive issue)',
      description: 'The SVG container for the bug resolution velocity chart does not resize properly on viewport widths between 768px and 1024px, causing the right edge of the chart to overflow and hide labels.',
      steps: '1. Navigate to Dashboard\n2. Open Chrome Developer Tools\n3. Select iPad Mini responsive preset (768px width)\n4. Notice the charts overflow the card boundary.',
      expected: 'All charts scale dynamically to fit the width of their container card.',
      actual: 'Charts remain fixed-width, overflowing card borders and hiding the right side.',
      status: 'todo',
      priority: 'medium',
      severity: 'low',
      tags: ['frontend', 'responsive', 'dashboard'],
      assignee: 'Charlie Green',
      reporter: 'Diana Prince',
      createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      comments: []
    },
    {
      id: 'EN-103',
      title: 'User session is cleared immediately upon manual page reload',
      description: 'When logged in, reloading the page via F5 or browser reload causes the application to dump the user session and redirect back to the Login screen. Session token should persist.',
      steps: '1. Log into the application\n2. Observe the dashboard screen\n3. Press F5 / browser reload\n4. Observe redirect to Login instead of remaining on Dashboard.',
      expected: 'Auth token should be stored in sessionStorage or localStorage so the session is preserved across refreshes.',
      actual: 'Session is held only in transient React state, so reloading resets it.',
      status: 'review',
      priority: 'high',
      severity: 'high',
      tags: ['auth', 'security'],
      assignee: 'Bob Miller',
      reporter: 'Alice Vance',
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          id: 'c-3',
          author: 'Bob Miller',
          text: 'PR is submitted. I moved the session token from local memory to sessionStorage.',
          timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'EN-104',
      title: 'SQL syntax error when searching bugs using single quotes',
      description: 'Entering text containing single quotes (e.g. "Bob\'s issue") in the dashboard bug search input triggers an unhandled SQL exception in the backend API logs.',
      steps: '1. Go to Bug List\n2. In search box, type "Bob\'s issue"\n3. Press enter or wait for debounce\n4. App hangs or displays generic error; API console reports SQL syntax error.',
      expected: 'Input should be parameterized/escaped correctly to prevent SQL errors or SQL Injection vulnerabilities.',
      actual: 'SQL parser crashes due to unescaped single quote.',
      status: 'backlog',
      priority: 'critical',
      severity: 'critical',
      tags: ['backend', 'security', 'database'],
      assignee: 'Unassigned',
      reporter: 'Diana Prince',
      createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      comments: []
    },
    {
      id: 'EN-105',
      title: 'Broken avatar images for team members without uploaded photos',
      description: 'When a team member has not uploaded a profile picture, the UI displays a broken image icon instead of falling back to their initials.',
      steps: '1. Open Team settings or Bug Board\n2. Find user "Charlie Green" (who has no photo)\n3. See the broken image graphic next to their name.',
      expected: 'Should render a clean circle with user initials ("CG") and a color background if image is missing.',
      actual: 'Renders empty img tag displaying browser default broken image icon.',
      status: 'done',
      priority: 'low',
      severity: 'low',
      tags: ['frontend', 'ux'],
      assignee: 'Charlie Green',
      reporter: 'Alice Vance',
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          id: 'c-4',
          author: 'Charlie Green',
          text: 'Added CSS initials fallback component for missing user avatars. Done!',
          timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ],
  activities: [
    { id: 'act-1', user: 'Charlie Green', action: 'completed the bug', target: 'EN-105', time: '5 hours ago' },
    { id: 'act-2', user: 'Bob Miller', action: 'moved to In Review', target: 'EN-103', time: 'Yesterday' },
    { id: 'act-3', user: 'Diana Prince', action: 'reported a new bug', target: 'EN-102', time: 'Yesterday' },
    { id: 'act-4', user: 'Bob Miller', action: 'started working on', target: 'EN-101', time: '2 days ago' },
  ],
  emails: [
    {
      id: 'em-1',
      to: 'bob@errornest.com',
      subject: '[ERROR NEST] New Bug Assignment: EN-101',
      body: 'Hello Bob Miller,\n\nYou have been assigned a critical priority bug: "Payment Gateway timeout on Checkout page during Peak hours".\n\nPriority: critical\nSeverity: critical\nReporter: Diana Prince\n\nPlease inspect and update status at http://localhost:5173/',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'sent'
    },
    {
      id: 'em-2',
      to: 'charlie@errornest.com',
      subject: '[ERROR NEST] New Bug Assignment: EN-102',
      body: 'Hello Charlie Green,\n\nYou have been assigned a medium priority bug: "Dashboard charts are cut off on small tablet screens".\n\nPriority: medium\nSeverity: low\nReporter: Diana Prince\n\nPlease inspect and update status at http://localhost:5173/',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'sent'
    }
  ]
};

// Initialize DB folder and file
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    console.log('Database initialized with default dataset.');
  }
}

function readDb() {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading database file, returning default data:', error);
    return defaultData;
  }
}

function writeDb(data) {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

module.exports = {
  getUsers: () => readDb().users || [],
  saveUsers: (users) => {
    const db = readDb();
    db.users = users;
    writeDb(db);
  },
  getBugs: () => readDb().bugs,
  saveBugs: (bugs) => {
    const db = readDb();
    db.bugs = bugs;
    writeDb(db);
  },
  getTeam: () => readDb().team,
  saveTeam: (team) => {
    const db = readDb();
    db.team = team;
    writeDb(db);
  },
  getActivities: () => readDb().activities,
  saveActivities: (activities) => {
    const db = readDb();
    db.activities = activities;
    writeDb(db);
  },
  getEmails: () => readDb().emails,
  saveEmails: (emails) => {
    const db = readDb();
    db.emails = emails;
    writeDb(db);
  },
  // Reset database back to default
  resetDb: () => writeDb(defaultData)
};
