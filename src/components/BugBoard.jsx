import React from 'react';

export default function BugBoard({ bugs, onUpdateBugStatus, onSelectBug }) {
  const columns = [
    { id: 'backlog',     title: 'Backlog',      color: '#64748b' },
    { id: 'todo',        title: 'To Do',        color: '#f43f5e' },
    { id: 'in-progress', title: 'In Progress',  color: '#f59e0b' },
    { id: 'review',      title: 'In Review',    color: '#3b82f6' },
    { id: 'done',        title: 'Resolved',     color: '#10b981' },
  ];

  // Drag and Drop handlers
  const handleDragStart = (e, bugId) => {
    e.dataTransfer.setData('text/plain', bugId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const bugId = e.dataTransfer.getData('text/plain');
    if (bugId) {
      onUpdateBugStatus(bugId, targetStatus);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#f43f5e';
      case 'high':     return '#fb923c';
      case 'medium':   return '#c084fc';
      case 'low': default: return '#60a5fa';
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'Unassigned') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="board-view">
      <h1 className="page-title">
        Kanban Board
        <div className="filter-btn-group">
          <button className="filter-btn">Status ▾</button>
          <button className="filter-btn">Priority ▾</button>
        </div>
      </h1>
      
      <div className="board-container">
        {columns.map((col) => {
          const colBugs = bugs.filter((b) => b.status === col.id);
          return (
            <div
              key={col.id}
              className="board-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div className="column-header-left">
                  <span className="column-indicator" style={{ backgroundColor: col.color }} />
                  <span className="column-title">{col.title}</span>
                </div>
                <span className="column-count">{colBugs.length}</span>
              </div>

              <div className="column-cards">
                {colBugs.map((bug) => (
                  <div
                    key={bug.id}
                    className="bug-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, bug.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onSelectBug(bug)}
                  >
                    <div className="bug-card-header">
                      <span className="bug-id">{bug.id}</span>
                      <span className="bug-severity-badge" style={getSeverityStyle(bug.severity)}>
                        {bug.severity}
                      </span>
                    </div>

                    <div className="bug-title">{bug.title}</div>

                    <div className="bug-card-tags">
                      {bug.tags.map((tag) => (
                        <span key={tag} className="bug-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="bug-card-footer">
                      <div className="bug-priority">
                        <span
                          className="priority-dot"
                          style={{ backgroundColor: getPriorityColor(bug.priority) }}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{bug.priority}</span>
                      </div>

                      <div className="bug-assignee" title={`Assigned to ${bug.assignee}`}>
                        <div className="assignee-avatar">
                          {getInitials(bug.assignee)}
                        </div>
                        <span className="assignee-name">
                          {bug.assignee ? bug.assignee.split(' ')[0] : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {colBugs.length === 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifycontent: 'center',
                    flexGrow: 1,
                    minHeight: '120px',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    textAlign: 'center',
                    padding: '20px'
                  }}>
                    Drag bugs here or report a new one
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
