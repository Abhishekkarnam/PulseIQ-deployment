import React from 'react';
import KPISection from '../components/KPISection';
import RevenueSection from '../components/RevenueSection';
import OperationsSection from '../components/OperationsSection';
import AIInsights from '../components/AIInsights';
import PerformanceTable from '../components/PerformanceTable';
import AlertsPanel from '../components/AlertsPanel';

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="outfit" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
          Executive Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time strategic intelligence for hospital operations and performance.
        </p>
      </div>

      <KPISection />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <RevenueSection />
          <OperationsSection />
          <PerformanceTable />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AIInsights />
          <AlertsPanel />
          
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--accent-navy), #08101d)', borderTop: '3px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 className="outfit" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Q2 Strategic Plan</h4>
              <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,163,255,0.15)', color: 'var(--accent-blue)', fontWeight: 700 }}>ACTIVE</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Focus: ICU throughput optimisation, Neurology expansion, and revenue growth via elective procedures.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
              {[
                { label: 'Expand Neurology OPD by 2 rooms', pct: 60, col: '#00a3ff' },
                { label: 'Reduce ICU avg stay to 3.8 days', pct: 45, col: '#00f2fe' },
                { label: 'Increase elective surgery revenue 15%', pct: 30, col: '#a855f7' },
                { label: 'ER wait-time < 20 min target', pct: 78, col: '#10b981' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.col }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px' }}>
                    <div style={{ width: `${item.pct}%`, height: '100%', background: item.col, borderRadius: '3px', boxShadow: `0 0 8px ${item.col}80` }} />
                  </div>
                </div>
              ))}
            </div>
            <button style={{ 
              backgroundColor: 'var(--accent-blue)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '10px', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              boxShadow: '0 4px 15px rgba(0,163,255,0.25)'
            }}>
              Open Full Strategy Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
