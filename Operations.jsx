import React from 'react';
import { 
  Activity, 
  Bed, 
  Settings, 
  Users, 
  Clock, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';

const bedData = [
  { name: 'General Ward', occupied: 120, total: 150, color: '#00a3ff' },
  { name: 'ICU', occupied: 46, total: 50, color: '#f59e0b' },
  { name: 'Semi-Private', occupied: 58, total: 80, color: '#00f2fe' },
  { name: 'Emergency', occupied: 22, total: 30, color: '#ef4444' },
  { name: 'Private', occupied: 35, total: 40, color: '#a855f7' },
];

const otEfficiency = [
  { time: '08:00', load: 85 },
  { time: '10:00', load: 95 },
  { time: '12:00', load: 90 },
  { time: '14:00', load: 88 },
  { time: '16:00', load: 75 },
  { time: '18:00', load: 60 },
  { time: '20:00', load: 40 },
];

const equipmentStatus = [
  { name: 'MRI Scanner', status: 'Active', load: '92%', lastService: '12 May' },
  { name: 'CT Scanner', status: 'Maintenance', load: '0%', lastService: '25 May' },
  { name: 'Ventilators (50)', status: 'Active', load: '84%', lastService: '15 May' },
  { name: 'X-Ray Unit', status: 'Active', load: '76%', lastService: '20 May' },
];

const Operations = () => {
  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '8px' }}>Operations Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Hospital capacity, facility management, and resource utilization</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer' }}>
            <Calendar size={18} />
            Today
          </button>
          <button style={{ backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
             Facility Report
          </button>
        </div>
      </div>

      {/* SECTION 1 — CAPACITY KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Overall Bed Occupancy', value: '86%', trend: '+4%', icon: <Bed size={24} />, color: '0, 163, 255' },
          { label: 'OT Utilization', value: '92%', trend: '+12%', icon: <Activity size={24} />, color: '168, 85, 247' },
          { label: 'Avg. Turnaround Time', value: '45m', trend: '-8%', icon: <Clock size={24} />, color: '16, 185, 129' },
          { label: 'Safety Compliance', value: '98%', trend: 'Stable', icon: <ShieldCheck size={24} />, color: '0, 242, 254' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `rgba(${kpi.color}, 0.1)`, color: `rgb(${kpi.color})` }}>{kpi.icon}</div>
              <span style={{ color: kpi.trend.includes('-') || kpi.trend === 'Stable' ? '#10b981' : '#f59e0b', fontSize: '0.75rem', fontWeight: 700 }}>{kpi.trend}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{kpi.label}</p>
            <h3 className="outfit" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SECTION 2 — BED CAPACITY BY WARD */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ward-wise Bed Allocation</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Occupied vs Total beds — live snapshot</p>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedData} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 13 }} width={120} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                   contentStyle={{ backgroundColor: '#050a12', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}
                   formatter={(value, name) => [value + ' beds', name === 'occupied' ? 'Occupied' : 'Total Capacity']}
                />
                <Bar dataKey="occupied" radius={[0, 4, 4, 0]} barSize={22} label={{ position: 'right', fill: 'white', fontSize: 11, formatter: (v) => v }}>
                   {bedData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                </Bar>
                <Bar dataKey="total" fill="rgba(255, 255, 255, 0.05)" radius={[0, 4, 4, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Bed Count Summary Table */}
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {bedData.map((ward, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${ward.color}30` }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ward.color, margin: '0 auto 6px' }} />
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: 1.2 }}>{ward.name}</p>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: ward.color }}>{ward.occupied}</p>
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>/ {ward.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3 — OT PERFORMANCE */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Operational Efficiency (OT)</h4>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={otEfficiency}>
                 <defs>
                   <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                 <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }} />
                 <Tooltip />
                 <Area type="monotone" dataKey="load" stroke="#a855f7" strokeWidth={3} fill="url(#colorLoad)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current active surgeries: <span style={{ color: 'white', fontWeight: 700 }}>12/14 OTs</span></p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SECTION 4 — EQUIPMENT STATUS */}
        <div className="glass-card">
           <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Critical Equipment Status</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {equipmentStatus.map((eq, i) => (
               <div key={i} className="glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{eq.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Last Service: {eq.lastService}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '4px 10px', 
                      borderRadius: '20px',
                      backgroundColor: eq.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: eq.status === 'Active' ? '#10b981' : '#f59e0b',
                      fontWeight: 700
                    }}>{eq.status}</span>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>Load: {eq.load}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* SECTION 5 — FACILITY ALERTS */}
        <div className="glass-card">
           <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Operational Alerts</h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid #ef4444' }}>
                 <AlertTriangle size={20} color="#ef4444" />
                 <div>
                    <h6 style={{ fontWeight: 600 }}>Emergency Dept Full</h6>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Redirecting secondary trauma cases to Ortho ward B.</p>
                 </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '4px solid #f59e0b' }}>
                 <Activity size={20} color="#f59e0b" />
                 <div>
                    <h6 style={{ fontWeight: 600 }}>Generator Maintenance Due</h6>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Scheduled check for Backup Source 2 in 4 hours.</p>
                 </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(0, 163, 255, 0.05)', borderLeft: '4px solid #00a3ff' }}>
                 <CheckCircle2 size={20} color="#00a3ff" />
                 <div>
                    <h6 style={{ fontWeight: 600 }}>Supply Restocked</h6>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>Pharma inventory for ICU A completed successfully.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;
