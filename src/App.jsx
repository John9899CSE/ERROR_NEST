import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BugBoard from './components/BugBoard';
import BugList from './components/BugList';
import ReportBug from './components/ReportBug';
import BugDetails from './components/BugDetails';
import TeamManagement from './components/TeamManagement';
import EmailSimulator from './components/EmailSimulator';
import Login from './components/Login';
import { api } from './api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('en_token'));
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('en_user') || 'null'); } catch { return null; }
  });
  const [bugs, setBugs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('admin');
  const [selectedBug, setSelectedBug] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data from backend API
  const fetchData = async () => {
    try {
      const bugsRes = await api.getBugs();
      const activitiesRes = await api.getActivities();
      if (bugsRes && bugsRes.ok && activitiesRes && activitiesRes.ok) {
        const bugsData = await bugsRes.json();
        const activitiesData = await activitiesRes.json();
        setBugs(prev => JSON.stringify(prev) === JSON.stringify(bugsData) ? prev : bugsData);
        setActivities(prev => JSON.stringify(prev) === JSON.stringify(activitiesData) ? prev : activitiesData);
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const addActivity = async (user, action, target) => {
    try {
      const res = await api.createActivity({ user, action, target });
      if (res && res.ok) {
        const newAct = await res.json();
        setActivities(prev => [newAct, ...prev]);
      }
    } catch (e) { console.error(e); }
  };

  const getCurrentUserName = () => currentUser?.name || 'John Smith';

  const handleLogout = () => {
    localStorage.removeItem('en_token');
    localStorage.removeItem('en_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleSubmitBug = async (newBugData) => {
    try {
      const res = await api.createBug({ ...newBugData, reporter: getCurrentUserName() });
      if (res && res.ok) {
        const createdBug = await res.json();
        setBugs(prev => [createdBug, ...prev]);
        await addActivity(getCurrentUserName(), 'reported a new bug', createdBug.id);
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateBugStatus = async (bugId, newStatus) => {
    const bugToUpdate = bugs.find(b => b.id === bugId);
    if (!bugToUpdate || bugToUpdate.status === newStatus) return;
    try {
      const res = await api.updateBug(bugId, { ...bugToUpdate, status: newStatus });
      if (res && res.ok) {
        const savedBug = await res.json();
        setBugs(prev => prev.map(b => b.id === bugId ? savedBug : b));
        await addActivity(getCurrentUserName(), `updated status to ${newStatus.toUpperCase()}`, bugId);
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateBug = async (updatedBug, actionMsg) => {
    try {
      const res = await api.updateBug(updatedBug.id, updatedBug);
      if (res && res.ok) {
        const savedBug = await res.json();
        setBugs(prev => prev.map(b => b.id === updatedBug.id ? savedBug : b));
        if (selectedBug && selectedBug.id === updatedBug.id) setSelectedBug(savedBug);
        if (actionMsg) await addActivity(getCurrentUserName(), actionMsg, updatedBug.id);
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteBug = async (bugId) => {
    try {
      const res = await api.deleteBug(bugId);
      if (res && res.ok) {
        setBugs(prev => prev.filter(b => b.id !== bugId));
        await addActivity(getCurrentUserName(), 'deleted the issue', bugId);
        setSelectedBug(null);
      }
    } catch (e) { console.error(e); }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Project Manager';
      case 'developer': return 'Developer';
      case 'qa': return 'QA Engineer';
      default: return role;
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <Login onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />
      ) : (
        <>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
          />

          <main className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-left">
            <span className="navbar-title">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'board' && 'Kanban Board'}
              {activeTab === 'list' && 'Bug Registry'}
              {activeTab === 'report' && 'Report Bug'}
              {activeTab === 'team' && 'Team Workspace'}
              {activeTab === 'emails' && 'Email Logs'}
            </span>
          </div>

          <div className="navbar-right">
            <div className="search-bar" style={{ width: '260px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" placeholder="Search..." />
            </div>

            <button className="notif-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="notif-dot" />
            </button>

            <div className="user-badge">
              <div className="avatar">{getInitials(getCurrentUserName())}</div>
              <span style={{ color: '#fff', fontSize: '13px' }}>{getCurrentUserName().split(' ')[0]}</span>
              <span className={`role-tag ${currentRole}`}>{getRoleLabel(currentRole)}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <div className="page-container">
          {isLoading && bugs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
              <div className="logo-icon" style={{ animation: 'pulse 1.5s infinite', width: '60px', height: '60px', fontSize: '32px', marginBottom: '16px' }}>EN</div>
              <span>Connecting to central workspace database...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  bugs={bugs}
                  activities={activities}
                  setActiveTab={setActiveTab}
                  onSelectBug={setSelectedBug}
                />
              )}

              {activeTab === 'board' && (
                <BugBoard
                  bugs={bugs}
                  onUpdateBugStatus={handleUpdateBugStatus}
                  onSelectBug={setSelectedBug}
                />
              )}

              {activeTab === 'list' && (
                <BugList
                  bugs={bugs}
                  onSelectBug={setSelectedBug}
                />
              )}

              {activeTab === 'report' && (
                <ReportBug
                  onSubmitBug={handleSubmitBug}
                  currentRole={currentRole}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'team' && (
                <TeamManagement
                  bugs={bugs}
                  currentRole={currentRole}
                />
              )}

              {activeTab === 'emails' && (
                <EmailSimulator />
              )}
            </>
          )}
        </div>
          </main>

          {selectedBug && (
          <BugDetails
            bug={selectedBug}
            onClose={() => setSelectedBug(null)}
            onUpdateBug={handleUpdateBug}
            onDeleteBug={handleDeleteBug}
            currentRole={currentRole}
          />
        )}
        </>
      )}
    </div>
  );
}