import React from 'react';
import { getJson } from './api';
import { Zap, Target, AlertTriangle, TrendingUp } from 'lucide-react';

const InsightItem = ({ icon, text, type, label }) => {
  const getColors = () => {
    switch(type) {
      case 'critical': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' };
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
      case 'opportunity': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' };
      default: return { bg: 'rgba(0, 163, 255, 0.1)', text: '#00a3ff', border: 'rgba(0, 163, 255, 0.2)' };
    }
  };

  const colors = getColors();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px', 
      padding: '1rem', 
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      marginBottom: '12px',
      transition: 'var(--transition-smooth)',
      cursor: 'default'
    }} className="insight-hover">
      <div style={{ 
        padding: '10px', 
        borderRadius: '10px', 
        backgroundColor: colors.bg, 
        color: colors.text 
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</p>
      </div>
      <div style={{ 
        padding: '4px 10px', 
        borderRadius: '6px', 
        fontSize: '0.7rem', 
        fontWeight: 700,
        textTransform: 'uppercase',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`
      }}>
        {label}
      </div>
    </div>
  );
};

const AIInsights = () => {
  const [insightsData, setInsightsData] = React.useState(null);

  React.useEffect(() => {
    getJson('/api/ai-insights')
      .then(setInsightsData)
      .catch(() => setInsightsData(null));
  }, []);

  const liveInsights = insightsData ? [
    ...insightsData.riskAlerts.map((alert) => ({
      icon: <AlertTriangle size={20} />,
      text: alert.text,
      type: alert.type === 'Critical' ? 'critical' : 'warning',
      label: alert.type,
    })),
    ...insightsData.opportunities.slice(0, 2).map((text) => ({
      icon: <TrendingUp size={20} />,
      text,
      type: 'opportunity',
      label: 'Opportunity',
    })),
  ].slice(0, 4) : null;

  return (
    <div className="glass-card glow-blue" style={{ 
      border: '1px solid rgba(0, 163, 255, 0.3)',
      background: 'linear-gradient(135deg, rgba(8, 16, 29, 0.9) 0%, rgba(13, 22, 38, 0.9) 100%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 163, 255, 0.5)'
        }}>
          <Zap size={18} color="white" fill="white" />
        </div>
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>PulseIQ AI insights</h4>
        <div style={{ 
          marginLeft: 'auto',
          padding: '4px 12px',
          borderRadius: '20px',
          backgroundColor: 'rgba(0, 163, 255, 0.1)',
          color: 'var(--accent-blue)',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          Live Analysis
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {(liveInsights ?? [
          { icon: <TrendingUp size={20} />, text: "Cardiology revenue increased by 18% following new lab implementation.", type: "opportunity", label: "Opportunity" },
          { icon: <AlertTriangle size={20} />, text: "ICU occupancy (92%) exceeded safe threshold for 3 consecutive hours.", type: "critical", label: "Critical" },
          { icon: <AlertTriangle size={20} />, text: "Emergency waiting time increased by 15% due to high patient inflow.", type: "warning", label: "Warning" },
          { icon: <Target size={20} />, text: "Neurology patient growth rising steadily; suggest expanding OPD capacity.", type: "opportunity", label: "Opportunity" },
        ]).map((insight, index) => (
          <InsightItem key={index} {...insight} />
        ))}
      </div>

      <button style={{ 
        width: '100%', 
        padding: '12px', 
        marginTop: '1rem',
        borderRadius: '12px',
        background: 'rgba(0, 163, 255, 0.1)',
        border: '1px solid rgba(0, 163, 255, 0.2)',
        color: 'var(--accent-blue)',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'var(--transition-smooth)'
      }}>
        View Full Intelligence Report
      </button>
    </div>
  );
};

export default AIInsights;
