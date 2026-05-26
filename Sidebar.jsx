import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Activity, 
  Stethoscope, 
  Zap, 
  Settings, 
  Hospital
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BarChart3 size={20} />, label: 'Financial Analytics', path: '/financials' },
    { icon: <Users size={20} />, label: 'Patient Insights', path: '/patients' },
    { icon: <Activity size={20} />, label: 'Operations', path: '/operations' },
    { icon: <Stethoscope size={20} />, label: 'Staff Management', path: '/staff' },
    { icon: <Zap size={20} />, label: 'AI Insights', path: '/ai-insights' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--sidebar-color)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      zIndex: 1000
    }}>
      <div className="sidebar-header" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 163, 255, 0.4)'
          }}>
            <Hospital color="white" size={24} />
          </div>
          <h2 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Pulse<span style={{ color: 'var(--accent-blue)' }}>IQ</span>
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, paddingLeft: '52px' }}>
          CEO Dashboard
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(0, 163, 255, 0.1)' : 'transparent',
                cursor: 'pointer',
                marginBottom: '8px',
                transition: 'var(--transition-smooth)',
                border: isActive ? '1px solid rgba(0, 163, 255, 0.2)' : '1px solid transparent'
              }}
            >
              <span style={{ color: isActive ? 'var(--accent-blue)' : 'inherit' }}>
                {item.icon}
              </span>
              <span style={{ fontWeight: isActive ? 600 : 400, fontSize: '0.95rem' }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{ 
                  marginLeft: 'auto', 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent-blue)',
                  boxShadow: '0 0 10px var(--accent-blue)'
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ 
        marginTop: 'auto', 
        padding: '1.5rem',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>System Secure</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Last sync: 2 mins ago
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
