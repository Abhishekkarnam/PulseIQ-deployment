import React from 'react';

const departments = [
  { name: 'Cardiology', revenue: '₹84L', patients: 342, satisfaction: 4.8, efficiency: 94 },
  { name: 'Neurology', revenue: '₹62L', patients: 215, satisfaction: 4.6, efficiency: 88 },
  { name: 'ICU', revenue: '₹48L', patients: 128, satisfaction: 4.4, efficiency: 92 },
  { name: 'Emergency', revenue: '₹32L', patients: 512, satisfaction: 4.2, efficiency: 76 },
  { name: 'Orthopaedics', revenue: '₹28L', patients: 184, satisfaction: 4.5, efficiency: 82 },
];

const PerformanceTable = () => {
  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Department Performance</h4>
        <button style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          Export Data
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Department</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Revenue</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Patients</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Satisfaction</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem' }}>Efficiency Score</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={index} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'var(--transition-smooth)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{dept.name}</td>
                <td style={{ padding: '16px' }}>{dept.revenue}</td>
                <td style={{ padding: '16px' }}>{dept.patients}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px' }}>
                      <div style={{ width: `${(dept.satisfaction / 5) * 100}%`, height: '100%', backgroundColor: '#f1c40f', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{dept.satisfaction}</span>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    backgroundColor: dept.efficiency > 90 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: dept.efficiency > 90 ? '#10b981' : '#f59e0b',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    {dept.efficiency}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;
