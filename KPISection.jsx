import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  Star, 
  UserPlus, 
  AlertCircle 
} from 'lucide-react';

const KPICard = ({ title, value, trend, trendValue, icon, color, isNegative }) => {
  return (
    <div className="glass-card animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          backgroundColor: `rgba(${color}, 0.1)`, 
          padding: '12px', 
          borderRadius: '14px',
          color: `rgb(${color})`
        }}>
          {icon}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '20px',
          backgroundColor: isNegative ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: isNegative ? '#ef4444' : '#10b981',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {trendValue}
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h3 className="outfit" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</h3>
      </div>
      
      <div style={{ marginTop: '1.25rem', width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ 
          width: '70%', 
          height: '100%', 
          background: `linear-gradient(90deg, rgb(${color}), rgba(${color}, 0.4))`,
          borderRadius: '2px'
        }} />
      </div>
    </div>
  );
};

const KPISection = () => {
  const kpis = [
    {
      title: 'Total Revenue',
      value: '₹2.4 Cr',
      trendValue: '+18%',
      icon: <DollarSign size={24} />,
      color: '0, 163, 255', // Blue
    },
    {
      title: 'Patient Acquisition',
      value: '1,432',
      trendValue: '+12%',
      icon: <UserPlus size={24} />,
      color: '0, 242, 254', // Teal
    },
    {
      title: 'Operational Capacity',
      value: '82%',
      trendValue: '+5%',
      icon: <Activity size={24} />,
      color: '168, 85, 247', // Purple
    },
    {
      title: 'Patient Satisfaction',
      value: '4.6/5',
      trendValue: '+2%',
      icon: <Star size={24} />,
      color: '251, 191, 36', // Gold
    },
    {
      title: 'Active Doctors',
      value: '214',
      trendValue: '+8%',
      icon: <Users size={24} />,
      color: '16, 185, 129', // Green
    },
    {
      title: 'Critical Alerts',
      value: '03',
      trendValue: '-25%',
      icon: <AlertCircle size={24} />,
      color: '239, 68, 68', // Red
      isNegative: true
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

export default KPISection;
