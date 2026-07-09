import React from 'react';

// Mini sparkline SVG
function Sparkline({ color, type = 'line' }) {
  if (type === 'bar') {
    const bars = [30, 55, 40, 70, 50, 85, 65];
    return (
      <svg className="metric-sparkline" viewBox="0 0 80 40" preserveAspectRatio="none">
        {bars.map((h, i) => (
          <rect key={i} x={i * 12} y={40 - h * 0.4} width="8" height={h * 0.4}
            fill={color} rx="2" opacity={0.6 + i * 0.05} />
        ))}
      </svg>
    );
  }
  const points = type === 'resolved'
    ? [[0,32],[10,28],[20,24],[30,26],[40,18],[50,14],[60,10],[70,8],[80,5]]
    : [[0,30],[10,20],[20,25],[30,15],[40,22],[50,10],[60,18],[70,8],[80,12]];
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${path} L80,40 L0,40 Z`;
  return (
    <svg className="metric-sparkline" viewBox="0 0 80 40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`}/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// SVG Line chart
function LineChart({ bugs }) {
  const weeks = ['Oct 2', '5-6', '11-18', '21-26', '26'];
  const series = [
    { label: 'Critical', color: '#ec4899', data: [20, 45, 100, 120, 90] },
    { label: 'High',     color: '#a855f7', data: [50, 60, 55, 70, 80] },
    { label: 'Medium',   color: '#3b82f6', data: [30, 45, 60, 50, 65] },
    { label: 'Low',      color: '#06b6d4', data: [15, 20, 30, 25, 40] },
  ];
  const W = 440, H = 160, padL = 30, padB = 24, padT = 10, padR = 10;
  const maxV = 200;
  const gridLines = [0, 50, 100, 150, 200];
  const xScale = (i) => padL + (i / (weeks.length - 1)) * (W - padL - padR);
  const yScale = (v) => padT + (1 - v / maxV) * (H - padT - padB);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
        {series.map(s => (
          <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="line-chart-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {gridLines.map(v => (
            <g key={v}>
              <line x1={padL} y1={yScale(v)} x2={W - padR} y2={yScale(v)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4"/>
              <text x={padL - 5} y={yScale(v) + 4} fill="#475569" fontSize="9" textAnchor="end">{v}</text>
            </g>
          ))}
          {weeks.map((w, i) => (
            <text key={w} x={xScale(i)} y={H - 4} fill="#475569" fontSize="9" textAnchor="middle">{w}</text>
          ))}
          {series.map(s => {
            const pts = s.data.map((v, i) => [xScale(i), yScale(v)]);
            const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
            return (
              <g key={s.label}>
                <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={s.color} stroke="var(--bg-card)" strokeWidth="1.5"/>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// SVG Donut Chart
function DonutChart({ bugs }) {
  const total = bugs.length || 1;
  const slices = [
    { label: 'Open',        color: '#3b82f6', count: bugs.filter(b => b.status === 'todo').length },
    { label: 'In Progress', color: '#a855f7', count: bugs.filter(b => b.status === 'in-progress').length },
    { label: 'Testing',     color: '#06b6d4', count: bugs.filter(b => b.status === 'review').length },
    { label: 'Closed',      color: '#94a3b8', count: bugs.filter(b => b.status === 'done').length },
  ];

  const R = 50, r = 30, cx = 60, cy = 60;
  let startAngle = -Math.PI / 2;
  const paths = slices.map(s => {
    const angle = (s.count / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + R * Math.cos(startAngle), y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle), y2 = cy + R * Math.sin(endAngle);
    const ix1 = cx + r * Math.cos(startAngle), iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(endAngle), iy2 = cy + r * Math.sin(endAngle);
    const large = angle > Math.PI ? 1 : 0;
    const midAngle = startAngle + angle / 2;
    const lx = cx + (R + r) / 2 * Math.cos(midAngle);
    const ly = cy + (R + r) / 2 * Math.sin(midAngle);
    const d = `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${r},${r} 0 ${large},0 ${ix1},${iy1} Z`;
    const pct = Math.round((s.count / total) * 100);
    startAngle = endAngle;
    return { ...s, d, lx, ly, pct };
  });

  return (
    <div className="donut-wrapper">
      <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
        {paths.map(p => (
          <g key={p.label}>
            <path d={p.d} fill={p.color} opacity="0.9"/>
            {p.pct > 5 && (
              <text x={p.lx} y={p.ly + 4} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">{p.pct}%</text>
            )}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={r - 2} fill="var(--bg-card)"/>
      </svg>
      <div className="donut-legend">
        {slices.map(s => (
          <div key={s.label} className="donut-legend-item">
            <span className="donut-dot" style={{ background: s.color }}/>
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ bugs, activities, setActiveTab, onSelectBug }) {
  const totalBugs = bugs.length;
  const activeBugs = bugs.filter(b => b.status !== 'done').length;
  const resolvedBugs = bugs.filter(b => b.status === 'done').length;
  const pendingReview = bugs.filter(b => b.status === 'review').length;
  const criticalBugs = bugs.filter(b => b.priority === 'critical').length;
  const highBugs = bugs.filter(b => b.priority === 'high').length;
  const medBugs = bugs.filter(b => b.priority === 'medium').length;
  const lowBugs = bugs.filter(b => b.priority === 'low').length;
  const maxP = Math.max(criticalBugs, highBugs, medBugs, lowBugs, 1);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <h1 className="page-title">
        Dashboard Overview
        <div className="filter-btn-group">
          <button className="filter-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
            Project ▾
          </button>
          <button className="filter-btn">
            Status ▾
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('report')} style={{ fontSize: '12px', padding: '7px 14px' }}>
            + Report Bug
          </button>
        </div>
      </h1>
      <div className="page-subtitle">{dateStr} | {timeStr}</div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Active Bugs</span>
          </div>
          <div className="metric-value">
            {activeBugs.toLocaleString()}
            <span className="metric-badge up">+12% this week</span>
          </div>
          <Sparkline color="#a855f7" type="line" />
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Bugs Resolved</span>
          </div>
          <div className="metric-value">
            {resolvedBugs.toLocaleString()}
            <span className="metric-badge up">+8%</span>
          </div>
          <Sparkline color="#06b6d4" type="resolved" />
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Critical Issues</span>
          </div>
          <div className="metric-value">
            {criticalBugs}
            <span className="metric-badge alert">{criticalBugs > 0 ? `${criticalBugs} new` : 'none'}</span>
          </div>
          <Sparkline color="#f43f5e" type="bar" />
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-label">Pending Review</span>
          </div>
          <div className="metric-value">
            {pendingReview}
            <span className="metric-badge alert">{pendingReview} new</span>
          </div>
          <div style={{ height: 40, marginTop: 8, background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))', borderRadius: 4, width: `${Math.min((pendingReview/Math.max(totalBugs,1))*100, 100)}%`, minWidth: 20, opacity: 0.7 }} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-layout">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Line chart */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <span className="panel-title">Bug Priority Trends</span>
              <span className="panel-subtitle">Oct 2-26, 2023</span>
            </div>
            <LineChart bugs={bugs} />
          </div>

          {/* Donut + Priority bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="dashboard-panel">
              <div className="panel-header">
                <span className="panel-title">Bug Status Distribution</span>
              </div>
              <DonutChart bugs={bugs} />
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <span className="panel-title">By Priority</span>
                <button className="filter-btn" style={{ fontSize: 10, padding: '3px 8px' }}>Filters ▾</button>
              </div>
              <div className="priority-bar-list">
                {[
                  { label: 'Critical', count: criticalBugs, color: '#f43f5e', icon: '⚡' },
                  { label: 'High',     count: highBugs,     color: '#f97316', icon: '🔥' },
                  { label: 'Medium',   count: medBugs,      color: '#a855f7', icon: '≡' },
                  { label: 'Low',      count: lowBugs,      color: '#3b82f6', icon: '↓' },
                ].map(p => (
                  <div key={p.label} className="priority-bar-item">
                    <span className="priority-bar-label">
                      <span>{p.icon}</span> {p.label}
                    </span>
                    <div className="priority-bar-track">
                      <div className="priority-bar-fill" style={{ width: `${(p.count / maxP) * 100}%`, background: p.color }} />
                    </div>
                    <span className="priority-bar-count">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Recent Activity */}
        <div className="dashboard-panel" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <span className="panel-title">Recent Bug Activity</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>Status</span>
            <span>Reported</span>
          </div>
          <div className="activity-list">
            {activities.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>No recent activity.</div>
            ) : (
              activities.slice(0, 8).map((act) => {
                const matchingBug = bugs.find(b => b.id === act.target);
                return (
                  <div key={act.id} className="activity-item">
                    <div className="activity-marker" style={{
                      backgroundColor: matchingBug
                        ? (matchingBug.priority === 'critical' ? '#f43f5e' : matchingBug.priority === 'high' ? '#f97316' : '#a855f7')
                        : 'var(--color-primary)'
                    }} />
                    <div className="activity-details">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {matchingBug && (
                          <span className="activity-bug-id" onClick={() => onSelectBug(matchingBug)}>
                            #{act.target}
                          </span>
                        )}
                        <span className="activity-desc">
                          <strong>{act.user.split(' ')[0]}</strong> {act.action}
                        </span>
                      </div>
                      {matchingBug && (
                        <span style={{ fontSize: 12, color: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={() => onSelectBug(matchingBug)}>
                          {matchingBug.title}
                        </span>
                      )}
                      <span className="activity-time">{act.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
