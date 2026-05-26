import React from 'react';
import { Search, Bell, Calendar, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const [notifEnabled, setNotifEnabled] = React.useState(true);
  const [vibrate, setVibrate] = React.useState(false);

  const toggleNotif = () => {
    setNotifEnabled(!notifEnabled);
    setVibrate(true);
    setTimeout(() => setVibrate(false), 300);
  };

  return (
    <div className="navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem 0',
      marginBottom: '2rem'
    }}>
      <div className="search-bar glass" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        width: '400px',
        gap: '12px'
      }}>
        <Search size={18} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search analytics, patients, or reports..." 
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            width: '100%',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Calendar size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{currentDate}</span>
        </div>

        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleNotif}>
          <div className={`glass ${vibrate ? 'vibrate' : ''}`} style={{ 
            padding: '10px', 
            borderRadius: '12px',
            color: notifEnabled ? 'var(--accent-blue)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}>
            <Bell size={20} fill={notifEnabled ? 'var(--accent-blue)' : 'none'} />
            {notifEnabled && (
              <div style={{ 
                position: 'absolute', 
                top: '2px', 
                right: '2px', 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#ef4444', 
                borderRadius: '50%',
                border: '2px solid var(--bg-color)'
              }} />
            )}
          </div>
          <style>{`
            .vibrate { animation: vibrate 0.3s linear; }
            @keyframes vibrate {
              0% { transform: translate(0); }
              20% { transform: translate(-2px, 2px); }
              40% { transform: translate(-2px, -2px); }
              60% { transform: translate(2px, 2px); }
              80% { transform: translate(2px, -2px); }
              100% { transform: translate(0); }
            }
          `}</style>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '4px 4px 4px 12px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--glass-border)',
          cursor: 'pointer'
        }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Welcome!</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Chief Executive Officer</p>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            border: '2px solid var(--accent-blue)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ef159950?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="CEO Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
