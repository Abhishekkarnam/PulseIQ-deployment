import React from 'react';
import { getJson } from './api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 1.8 },
  { month: 'Feb', revenue: 2.1 },
  { month: 'Mar', revenue: 1.9 },
  { month: 'Apr', revenue: 2.3 },
  { month: 'May', revenue: 2.2 },
  { month: 'Jun', revenue: 2.4 },
];

const departmentData = [
  { name: 'Cardiology', value: 35, color: '#00a3ff' },
  { name: 'Neurology', value: 25, color: '#00f2fe' },
  { name: 'ICU', value: 20, color: '#a855f7' },
  { name: 'Emergency', value: 12, color: '#f59e0b' },
  { name: 'Orthopaedics', value: 8, color: '#10b981' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ padding: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--accent-blue)' }}>
          ₹{payload[0].value} Cr
        </p>
      </div>
    );
  }
  return null;
};

const RevenueSection = () => {
  const [dashboardData, setDashboardData] = React.useState(null);

  React.useEffect(() => {
    getJson('/api/dashboard')
      .then(setDashboardData)
      .catch(() => setDashboardData(null));
  }, []);

  const activeRevenueData = dashboardData?.revenueTrend ?? revenueData;
  const activeDepartmentData = dashboardData?.departmentRevenue ?? departmentData;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '2fr 1fr', 
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Revenue Growth Chart */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Revenue Growth</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly performance overview</p>
          </div>
          <div className="glass" style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' }}>
            Jan - Jun 2024
          </div>
        </div>
        
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} 
                tickFormatter={(value) => `₹${value}Cr`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--accent-blue)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRev)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Split Chart */}
      <div className="glass-card">
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dept. Revenue Split</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Contribution by department</p>
        
        <div style={{ width: '100%', height: '220px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeDepartmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
              >
                {activeDepartmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(5, 10, 18, 0.9)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>₹2.4 Cr</p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          {activeDepartmentData.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueSection;
