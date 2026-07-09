import React, { useState } from 'react';
import { teamMembers } from '../data/initialData';

export default function ReportBug({ onSubmitBug, currentRole, setActiveTab }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [priority, setPriority] = useState('medium');
  const [severity, setSeverity] = useState('medium');
  const [assignee, setAssignee] = useState('Unassigned');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the Title and Description fields.');
      return;
    }

    // Determine reporter based on active role simulation
    let reporter = 'Diana Prince'; // default QA
    if (currentRole === 'admin') reporter = 'Alice Vance';
    else if (currentRole === 'developer') reporter = 'Bob Miller';

    // Parse tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const newBug = {
      title: title.trim(),
      description: description.trim(),
      steps: steps.trim(),
      expected: expected.trim(),
      actual: actual.trim(),
      priority,
      severity,
      assignee,
      reporter,
      tags: tags.length > 0 ? tags : ['bug']
    };

    onSubmitBug(newBug);
    setActiveTab('board'); // redirect to board
  };

  return (
    <div className="report-bug-view">
      <h1 className="page-title">Report New Issue</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* Title */}
            <div className="form-group full-width">
              <label className="form-label">Issue Summary / Title *</label>
              <input
                type="text"
                placeholder="e.g. Server crashes when uploading large files"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">Detailed Description *</label>
              <textarea
                placeholder="Provide a detailed explanation of the bug and how it behaves..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                required
              />
            </div>

            {/* Steps to Reproduce */}
            <div className="form-group full-width">
              <label className="form-label">Steps to Reproduce</label>
              <textarea
                placeholder="1. Go to settings page&#10;2. Click on upload avatar&#10;3. Select a file larger than 10MB&#10;4. Press save..."
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>

            {/* Expected Result */}
            <div className="form-group">
              <label className="form-label">Expected Result</label>
              <input
                type="text"
                placeholder="What should happen?"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Actual Result */}
            <div className="form-group">
              <label className="form-label">Actual Result</label>
              <input
                type="text"
                placeholder="What happens instead?"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Severity */}
            <div className="form-group">
              <label className="form-label">Severity</label>
              <select
                className="form-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-select"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="Unassigned">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. frontend, database, performance"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="form-input"
              />
            </div>

          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn"
              onClick={() => setActiveTab('board')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Bug Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
