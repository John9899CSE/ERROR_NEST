import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, currentRole, setCurrentRole }) {
  const menuItems = [
    {
      id: 'dashboard', label: 'Dashboard',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
    },
    {
      id: 'board', label: 'Bugs',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
    },
    {
      id: 'list', label: 'Reports',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    },
    {
      id: 'team', label: 'Team',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      id: 'emails', label: 'Settings',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Body */}
            <ellipse cx="12" cy="14" rx="5" ry="6" />
            {/* Head */}
            <path d="M9 9a3 3 0 0 1 6 0" />
            {/* Code symbol */}
            <path d="M10 13.5l-1.5 1 1.5 1" />
            <path d="M14 13.5l1.5 1-1.5 1" />
            <line x1="11.5" y1="16" x2="12.5" y2="12.5" />
            {/* Legs */}
            <path d="M7 11l-3-2" /><path d="M7 13l-3.5 0" /><path d="M7 15l-3 2" />
            <path d="M17 11l3-2" /><path d="M17 13l3.5 0" /><path d="M17 15l3 2" />
            {/* Antennae */}
            <path d="M10 8.5l-2-2.5" /><path d="M14 8.5l2-2.5" />
          </svg>
        </div>
        <div className="logo-text">ERROR<br/>NEST</div>
      </div>

      <nav className="nav-links">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ marginBottom: '12px' }}>
        <button className="nav-item" onClick={() => setActiveTab('report')} style={{ width: '100%', background: activeTab === 'report' ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(168,85,247,0.1))' : 'none', border: activeTab === 'report' ? '1px solid rgba(124,58,237,0.35)' : '1px solid transparent', color: activeTab === 'report' ? '#fff' : 'var(--text-secondary)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Report Bug
        </button>
      </div>

      <div className="role-section">
        <div className="role-label">Simulate Role</div>
        <select className="role-selector" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)}>
          <option value="admin">Project Manager</option>
          <option value="developer">Developer</option>
          <option value="qa">QA Engineer</option>
        </select>
      </div>
    </aside>
  );
}
