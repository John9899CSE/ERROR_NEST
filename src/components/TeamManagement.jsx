import React, { useState, useEffect } from 'react';

export default function TeamManagement({ bugs, currentRole }) {
  const [team, setTeam] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Developer');

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (currentRole !== 'admin') {
      alert('Only Project Managers can add team members.');
      return;
    }

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), role })
      });
      if (res.ok) {
        setName('');
        fetchTeam();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (currentRole !== 'admin') {
      alert('Only Project Managers can remove team members.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the project?`)) return;

    try {
      const res = await fetch(`/api/team/${memberId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTeam();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Compute workload for each team member
  const getWorkload = (memberName) => {
    return bugs.filter(b => b.assignee === memberName && b.status !== 'done').length;
  };

  const getCompletedCount = (memberName) => {
    return bugs.filter(b => b.assignee === memberName && b.status === 'done').length;
  };

  return (
    <div className="team-management-view">
      <h1 className="page-title">Team Workspace</h1>
      <div className="page-subtitle" style={{ marginBottom: 20 }}>Manage team members and view workload</div>

      <div className="dashboard-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Left Side: Members List */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">Active Collaborators</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '10px' }}>
            {team.map((member) => {
              const activeCount = getWorkload(member.name);
              const completedCount = getCompletedCount(member.name);
              return (
                <div
                  key={member.id}
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    position: 'relative'
                  }}
                >
                  {/* Delete button (Visible to PM) */}
                  {currentRole === 'admin' && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Remove Member"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}

                  <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px' }}>
                    {member.avatar}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <strong style={{ color: '#fff', fontSize: '15px', display: 'block' }}>{member.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{member.role}</span>
                  </div>

                  {/* Workload Stats */}
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px',
                    marginTop: '8px',
                    fontSize: '11px'
                  }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Active Issues</span>
                      <strong style={{ color: activeCount > 0 ? 'var(--color-primary)' : 'var(--text-secondary)', fontSize: '13px' }}>{activeCount}</strong>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Resolved</span>
                      <strong style={{ color: 'var(--color-resolved)', fontSize: '13px' }}>{completedCount}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Add Member Form (Requires Admin/PM Role) */}
        <div className="dashboard-panel" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <span className="panel-title">Add Team Member</span>
          </div>

          {currentRole !== 'admin' ? (
            <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '8px', opacity: 0.5 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p>Only **Project Managers** can add new members. Switch your simulator role in the sidebar.</p>
            </div>
          ) : (
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="Project Manager">Project Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="QA Engineer">QA Engineer</option>
                  <option value="DevOps Specialist">DevOps Specialist</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Add Member
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
