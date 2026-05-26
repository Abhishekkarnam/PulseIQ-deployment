import React from 'react';
import { getJson } from './api';
import { AlertCircle, Clock, Users } from 'lucide-react';

const AlertRow = ({ icon, title, description, time, type }) => {
  const color = type === 'critical' ? '#ef4444' : '#f59e0b';
  
  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      padding: '1.25rem', 
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: `1px solid rgba(255, 255, 255, 0.05)`,
      borderLeft: `4px solid ${color}`,
      marginBottom: '1rem'
    }}>
      <div style={{ color: color }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{title}</h5>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{time}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{description}</p>
      </div>
    </div>
  );
};

const AlertsPanel = () => {
  const [apiAlerts, setApiAlerts] = React.useState(null);

  React.useEffect(() => {
    getJson('/api/dashboard')
      .then((data) => setApiAlerts(data.alerts))
      .catch(() => setApiAlerts(null));
  }, []);

  const fallbackAlerts = [
    {
      icon: <AlertCircle size={20} />,
      title: 'ICU Capacity Critical',
      description: 'ICU 1 & 2 are at 96% capacity. Bed allocation for secondary transfers suspended.',
      time: '12 mins ago',
      type: 'critical',
    },
    {
      icon: <Users size={20} />,
      title: 'Staff Shortage: Emergency',
      description: 'Night shift staffing below requirement (4/12). Urgent rotation requested.',
      time: '45 mins ago',
      type: 'critical',
    },
    {
      icon: <Clock size={20} />,
      title: 'Insurance Claim Delays',
      description: 'Significant increase in insurance processing time for TPA vendors.',
      time: '2 hours ago',
      type: 'warning',
    },
  ];
  const alerts = apiAlerts?.map((alert, index) => ({
    ...alert,
    icon: index === 1 ? <Users size={20} /> : index === 2 ? <Clock size={20} /> : <AlertCircle size={20} />,
  })) ?? fallbackAlerts;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Critical Alerts</h4>
          <span style={{ 
            backgroundColor: '#ef4444', 
            color: 'white', 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            padding: '2px 8px', 
            borderRadius: '10px' 
          }}>{alerts.length} Active</span>
        </div>
        <button style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}>
          Mark all read
        </button>
      </div>

      {alerts.map((alert, index) => (
        <AlertRow key={index} {...alert} />
      ))}
    </div>
  );
};

export default AlertsPanel;
