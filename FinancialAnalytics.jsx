import React from 'react';
import { exportUrl, getJson } from './api';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Activity,
  Calendar,
  Filter,
  Download,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 1.8, expenses: 1.2 },
  { month: 'Feb', revenue: 2.1, expenses: 1.3 },
  { month: 'Mar', revenue: 1.9, expenses: 1.25 },
  { month: 'Apr', revenue: 2.3, expenses: 1.4 },
  { month: 'May', revenue: 2.2, expenses: 1.35 },
  { month: 'Jun', revenue: 2.4, expenses: 1.5 },
];

const deptRevenue = [
  { name: 'Cardiology', value: 35, color: '#00a3ff' },
  { name: 'Neurology', value: 25, color: '#00f2fe' },
  { name: 'ICU', value: 20, color: '#a855f7' },
  { name: 'Emergency', value: 12, color: '#f59e0b' },
  { name: 'Orthopaedics', value: 8, color: '#10b981' },
];

const branchData = [
  { branch: 'Bengaluru', revenue: '₹84L', expenses: '₹42L', margin: '50%', growth: '+12%', status: 'up' },
  { branch: 'Mumbai', revenue: '₹72L', expenses: '₹38L', margin: '47%', growth: '+8%', status: 'up' },
  { branch: 'Delhi', revenue: '₹58L', expenses: '₹34L', margin: '41%', growth: '+5%', status: 'up' },
  { branch: 'Hyderabad', revenue: '₹46L', expenses: '₹28L', margin: '39%', growth: '-2%', status: 'down' },
];

const FinancialKPI = ({ title, value, trend, icon, color, isNegative }) => (
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

const FinancialAnalytics = () => {
  const [financialData, setFinancialData] = React.useState(null);

  React.useEffect(() => {
    getJson('/api/financials')
      .then(setFinancialData)
      .catch(() => setFinancialData(null));
  }, []);

  const activeRevenueData = financialData?.monthlyRevenue ?? revenueData;
  const activeDeptRevenue = financialData?.departmentRevenue ?? deptRevenue;
  const activeBranchData = financialData?.branchPerformance ?? branchData;
  const kpis = financialData?.kpis;
  const insights = financialData?.insights?.map((text, index) => ({
    text,
    tag: index === 1 ? 'Warning' : 'Opportunity',
    color: index === 1 ? '#f59e0b' : '#10b981',
  })) ?? [
    { text: "Cardiology generated highest revenue this quarter.", tag: "Opportunity", color: "#10b981" },
    { text: "Operational costs increased by 11% primarily in procurement.", tag: "Warning", color: "#f59e0b" },
    { text: "Insurance claim delays affecting cash flow in Mumbai branch.", tag: "Critical", color: "#ef4444" },
    { text: "Neurology expected to grow next month based on referral trends.", tag: "Opportunity", color: "#10b981" }
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '8px' }}>Financial Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Real-time financial performance and strategic revenue insights</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'pointer' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.9rem' }}>Last 6 Months</span>
          </div>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'pointer' }}>
            <Filter size={18} />
            <span style={{ fontSize: '0.9rem' }}>All Branches</span>
          </div>
          <button onClick={() => window.location.href = exportUrl('financials')} style={{ 
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
            Export Report
          </button>
        </div>
      </div>

      {/* SECTION 1 — FINANCIAL KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <FinancialKPI title="Total Revenue" value={kpis?.totalRevenue ?? "₹2.4 Cr"} trend={kpis?.trends?.revenue ?? "+18%"} icon={<DollarSign size={24} />} color="0, 163, 255" />
        <FinancialKPI title="Net Profit" value={kpis?.netProfit ?? "₹68L"} trend={kpis?.trends?.profit ?? "+12%"} icon={<TrendingUp size={24} />} color="16, 185, 129" />
        <FinancialKPI title="Operational Costs" value={kpis?.operationalCosts ?? "₹1.1 Cr"} trend={kpis?.trends?.costs ?? "+5%"} icon={<CreditCard size={24} />} color="245, 158, 11" />
        <FinancialKPI title="Insurance Approved" value="84%" trend="+3%" icon={<Activity size={24} />} color="0, 242, 254" />
        <FinancialKPI title="Outstanding" value={kpis?.outstanding ?? "₹21L"} trend="+15%" icon={<AlertTriangle size={24} />} color="239, 68, 68" isNegative />
        <FinancialKPI title="Growth Rate" value={kpis?.growthRate ?? "+14%"} trend="+2%" icon={<ArrowUpRight size={24} />} color="168, 85, 247" />
      </div>

      {/* SECTION 2 & 3 — REVENUE & EXPENSE ANALYTICS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Monthly Revenue vs Expenses</h4>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeRevenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#08101d', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '0.85rem' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent-blue)" strokeWidth={3} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Revenue by Department</h4>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activeDeptRevenue} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {activeDeptRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {activeDeptRevenue.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
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

      {/* SECTION 4 — BRANCH PERFORMANCE */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Branch wise Financial Performance</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Branch</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Revenue</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Expenses</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Profit Margin</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {activeBranchData.map((branch, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{branch.branch}</td>
                  <td style={{ padding: '16px' }}>{branch.revenue}</td>
                  <td style={{ padding: '16px' }}>{branch.expenses}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px' }}>
                        <div style={{ width: branch.margin, height: '100%', backgroundColor: 'var(--accent-blue)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem' }}>{branch.margin}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: branch.status === 'up' ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {branch.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5 & 6 — TOP DEPTS & AI INSIGHTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Top Performance Highlights</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Highest Revenue</p>
              <h5 className="outfit" style={{ fontSize: '1.1rem', color: 'var(--accent-blue)' }}>Cardiology</h5>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>₹84L this quarter</p>
            </div>
            <div className="glass" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Fastest Growth</p>
              <h5 className="outfit" style={{ fontSize: '1.1rem', color: '#10b981' }}>Neurology</h5>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>+22% MoM</p>
            </div>
            <div className="glass" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Best Profit Margin</p>
              <h5 className="outfit" style={{ fontSize: '1.1rem', color: '#a855f7' }}>ICU</h5>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>52% efficiency</p>
            </div>
            <div className="glass" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Lowest Op. Cost</p>
              <h5 className="outfit" style={{ fontSize: '1.1rem', color: '#00f2fe' }}>Emergency</h5>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Budget -8%</p>
            </div>
          </div>
        </div>

        <div className="glass-card glow-blue" style={{ border: '1px solid rgba(0, 163, 255, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <Zap size={20} color="var(--accent-blue)" fill="var(--accent-blue)" />
            <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600 }}>AI Financial Insights</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {insights.map((insight, i) => (
              <div key={i} className="glass" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>{insight.text}</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  backgroundColor: `${insight.color}20`, 
                  color: insight.color,
                  border: `1px solid ${insight.color}40`,
                  textTransform: 'uppercase'
                }}>{insight.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 7 — FINANCIAL ALERTS PANEL */}
      <div className="glass-card">
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Financial Alerts</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          <div className="glass" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Rising Operational Costs</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Medicine procurement costs exceeded budget by 12% in Bengaluru.</p>
          </div>
          <div className="glass" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Delayed Insurance Claims</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>₹14L in claims pending past the 30-day processing threshold.</p>
          </div>
          <div className="glass" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>Budget Threshold Warning</h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ICU equipment maintenance budget reached 95% of annual allocation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalytics;
