import React, { useState } from 'react';

export default function BugList({ bugs, onSelectBug }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // CSV Exporter
  const handleExportCSV = () => {
    if (filteredBugs.length === 0) {
      alert('No bugs available to export.');
      return;
    }

    const headers = ['ID', 'Title', 'Description', 'Steps', 'Expected', 'Actual', 'Status', 'Priority', 'Severity', 'Assignee', 'Reporter', 'Created Date'];
    const rows = filteredBugs.map(bug => [
      bug.id,
      bug.title,
      bug.description.replace(/\n/g, ' '),
      (bug.steps || '').replace(/\n/g, ' '),
      (bug.expected || '').replace(/\n/g, ' '),
      (bug.actual || '').replace(/\n/g, ' '),
      bug.status,
      bug.priority,
      bug.severity,
      bug.assignee,
      bug.reporter,
      bug.createdDate
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `error_nest_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering Logic
  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? bug.status === statusFilter : true;
    const matchesPriority = priorityFilter ? bug.priority === priorityFilter : true;
    const matchesSeverity = severityFilter ? bug.severity === severityFilter : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesSeverity;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'backlog': return 'Backlog';
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'review': return 'In Review';
      case 'done': return 'Resolved';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'backlog':     return '#64748b';
      case 'todo':        return 'var(--color-open)';
      case 'in-progress': return 'var(--color-in-progress)';
      case 'review':      return 'var(--color-review)';
      case 'done':        return 'var(--color-resolved)';
      default: return 'var(--text-primary)';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'critical': return { color: '#f43f5e', fontWeight: 'bold' };
      case 'high':     return { color: '#fb923c' };
      case 'medium':   return { color: '#c084fc' };
      case 'low': default: return { color: '#60a5fa' };
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return { backgroundColor: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' };
      case 'high':     return { backgroundColor: 'rgba(249,115,22,0.15)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)' };
      case 'medium':   return { backgroundColor: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' };
      case 'low': default: return { backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' };
    }
  };

  return (
    <div className="list-view">
      <h1 className="page-title">Bug Registry</h1>

      {/* Advanced Filtering controls */}
      <div className="table-controls">
        <div className="search-bar" style={{ width: '300px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, title, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Resolved</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            className="filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={handleExportCSV}
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            Export CSV
          </button>

          {(statusFilter || priorityFilter || severityFilter || searchQuery) && (
            <button
              className="btn"
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
                setSeverityFilter('');
                setSearchQuery('');
              }}
              style={{ padding: '8px 12px', fontSize: '12px' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Bug Table */}
      <div className="bug-table-container">
        <table className="bug-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bug Summary</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Severity</th>
              <th>Assignee</th>
              <th>Reporter</th>
            </tr>
          </thead>
          <tbody>
            {filteredBugs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  No bugs found matching search criteria.
                </td>
              </tr>
            ) : (
              filteredBugs.map((bug) => (
                <tr key={bug.id} onClick={() => onSelectBug(bug)}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{bug.id}</td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{bug.title}</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {bug.tags.map(tag => (
                        <span key={tag} className="bug-tag" style={{ fontSize: '9px', padding: '0px 4px' }}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className="status-pill"
                      style={{
                        color: getStatusColor(bug.status),
                        backgroundColor: `${getStatusColor(bug.status)}15`,
                        border: `1px solid ${getStatusColor(bug.status)}25`
                      }}
                    >
                      {getStatusLabel(bug.status)}
                    </span>
                  </td>
                  <td>
                    <span style={getPriorityStyle(bug.priority)}>
                      {bug.priority}
                    </span>
                  </td>
                  <td>
                    <span className="bug-severity-badge" style={{ ...getSeverityStyle(bug.severity), display: 'inline-block' }}>
                      {bug.severity}
                    </span>
                  </td>
                  <td>{bug.assignee}</td>
                  <td>{bug.reporter}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
