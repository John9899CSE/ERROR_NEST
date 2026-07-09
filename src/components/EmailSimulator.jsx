import React, { useState, useEffect } from 'react';

export default function EmailSimulator() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/emails');
      if (res.ok) {
        const data = await res.json();
        setEmails(data);
      }
    } catch (e) {
      console.error('Error fetching emails:', e);
    }
  };

  useEffect(() => {
    fetchEmails();
    // Poll every 5 seconds to simulate real-time mail arrival
    const interval = setInterval(fetchEmails, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear the email log simulator?')) return;
    try {
      const res = await fetch('/api/emails/clear', { method: 'POST' });
      if (res.ok) {
        setEmails([]);
        setSelectedEmail(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEmails = emails.filter(em => 
    em.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    em.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    em.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="email-simulator-view">
      <h1 className="page-title">
        Email Notification Simulator
        {emails.length > 0 && (
          <button className="btn btn-danger" onClick={handleClearLogs} style={{ padding: '8px 16px', fontSize: '12px' }}>
            Clear Logs
          </button>
        )}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
        This module simulates email alerts triggered and dispatched to team members when bugs are created, assigned, or updated.
      </p>

      <div className="dashboard-layout" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
        {/* Email Inbox List */}
        <div className="dashboard-panel" style={{ height: '550px', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <span className="panel-title">Outbox ({emails.length})</span>
            <input
              type="text"
              placeholder="Search mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '150px', padding: '6px 10px', fontSize: '12px' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {filteredEmails.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No emails dispatched.
              </div>
            ) : (
              filteredEmails.map((em) => (
                <div
                  key={em.id}
                  onClick={() => setSelectedEmail(em)}
                  style={{
                    backgroundColor: selectedEmail?.id === em.id ? 'var(--bg-surface-hover)' : 'var(--bg-input)',
                    border: `1px solid ${selectedEmail?.id === em.id ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: '#fff' }}>{em.to}</strong>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{formatDate(em.timestamp)}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {em.subject}
                  </div>
                  <span style={{ fontSize: '9px', padding: '1px 6px', backgroundColor: 'rgba(46, 213, 115, 0.15)', color: '#2ed573', borderRadius: '4px', display: 'inline-block', marginTop: '6px', fontWeight: 'bold' }}>
                    {em.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Email Reader */}
        <div className="dashboard-panel" style={{ height: '550px', display: 'flex', flexDirection: 'column' }}>
          {selectedEmail ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', width: '60px' }}>To:</span>
                  <strong style={{ color: '#fff', fontSize: '13px' }}>{selectedEmail.to}</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', width: '60px' }}>Subject:</span>
                  <strong style={{ color: 'var(--color-secondary)', fontSize: '13px' }}>{selectedEmail.subject}</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px', width: '60px' }}>Date:</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div style={{
                flex: 1,
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '13px',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
                overflowY: 'auto'
              }}>
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', opacity: 0.5 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Select an email from the outbox to inspect the message body.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
