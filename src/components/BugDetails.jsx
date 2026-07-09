import React, { useState } from 'react';
import { teamMembers } from '../data/initialData';

export default function BugDetails({ bug, onClose, onUpdateBug, onDeleteBug, currentRole }) {
  const [commentText, setCommentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!bug) return null;

  const handleStatusChange = (e) => {
    const updatedBug = { ...bug, status: e.target.value };
    onUpdateBug(updatedBug, `moved to ${e.target.value}`);
  };

  const handleAssigneeChange = (e) => {
    const updatedBug = { ...bug, assignee: e.target.value };
    onUpdateBug(updatedBug, `assigned to ${e.target.value}`);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Determine author based on current role
    let author = 'Anonymous';
    if (currentRole === 'admin') author = 'Alice Vance';
    else if (currentRole === 'developer') author = 'Bob Miller';
    else if (currentRole === 'qa') author = 'Diana Prince';

    const newComment = {
      id: `c-${Date.now()}`,
      author,
      text: commentText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedBug = {
      ...bug,
      comments: [...(bug.comments || []), newComment]
    };

    onUpdateBug(updatedBug, 'added a comment');
    setCommentText('');
  };

  const handleDelete = () => {
    if (currentRole !== 'admin') {
      alert('Only Project Managers can delete bugs.');
      return;
    }
    
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteBug(bug.id);
    }, 300);
  };

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

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div 
        className={`drawer ${isDeleting ? 'shake' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
              BUG DETAILS • {bug.id}
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>
              {bug.title}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Metadata Grid */}
          <div className="section-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <select 
                className="form-select" 
                value={bug.status} 
                onChange={handleStatusChange}
                style={{ padding: '6px 10px', fontSize: '12px' }}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Resolved</option>
              </select>
            </div>

            <div className="meta-item">
              <span className="meta-label">Assignee</span>
              <select 
                className="form-select" 
                value={bug.assignee} 
                onChange={handleAssigneeChange}
                style={{ padding: '6px 10px', fontSize: '12px' }}
              >
                <option value="Unassigned">Unassigned</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div className="meta-item">
              <span className="meta-label">Priority</span>
              <span className="meta-value" style={{ textTransform: 'capitalize', color: bug.priority === 'critical' ? 'var(--color-critical)' : 'inherit' }}>
                {bug.priority}
              </span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Severity</span>
              <span className="meta-value" style={{ textTransform: 'capitalize' }}>
                {bug.severity}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="drawer-section">
            <span className="section-label">Detailed Description</span>
            <div className="section-content">{bug.description}</div>
          </div>

          {/* Steps to Reproduce Section */}
          {bug.steps && (
            <div className="drawer-section">
              <span className="section-label">Steps to Reproduce</span>
              <div className="section-content">{bug.steps}</div>
            </div>
          )}

          {/* Expected vs Actual Section */}
          {(bug.expected || bug.actual) && (
            <div className="drawer-section">
              <span className="section-label">Expected vs Actual Result</span>
              <div className="section-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bug.expected && (
                  <div>
                    <strong style={{ color: 'var(--color-resolved)' }}>Expected:</strong> {bug.expected}
                  </div>
                )}
                {bug.actual && (
                  <div>
                    <strong style={{ color: 'var(--color-open)' }}>Actual:</strong> {bug.actual}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <span className="section-label">Discussion Thread</span>
            
            <div className="comments-list">
              {(!bug.comments || bug.comments.length === 0) ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '10px 0' }}>
                  No comments yet. Start the conversation below.
                </div>
              ) : (
                bug.comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="comment-author-info">
                        <div className="avatar" style={{ width: '20px', height: '20px', fontSize: '9px' }}>
                          {comment.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="comment-author-name">{comment.author}</span>
                      </div>
                      <span className="comment-time">{formatDate(comment.timestamp)}</span>
                    </div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="comment-input-area">
              <input
                type="text"
                placeholder="Post a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="comment-input"
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Reported by <strong>{bug.reporter}</strong> on {formatDate(bug.createdDate)}
          </div>
          {currentRole === 'admin' && (
            <button className="btn btn-danger" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '2px'}}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Delete Bug
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
