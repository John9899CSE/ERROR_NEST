const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('en_token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    localStorage.removeItem('en_token');
    localStorage.removeItem('en_user');
    window.location.reload();
    return;
  }

  return res;
}

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),

  register: (name, email, password, role) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    }),

  // Bugs
  getBugs: () => request('GET', '/bugs'),
  createBug: (data) => request('POST', '/bugs', data),
  updateBug: (id, data) => request('PUT', `/bugs/${id}`, data),
  deleteBug: (id) => request('DELETE', `/bugs/${id}`),

  // Activities
  getActivities: () => request('GET', '/activities'),
  createActivity: (data) => request('POST', '/activities', data),

  // Team
  getTeam: () => request('GET', '/team'),
  addMember: (data) => request('POST', '/team', data),
  removeMember: (id) => request('DELETE', `/team/${id}`),

  // Emails
  getEmails: () => request('GET', '/emails'),
  clearEmails: () => request('POST', '/emails/clear'),
};
