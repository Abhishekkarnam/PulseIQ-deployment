import React, { useState } from 'react';
import { 
  User, Settings as SettingsIcon, Bell, MapPin, FileText, Shield, Cpu, Activity, Palette, Info,
  Key, Mail, Smartphone, Download, Share2, Lock, ChevronRight, Save, RotateCcw,
  CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap, Eye, EyeOff, LogOut
} from 'lucide-react';

/* ─── Toast Notification System ─────────────────────────── */
const Toast = ({ toasts }) => (
  <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 9999 }}>
    {toasts.map(t => (
      <div key={t.id} className="animate-fade-in" style={{
        padding: '14px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
        backgroundColor: t.type === 'success' ? 'rgba(16,185,129,0.15)' : t.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(0,163,255,0.15)',
        border: `1px solid ${t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#00a3ff'}`,
        color: 'white', fontSize: '0.9rem', fontWeight: 500, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)'
      }}>
        {t.type === 'success' ? <CheckCircle size={18} color="#10b981" /> : t.type === 'error' ? <XCircle size={18} color="#ef4444" /> : <AlertTriangle size={18} color="#00a3ff" />}
        {t.message}
      </div>
    ))}
  </div>
);

/* ─── Modal ─────────────────────────────────────────────── */
const Modal = ({ modal, onClose }) => {
  if (!modal) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} className="glass-card" style={{ width: '450px', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
        <h3 className="outfit" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{modal.title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>{modal.subtitle}</p>
        {modal.content}
        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="glass" style={{ flex: 1, padding: '12px', color: 'white', cursor: 'pointer', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>Cancel</button>
          <button onClick={() => { modal.onConfirm?.(); onClose(); }} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

/* ─── Toggle Switch ──────────────────────────────────────── */
const Toggle = ({ enabled, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</span>
    <div onClick={() => onChange(!enabled)} style={{ 
      width: '44px', height: '24px', borderRadius: '12px', 
      backgroundColor: enabled ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
      position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease',
      boxShadow: enabled ? '0 0 12px rgba(0,163,255,0.4)' : 'none'
    }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: enabled ? '23px' : '3px', transition: 'all 0.3s ease' }} />
    </div>
  </div>
);

/* ─── Section Header ─────────────────────────────────────── */
const SectionHeader = ({ icon, label, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
    <div style={{ color }}>{icon}</div>
    <h4 className="outfit" style={{ fontSize: '1.15rem', fontWeight: 600 }}>{label}</h4>
  </div>
);

/* ─── Action Button ──────────────────────────────────────── */
const ActionBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="glass" style={{ padding: '15px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)', borderRadius: '14px', transition: 'all 0.2s' }}>
    <div style={{ color: 'var(--accent-teal)' }}>{icon}</div>
    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</span>
  </button>
);

/* ─── Main Component ─────────────────────────────────────── */
const Settings = () => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [editName, setEditName] = useState('Vikram Malhotra');
  const [editEmail, setEditEmail] = useState('ceo@pulseiq.health');
  const [editPhone, setEditPhone] = useState('+91 98234 56781');
  const [editMode, setEditMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [primaryBranch, setPrimaryBranch] = useState('Mumbai');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [sensitivity, setSensitivity] = useState(80);
  const [accentColor, setAccentColor] = useState('#00a3ff');
  const [fontSize, setFontSize] = useState(14);
  const [prefs, setPrefs] = useState({
    darkMode: true, realTime: true, compact: false, aiNotifs: true, liveData: true,
    critAlerts: true, revWarnings: true, occupancyAlerts: true, staffAlerts: false,
    dailyReports: true, aiPredAlerts: true,
    emailNotif: true, smsAlerts: false, inAppNotif: true,
    multiBranch: true, branchCompare: false,
    twoFactor: true,
    predictive: true, smartRisk: true, aiRecs: true, autoForecast: false, aiSummaries: true
  });

  const toast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    toast(`${key.replace(/([A-Z])/g, ' $1')} ${!prefs[key] ? 'enabled' : 'disabled'}`);
  };

  const handleSave = () => {
    if (!editName.trim()) { toast('Name cannot be empty.', 'error'); return; }
    setSaved(true);
    toast('All settings saved successfully!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setModal({
      title: 'Reset All Settings?',
      subtitle: 'This will restore all settings to factory defaults. This action cannot be undone.',
      content: <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.85rem', color: '#ef4444' }}>All customisations, preferences, and notifications will be reset.</div>,
      onConfirm: () => { setPrefs({ darkMode: true, realTime: true, compact: false, aiNotifs: true, liveData: true, critAlerts: true, revWarnings: true, occupancyAlerts: true, staffAlerts: false, dailyReports: true, aiPredAlerts: true, emailNotif: true, smsAlerts: false, inAppNotif: true, multiBranch: true, branchCompare: false, twoFactor: true, predictive: true, smartRisk: true, aiRecs: true, autoForecast: false, aiSummaries: true }); setSensitivity(80); toast('Settings have been reset to defaults.', 'info'); }
    });
  };

  const handleProfileSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editName.trim()) { toast('Name cannot be empty.', 'error'); return; }
    if (!emailRegex.test(editEmail)) { toast('Please enter a valid email address.', 'error'); return; }
    setEditMode(false);
    toast('Profile updated successfully!', 'success');
  };

  const handlePasswordChange = () => {
    setModal({
      title: 'Change Security Password',
      subtitle: 'Enter a new strong password for your account.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="password" placeholder="Current Password" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} />
          <input type={showPass ? 'text' : 'password'} placeholder="New Password (min. 8 chars)" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} />
          <input type="password" placeholder="Confirm New Password" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} />
        </div>
      ),
      onConfirm: () => toast('Password changed successfully!', 'success')
    });
  };

  const handleExport = (type) => {
    setModal({
      title: `Export ${type}`,
      subtitle: `A ${type} file of your hospital analytics will be generated and downloaded.`,
      content: <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This may take a moment depending on your data range. The file will include all visible metrics.</p>,
      onConfirm: () => toast(`${type} exported and download started!`, 'success')
    });
  };

  const handleShareSnapshot = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast('Dashboard link copied to clipboard!', 'success');
  };

  const handleScheduleReports = () => {
    setModal({
      title: 'Schedule Periodic Reports',
      subtitle: 'Configure automatic delivery of comprehensive analytics reports.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}>
            <option value="daily">Daily</option><option value="weekly" selected>Weekly</option><option value="monthly">Monthly</option>
          </select>
          <input type="email" defaultValue={editEmail} placeholder="Delivery email" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }} />
        </div>
      ),
      onConfirm: () => toast('Scheduled reports configured!', 'success')
    });
  };

  const handleViewActivity = () => {
    setModal({
      title: 'Login Activity Log',
      subtitle: 'Recent account access events for your security review.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { event: 'Login', time: 'Today 10:42 AM', device: 'Chrome · Mumbai', ok: true },
            { event: 'Login', time: 'Yesterday 08:15 PM', device: 'Safari · iPad', ok: true },
            { event: 'Failed attempt', time: '24 May 06:31 AM', device: 'Unknown', ok: false }
          ].map((l, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.event}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{l.device}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{l.time}</p>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: l.ok ? '#10b981' : '#ef4444', marginLeft: 'auto', marginTop: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      ),
      onConfirm: () => {}
    });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      <Toast toasts={toasts} />
      <Modal modal={modal} onClose={() => setModal(null)} />

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '8px' }}>System Settings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage dashboard preferences, AI configurations, security, and operational controls</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleReset} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '1px solid var(--glass-border)', color: 'white', fontWeight: 600, cursor: 'pointer', borderRadius: '12px' }}>
            <RotateCcw size={18} /> Reset
          </button>
          <button onClick={handleSave} style={{ backgroundColor: saved ? '#10b981' : 'var(--accent-blue)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? <CheckCircle size={18} /> : <Save size={18} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>

        {/* SECTION 1 — PROFILE */}
        <div className="glass-card">
          <SectionHeader icon={<User size={20} />} label="Profile Settings" color="var(--accent-blue)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '1.5rem', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
            {/* Avatar Initials — no external image */}
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 0 20px rgba(0,163,255,0.3)' }}>
              VM
            </div>
            <div style={{ flex: 1 }}>
              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontSize: '0.9rem' }} />
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontSize: '0.85rem' }} />
                  <input value={editPhone} onChange={e => setEditPhone(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontSize: '0.85rem' }} />
                </div>
              ) : (
                <>
                  <h5 className="outfit" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{editName}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chief Executive Officer · {primaryBranch}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{editEmail}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', marginTop: '4px', fontWeight: 600 }}>Last Login: Today, 10:42 AM</p>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {editMode ? (
              <button onClick={handleProfileSave} style={{ padding: '12px', borderRadius: '10px', background: 'var(--accent-blue)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> Save Profile
              </button>
            ) : (
              <button onClick={() => setEditMode(true)} className="glass" style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: 'white', cursor: 'pointer', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
                <span>Edit Account Information</span> <ChevronRight size={16} />
              </button>
            )}
            <button onClick={handlePasswordChange} className="glass" style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem', color: 'white', cursor: 'pointer', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
              <span>Change Security Password</span> <Key size={16} />
            </button>
          </div>
        </div>

        {/* SECTION 2 — DASHBOARD PREFERENCES */}
        <div className="glass-card">
          <SectionHeader icon={<SettingsIcon size={20} />} label="Dashboard Preferences" color="var(--accent-teal)" />
          <Toggle label="Dark Mode Aesthetic" enabled={prefs.darkMode} onChange={() => handleToggle('darkMode')} />
          <Toggle label="Real-Time Live Monitoring" enabled={prefs.realTime} onChange={() => handleToggle('realTime')} />
          <Toggle label="Compact Dashboard Layout" enabled={prefs.compact} onChange={() => handleToggle('compact')} />
          <Toggle label="Enable AI Notifications" enabled={prefs.aiNotifs} onChange={() => handleToggle('aiNotifs')} />
          <Toggle label="Automated Live Data Refresh" enabled={prefs.liveData} onChange={() => handleToggle('liveData')} />
        </div>

        {/* SECTION 3 — NOTIFICATION MANAGEMENT */}
        <div className="glass-card">
          <SectionHeader icon={<Bell size={20} />} label="Notification Management" color="#f59e0b" />
          <Toggle label="Critical Alerts (Emergency)" enabled={prefs.critAlerts} onChange={() => handleToggle('critAlerts')} />
          <Toggle label="Revenue & Financial Warnings" enabled={prefs.revWarnings} onChange={() => handleToggle('revWarnings')} />
          <Toggle label="Occupancy Threshold Alerts" enabled={prefs.occupancyAlerts} onChange={() => handleToggle('occupancyAlerts')} />
          <Toggle label="Staff Shortage Alerts" enabled={prefs.staffAlerts} onChange={() => handleToggle('staffAlerts')} />
          <Toggle label="Daily Executive Reports" enabled={prefs.dailyReports} onChange={() => handleToggle('dailyReports')} />
          <Toggle label="AI Prediction Alerts" enabled={prefs.aiPredAlerts} onChange={() => handleToggle('aiPredAlerts')} />
          <div style={{ marginTop: '1rem', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: '0.8rem', marginBottom: '10px', fontWeight: 600 }}>Delivery Channels</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Email', icon: <Mail size={14} />, key: 'emailNotif' },
                { label: 'SMS', icon: <Smartphone size={14} />, key: 'smsAlerts' },
                { label: 'In-App', icon: <Bell size={14} />, key: 'inAppNotif' }
              ].map(ch => (
                <div key={ch.key} onClick={() => handleToggle(ch.key)} style={{ flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', borderRadius: '10px', border: `1px solid ${prefs[ch.key] ? 'var(--accent-blue)' : 'var(--glass-border)'}`, background: prefs[ch.key] ? 'rgba(0,163,255,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                  <div style={{ color: prefs[ch.key] ? 'var(--accent-blue)' : 'var(--text-secondary)', marginBottom: '4px' }}>{ch.icon}</div>
                  <p style={{ fontSize: '0.7rem', color: prefs[ch.key] ? 'white' : 'var(--text-secondary)' }}>{ch.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 7 — AI CONFIGURATION */}
        <div className="glass-card glow-blue" style={{ border: '1px solid rgba(0,163,255,0.2)' }}>
          <SectionHeader icon={<Cpu size={20} />} label="AI Strategic Configuration" color="var(--accent-blue)" />
          <Toggle label="Predictive Analytics Engine" enabled={prefs.predictive} onChange={() => handleToggle('predictive')} />
          <Toggle label="Smart Risk Detection" enabled={prefs.smartRisk} onChange={() => handleToggle('smartRisk')} />
          <Toggle label="AI Executive Recommendations" enabled={prefs.aiRecs} onChange={() => handleToggle('aiRecs')} />
          <Toggle label="Automated Forecasting" enabled={prefs.autoForecast} onChange={() => handleToggle('autoForecast')} />
          <Toggle label="AI Executive Summaries" enabled={prefs.aiSummaries} onChange={() => handleToggle('aiSummaries')} />
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prediction Sensitivity</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{sensitivity < 40 ? 'Low' : sensitivity < 70 ? 'Medium' : 'High'}</span>
            </div>
            <input type="range" min="0" max="100" value={sensitivity} onChange={e => { setSensitivity(Number(e.target.value)); toast(`Sensitivity set to ${Number(e.target.value) < 40 ? 'Low' : Number(e.target.value) < 70 ? 'Medium' : 'High'}`, 'info'); }} style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
          </div>
        </div>

        {/* SECTION 4 — BRANCH MANAGEMENT */}
        <div className="glass-card">
          <SectionHeader icon={<MapPin size={20} />} label="Branch Management" color="var(--accent-teal)" />
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Primary Reporting Branch</p>
            <select value={primaryBranch} onChange={e => { setPrimaryBranch(e.target.value); toast(`Primary branch set to ${e.target.value}`, 'success'); }} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Bengaluru">Bengaluru, Karnataka</option>
              <option value="Delhi">Delhi, NCR</option>
              <option value="Hyderabad">Hyderabad, Telangana</option>
            </select>
          </div>
          <Toggle label="Multi-Branch Simultaneous Monitoring" enabled={prefs.multiBranch} onChange={() => handleToggle('multiBranch')} />
          <Toggle label="Regional Analytics Comparison" enabled={prefs.branchCompare} onChange={() => handleToggle('branchCompare')} />
        </div>

        {/* SECTION 6 — SECURITY */}
        <div className="glass-card">
          <SectionHeader icon={<Lock size={20} />} label="Security Center" color="#ef4444" />
          <Toggle label="Two-Factor Authentication (2FA)" enabled={prefs.twoFactor} onChange={() => handleToggle('twoFactor')} />
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', marginTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem' }}>Session Auto-Timeout</span>
              <select value={sessionTimeout} onChange={e => { setSessionTimeout(e.target.value); toast(`Session timeout set to ${e.target.value} minutes.`) }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer' }}>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Encryption: <span style={{ color: '#10b981' }}>AES-256 Active</span></p>
          </div>
          <button onClick={handleViewActivity} className="glass" style={{ width: '100%', padding: '12px', fontSize: '0.85rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
            <Eye size={16} /> View Login Activity
          </button>
          <button onClick={() => { setModal({ title: 'Sign Out of All Devices', subtitle: 'All active sessions except the current one will be terminated immediately.', content: <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This will log out all other devices where you are currently signed in.</p>, onConfirm: () => toast('All other sessions terminated securely.', 'success') }) }} className="glass" style={{ width: '100%', padding: '12px', fontSize: '0.85rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', marginTop: '8px' }}>
            <LogOut size={16} /> Sign Out All Devices
          </button>
        </div>

        {/* SECTION 8 — SYSTEM STATUS */}
        <div className="glass-card">
          <SectionHeader icon={<Activity size={20} />} label="Live System Status" color="var(--accent-blue)" />
          {[
            { label: 'Database Engine', status: 'Active', color: '#10b981' },
            { label: 'AI Analytics Node', status: 'Running', color: '#10b981' },
            { label: 'Cloud Connectivity', status: 'Healthy', color: '#10b981' },
            { label: 'API Gateway', status: 'Stable', color: '#10b981' },
            { label: 'External Data Sync', status: 'Latent', color: '#f59e0b' }
          ].map((sys, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i === 4 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sys.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sys.color, boxShadow: `0 0 8px ${sys.color}` }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{sys.status}</span>
              </div>
            </div>
          ))}
          <button onClick={() => toast('System health refreshed — all services nominal.', 'success')} style={{ width: '100%', marginTop: '1.2rem', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refresh Status
          </button>
        </div>

        {/* SECTION 5 — REPORTS & EXPORTS */}
        <div className="glass-card">
          <SectionHeader icon={<FileText size={20} />} label="Reports & Exports" color="var(--accent-teal)" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <ActionBtn icon={<Download size={20} />} label="Export PDF" onClick={() => handleExport('PDF Report')} />
            <ActionBtn icon={<FileText size={20} />} label="Download CSV" onClick={() => handleExport('CSV Analytics')} />
            <ActionBtn icon={<Zap size={20} />} label="AI Summary" onClick={() => { toast('Generating AI Summary Report...', 'info'); setTimeout(() => toast('AI Summary Report ready!', 'success'), 2000); }} />
            <ActionBtn icon={<Share2 size={20} />} label="Share Snapshot" onClick={handleShareSnapshot} />
          </div>
          <button onClick={handleScheduleReports} style={{ width: '100%', marginTop: '1rem', padding: '12px', borderRadius: '10px', background: 'var(--accent-blue)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Schedule Periodic Reports</button>
        </div>

        {/* SECTION 9 — THEME CUSTOMIZATION */}
        <div className="glass-card">
          <SectionHeader icon={<Palette size={20} />} label="Theme Customization" color="#a855f7" />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Dashboard Accent Color</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
            {['#00a3ff', '#00f2fe', '#a855f7', '#10b981', '#f59e0b'].map((col) => (
              <div key={col} onClick={() => { setAccentColor(col); toast(`Accent color updated!`, 'success'); }} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: col, cursor: 'pointer', border: accentColor === col ? '3px solid white' : '2px solid transparent', transition: 'all 0.2s', transform: accentColor === col ? 'scale(1.15)' : 'scale(1)' }} />
            ))}
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interface Font Size</span>
              <span style={{ fontWeight: 700 }}>{fontSize}px</span>
            </div>
            <input type="range" min="12" max="18" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Compact</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Large</span>
            </div>
          </div>
        </div>

        {/* SECTION 10 — ABOUT */}
        <div className="glass-card">
          <SectionHeader icon={<Info size={20} />} label="About PulseIQ" color="var(--accent-blue)" />
          <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)', border: '1px solid var(--glass-border)', textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Zap size={24} color="white" fill="white" />
            </div>
            <h3 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 700 }}>PulseIQ AI <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>v2.1.0</span></h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enterprise Healthcare Intelligence Platform</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'left' }}>
              {[['Uptime', '99.98%'], ['Region', 'Asia-South'], ['License', 'Corporate'], ['Support', 'Platinum']].map(([k, v]) => (
                <div key={k}><p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{k}</p><p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{v}</p></div>
              ))}
            </div>
          </div>
          <button onClick={() => toast('Checking for updates... PulseIQ v2.1.0 is up to date.', 'info')} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
            Check for Updates
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>© 2026 PulseIQ Systems Inc. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default Settings;
