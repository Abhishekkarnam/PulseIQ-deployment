import React from 'react';
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Star,
  Activity,
  Calendar,
  Zap,
  Clock
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const staffDist = [
  { name: 'Doctors', value: 214, color: '#00a3ff' },
  { name: 'Nurses', value: 482, color: '#00f2fe' },
  { name: 'Technicians', value: 156, color: '#a855f7' },
  { name: 'Support Staff', value: 245, color: '#f59e0b' },
  { name: 'Admin', value: 84, color: '#10b981' },
];

const performanceData = [
  { dept: 'Cardio', efficiency: 94, attendance: 98 },
  { dept: 'Neuro', efficiency: 88, attendance: 95 },
  { dept: 'ICU', efficiency: 92, attendance: 92 },
  { dept: 'ER', efficiency: 76, attendance: 99 },
  { dept: 'Ortho', efficiency: 82, attendance: 94 },
];

const topStaff = [
  { name: 'Dr. Sarah Smith', role: 'Head Cardio', score: 4.9, status: 'On Duty' },
  { name: 'Dr. Jason Miller', role: 'Sr. Neurology', score: 4.8, status: 'On Call' },
  { name: 'Nurse Emily Brown', role: 'ICU Supervisor', score: 4.9, status: 'On Duty' },
  { name: 'Dr. Anita Roy', role: 'ER Specialist', score: 4.7, status: 'Resting' },
];

const StaffManagement = () => {
  return (
    <div className="animate-fade-in">
       {/* Page Header */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '8px' }}>Staff Management</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Human resources, performance tracking, and shift coordination</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'pointer' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.9rem' }}>Duty Roster</span>
          </div>
          <button style={{ 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '12px', 
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Add Staff Member
          </button>
        </div>
      </div>

       {/* SECTION 1 — STAFF KPIs */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Personnel', value: '1,181', trend: '+12', icon: <Users size={24} />, color: '0, 163, 255' },
          { label: 'Avg Attendance', value: '96.4%', trend: '+2.1%', icon: <UserCheck size={24} />, color: '16, 185, 129' },
          { label: 'Patient-to-Staff Ratio', value: '4:1', trend: '-0.5', icon: <Activity size={24} />, color: '168, 85, 247' },
          { label: 'Staff Satisfaction', value: '4.4/5', trend: '+5%', icon: <Star size={24} />, color: '251, 191, 36' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: `rgba(${kpi.color}, 0.1)`, color: `rgb(${kpi.color})` }}>{kpi.icon}</div>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>{kpi.trend}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{kpi.label}</p>
            <h3 className="outfit" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '1.5rem', marginBottom: '2rem' }}>
         {/* SECTION 2 — STAFF COMPOSITION */}
         <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Workforce Distribution</h4>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={staffDist} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {staffDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem' }}>
             {staffDist.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ fontSize: '0.85rem' }}>{item.name}</span>
                   </div>
                   <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</span>
                </div>
             ))}
          </div>
        </div>

        {/* SECTION 3 — PERFORMANCE SCAN */}
        <div className="glass-card">
           <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Department Performance Index</h4>
           <div style={{ width: '100%', height: '350px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={performanceData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                 <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                 <Tooltip contentStyle={{ backgroundColor: '#08101d', border: 'none', borderRadius: '12px' }} />
                 <Legend />
                 <Bar dataKey="efficiency" radius={[4, 4, 0, 0]} fill="var(--accent-blue)" barSize={30} />
                 <Bar dataKey="attendance" radius={[4, 4, 0, 0]} fill="#00f2fe" barSize={30} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
         {/* SECTION 4 — HIGHER PERFORMANCE STAFF */}
         <div className="glass-card">
            <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Top Rated Personnel</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {topStaff.map((staff, i) => (
                 <div key={i} className="glass" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Stethoscope size={20} color="var(--accent-blue)" />
                       </div>
                       <div>
                          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{staff.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{staff.role}</p>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <span style={{ 
                         fontSize: '0.75rem', 
                         fontWeight: 700,
                         color: '#f1c40f',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '4px'
                       }}><Star size={14} fill="#f1c40f" /> {staff.score}</span>
                       <p style={{ fontSize: '0.7rem', color: staff.status === 'On Duty' ? '#10b981' : '#f59e0b', marginTop: '4px' }}>{staff.status}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* SECTION 5 — HR ALERTS */}
         <div className="glass-card glow-blue" style={{ border: '1px solid rgba(0, 163, 255, 0.2)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
             <Zap size={20} color="var(--accent-blue)" fill="var(--accent-blue)" />
             <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>AI Recruitment & Retention</h4>
           </div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
             Based on shift loads, you may require <strong>3 more ICU technicians</strong> by next month. Staff burnout risk in ER is currently high.
           </p>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}>
                 Optimize Nurse Shift Roaster
              </button>
              <button style={{ padding: '12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.03)', color: 'white', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}>
                 View Burnout Assessment Report
              </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default StaffManagement;
