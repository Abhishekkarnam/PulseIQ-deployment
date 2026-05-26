import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'General', occupancy: 85, color: '#00a3ff' },
  { name: 'ICU', occupancy: 92, color: '#f59e0b' },
  { name: 'Emergency', occupancy: 78, color: '#ef4444' },
  { name: 'Paediatric', occupancy: 65, color: '#00f2fe' },
  { name: 'Surgical', occupancy: 88, color: '#a855f7' },
];

const OperationsSection = () => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      <div className="glass-card">
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Bed Occupancy Status</h4>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'white', fontSize: 13 }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#050a12', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}
              />
              <Bar dataKey="occupancy" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card">
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Operational Insights</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>ICU Capacity</p>
            <h3 className="outfit" style={{ fontSize: '1.5rem', color: '#f59e0b' }}>92%</h3>
            <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px' }}>Near Threshold</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Avg. Wait Time</p>
            <h3 className="outfit" style={{ fontSize: '1.5rem', color: '#00f2fe' }}>24m</h3>
            <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>-12% vs last week</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active OT</p>
            <h3 className="outfit" style={{ fontSize: '1.5rem', color: '#a855f7' }}>12/14</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>2 in maintenance</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Staff on Duty</p>
            <h3 className="outfit" style={{ fontSize: '1.5rem', color: '#00a3ff' }}>482</h3>
            <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>98% attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsSection;
