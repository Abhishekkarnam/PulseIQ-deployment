import React from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Heart, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  Star,
  Activity,
  Calendar,
  Filter,
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
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const admissionData = [
  { day: 'Mon', admissions: 120, discharges: 95 },
  { day: 'Tue', admissions: 145, discharges: 110 },
  { day: 'Wed', admissions: 132, discharges: 140 },
  { day: 'Thu', admissions: 168, discharges: 125 },
  { day: 'Fri', admissions: 190, discharges: 160 },
  { day: 'Sat', admissions: 110, discharges: 130 },
  { day: 'Sun', admissions: 95, discharges: 105 },
];

const deptLoad = [
  { name: 'Cardiology', value: 35, color: '#00a3ff', count: '1,240' },
  { name: 'Neurology', value: 25, color: '#00f2fe', count: '890' },
  { name: 'ICU', value: 20, color: '#a855f7', count: '710' },
  { name: 'Emergency', value: 12, color: '#f59e0b', count: '430' },
  { name: 'Orthopaedics', value: 8, color: '#10b981', count: '280' },
];

const satisfactionData = [
  { subject: 'Wait Time', A: 85, fullMark: 100 },
  { subject: 'Treatment', A: 95, fullMark: 100 },
  { subject: 'Facilities', A: 70, fullMark: 100 },
  { subject: 'Staff', A: 90, fullMark: 100 },
  { subject: 'Post-op Care', A: 88, fullMark: 100 },
];

const patientList = [
  { id: 'P-1024', name: 'Alok Sharma', age: 45, dept: 'Cardiology', status: 'Stable', date: '26 May, 09:30' },
  { id: 'P-1025', name: 'Sarah Wilson', age: 32, dept: 'Neurology', status: 'Under Observation', date: '26 May, 10:15' },
  { id: 'P-1026', name: 'John Doe', age: 58, dept: 'ICU', status: 'Critical', date: '26 May, 10:45' },
  { id: 'P-1027', name: 'Anita Gupta', age: 29, dept: 'Emergency', status: 'Recovering', date: '26 May, 11:05' },
];

const PatientKPI = ({ title, value, trend, icon, color, isNegative }) => (
  <div className="glass-card animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
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
        {trend}
      </div>
    </div>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>{title}</p>
    <h3 className="outfit" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</h3>
  </div>
);

const PatientInsights = () => {
  const [dataAge, setDataAge] = React.useState('Last Week');
  const [isSimulating, setIsSimulating] = React.useState(false);

  const simulateChange = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setDataAge(dataAge === 'Last Week' ? 'Previous Week' : 'Last Week');
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className={`animate-fade-in ${isSimulating ? 'blur-sm' : ''}`} style={{ transition: 'filter 0.3s' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '8px' }}>Patient Insights</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced demographics and health-service utilization analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass" onClick={simulateChange} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'pointer', border: '1px solid var(--accent-blue)' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.9rem' }}>{dataAge}</span>
          </div>
          <button style={{ 
            backgroundColor: 'var(--accent-blue)', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 163, 255, 0.3)'
          }}>
            <Download size={18} />
            Patient Data Export
          </button>
        </div>
      </div>

      {/* SECTION 1 — PATIENT KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <PatientKPI title="Total Patients" value="12,482" trend="+12%" icon={<Users size={24} />} color="0, 163, 255" />
        <PatientKPI title="New Admissions" value="156" trend="+8%" icon={<UserPlus size={24} />} color="16, 185, 129" />
        <PatientKPI title="Avg Stay Duration" value="4.2 Days" trend="-5%" icon={<Clock size={24} />} color="168, 85, 247" />
        <PatientKPI title="Patient Satisfaction" value="4.8/5" trend="+2%" icon={<Star size={24} />} color="251, 191, 36" />
        <PatientKPI title="Outpatients" value="8,240" trend="+15%" icon={<Activity size={24} />} color="0, 242, 254" />
        <PatientKPI title="Surgeries Done" value="214" trend="+4%" icon={<Heart size={24} />} color="239, 68, 68" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SECTION 2 — ADMISSION TRENDS */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Admission vs Discharge Trends</h4>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={admissionData}>
                <defs>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#08101d', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="admissions" stroke="var(--accent-blue)" strokeWidth={3} fill="url(#colorAdm)" />
                <Area type="monotone" dataKey="discharges" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 3 — DEPARTMENTAL PATIENT LOAD */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dept Patient Allocation</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Distribution of current active patients</p>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptLoad} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                  {deptLoad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            {deptLoad.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>{item.value}%</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.count} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SECTION 4 — SATISFACTION METRICS */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Patient Satisfaction Radar</h4>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={satisfactionData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }} />
                <Radar name="Satisfaction" dataKey="A" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 6 — RECENT ADMISSIONS */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Admissions</h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Patient Name</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Age</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Department</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
                    <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Admission Date</th>
                 </tr>
               </thead>
               <tbody>
                 {patientList.map((p, i) => (
                   <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                      <td style={{ padding: '16px' }}>
                        <p style={{ fontWeight: 600 }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {p.id}</p>
                      </td>
                      <td style={{ padding: '16px' }}>{p.age} yrs</td>
                      <td style={{ padding: '16px' }}>{p.dept}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          backgroundColor: p.status === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: p.status === 'Critical' ? '#ef4444' : '#10b981'
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.85rem' }}>{p.date}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 5 — AI PATIENT INSIGHTS */}
      <div className="glass-card glow-blue" style={{ border: '1px solid rgba(0, 163, 255, 0.2)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Zap size={20} color="var(--accent-blue)" fill="var(--accent-blue)" />
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>PulseIQ Predictive Patient Analytics</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
           <div className="glass" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>Opportunity</span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>"Cardiology patient volume expected to increase by 15% next week due to seasonal trends."</p>
           </div>
           <div className="glass" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>Critical</span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>"ICU patient flow shows potential bottleneck; suggest proactive discharge coordination for stable patients."</p>
           </div>
           <div className="glass" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>Warning</span>
              </div>
              <p style={{ fontSize: '0.9rem' }}>"Emergency wait times trending 20% higher than average between 6 PM - 10 PM."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInsights;
