import React, { useState, useEffect } from 'react';
import { exportUrl, getJson, postJson } from './api';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  Shield, 
  Cpu,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Send,
  Activity,
  Calendar,
  Filter,
  Users,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';

const predictionData = [
  { day: 'Mon', load: 420, revenue: 1.8, icu: 85, er: 120 },
  { day: 'Tue', load: 450, revenue: 2.1, icu: 88, er: 145 },
  { day: 'Wed', load: 512, revenue: 1.9, icu: 92, er: 132 },
  { day: 'Thu', load: 480, revenue: 2.3, icu: 90, er: 168 },
  { day: 'Fri', load: 430, revenue: 2.2, icu: 86, er: 190 },
  { day: 'Sat', load: 460, revenue: 2.4, icu: 89, er: 110 },
  { day: 'Sun', load: 490, revenue: 2.5, icu: 91, er: 95 },
];

const AIInsightsPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Initializing PulseIQ AI...");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [insightsData, setInsightsData] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: 'Hello, CEO. I am your PulseIQ Assistant. What would you like to know about hospital performance tonight?' }
  ]);

  useEffect(() => {
    getJson('/api/ai-insights')
      .then(setInsightsData)
      .catch(() => setInsightsData(null));

    const sequence = [
      { text: "Scanning hospital operations...", delay: 1000 },
      { text: "Analyzing financial trends...", delay: 2000 },
      { text: "Predicting patient inflow...", delay: 3000 },
      { text: "Let me show you what to focus on...", delay: 4500 }
    ];

    sequence.forEach((s, i) => {
      setTimeout(() => {
        setLoadingText(s.text);
        if (i === sequence.length - 1) {
          setTimeout(() => setLoading(false), 1500);
        }
      }, s.delay);
    });
  }, []);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const outgoingMessage = chatMessage;
    const newHistory = [...chatHistory, { type: 'user', text: outgoingMessage }];
    setChatHistory(newHistory);
    setChatMessage("");

    try {
      const data = await postJson('/api/assistant/chat', { message: outgoingMessage });
      setChatHistory(prev => [...prev, { type: 'bot', text: data.reply }]);
    } catch {
      setChatHistory(prev => [...prev, {
        type: 'bot',
        text: 'I could not reach the backend right now, but the dashboard fallback is still available.'
      }]);
    }
  };

  const activePredictionData = insightsData?.predictions ?? predictionData;
  const activeRiskAlerts = insightsData?.riskAlerts?.map((alert) => ({
    text: alert.text,
    type: alert.type,
    color: alert.type === 'Critical' ? '#ef4444' : alert.type === 'Warning' ? '#f59e0b' : '#a855f7',
  })) ?? [
    { text: "ICU occupancy exceeded 92%", type: "Critical", color: "#ef4444" },
    { text: "ER wait times increasing rapidly", type: "Warning", color: "#f59e0b" },
    { text: "Staff shortage in ER ward", type: "Critical", color: "#ef4444" },
    { text: "Claim delays affecting revenue", type: "Moderate", color: "#a855f7" }
  ];

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={28} color="white" />
          </div>
          <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700 }}>AI Strategic Insights</h1>
        </div>
        <div className="glass" style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', borderRadius: '32px' }}>
          <Zap size={48} color="var(--accent-blue)" className="animate-pulse" />
          <h2 className="outfit" style={{ fontSize: '1.5rem', fontWeight: 600 }}>{loadingText}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 163, 255, 0.4)'
          }}>
            <Cpu size={28} color="white" />
          </div>
          <div>
            <h1 className="outfit" style={{ fontSize: '2.25rem', fontWeight: 700, margin: 0 }}>AI Strategic Insights</h1>
            <p style={{ color: 'var(--text-secondary)' }}>AI-powered operational intelligence and predictive healthcare analytics</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', cursor: 'pointer' }}>
            <Filter size={18} /> <span style={{ fontSize: '0.9rem' }}>All Branches</span> <ChevronDown size={14} />
          </div>
          <button onClick={() => window.location.href = exportUrl('ai-insights')} style={{ backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Generate AI Report
          </button>
        </div>
      </div>

      {/* SECTION 1 — AI EXECUTIVE SUMMARY */}
      <div className="glass-card glow-blue" style={{ border: '1px solid rgba(0, 163, 255, 0.3)', padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ padding: '16px', borderRadius: '20px', backgroundColor: 'rgba(0, 163, 255, 0.1)', color: 'var(--accent-blue)' }}>
            <Sparkles size={32} />
          </div>
          <p style={{ fontSize: '1.4rem', fontWeight: 500, lineHeight: 1.6, color: 'white' }}>
            “{insightsData?.summary ?? 'Revenue growth remains strong this month, driven primarily by cardiology services. However, ICU occupancy and emergency wait times require immediate attention.'}”
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SECTION 2 — RISK ALERTS */}
        <div className="glass-card">
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>AI Risk Detection 🚨</h4>
          {activeRiskAlerts.map((alert, i) => (
            <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', marginBottom: '12px', borderLeft: `4px solid ${alert.color}` }}>
              <AlertCircle size={20} color={alert.color} />
              <span style={{ fontSize: '0.9rem', flex: 1 }}>{alert.text}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '10px', backgroundColor: `${alert.color}20`, color: alert.color }}>{alert.type}</span>
            </div>
          ))}
        </div>

        {/* SECTION 6 — HEALTH SCORE */}
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Hospital Health Score ⭐</h4>
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
            <svg width="160" height="160" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-teal)" strokeWidth="8" strokeDasharray="230" strokeDashoffset="45" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <h2 className="outfit" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-teal)' }}>{insightsData?.healthScore ?? 87}</h2>
            </div>
          </div>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Hospital Efficiency Score: <span style={{ color: 'white' }}>Excellent</span></p>
        </div>
      </div>

      {/* SECTION 3 — PREDICTIVE ANALYTICS */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem' }}>Executive Predictive Analytics 🔮</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activePredictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="load" stroke="var(--accent-blue)" strokeWidth={3} fill="rgba(0, 163, 255, 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
            <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>↑ Predicted inflow next week: +14%</p>
          </div>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activePredictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="icu" stroke="#f59e0b" strokeWidth={3} />
                <Line type="monotone" dataKey="er" stroke="#00f2fe" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
             <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: '10px' }}>⚠ Predicted ICU occupancy tomorrow: 91%</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* SECTION 4 — RECOMMENDATIONS */}
        <div className="glass-card">
           <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Strategic Recommendations ⭐</h4>
           {(insightsData?.recommendations ?? ["Increase ICU staffing by 10%", "Expand Neurology department capacity", "Reallocate staff during ER peak"]).map((txt, i) => (
             <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', marginBottom: '10px' }}>
                <Lightbulb size={20} color="var(--accent-teal)" />
                <span style={{ fontSize: '0.9rem' }}>{txt}</span>
             </div>
           ))}
        </div>

        {/* SECTION 5 — OPPORTUNITIES */}
        <div className="glass-card">
           <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Opportunity Insights 📈</h4>
           {(insightsData?.opportunities ?? ["Telemedicine consultations +22%", "Mumbai branch profitability ↑", "Cardiology growth potential: High"]).map((txt, i) => (
             <div key={i} style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{txt}</span>
                <ArrowUpRight size={16} color="#10b981" />
             </div>
           ))}
        </div>
      </div>

      {/* SECTION 8 — TREND ANALYSIS TIMELINE */}
      <div className="glass-card">
        <h4 className="outfit" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>AI Trend Timeline</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '2px solid rgba(255,255,255,0.05)', paddingLeft: '20px', marginLeft: '10px' }}>
           {[
             { time: "11:30 AM", text: "Emergency admissions increased", col: "#ef4444" },
             { time: "10:15 AM", text: "Occupancy crossed optimal threshold", col: "#f59e0b" },
             { time: "09:00 AM", text: "Revenue target achieved for the week", col: "#10b981" }
           ].map((item, i) => (
             <div key={i} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-29px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.col }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.time}</span>
                <p style={{ fontSize: '0.9rem' }}>{item.text}</p>
             </div>
           ))}
        </div>
      </div>

      {/* FLOAT CHAT */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
        {chatOpen && (
          <div className="glass" style={{ width: '320px', height: '400px', borderRadius: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            <div style={{ padding: '15px', background: 'var(--accent-blue)', color: 'white', fontWeight: 700 }}>PulseIQ Assistant</div>
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              {chatHistory.map((m, i) => (
                <div key={i} style={{ alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start', padding: '10px', borderRadius: '12px', backgroundColor: m.type === 'user' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)' }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '10px', display: 'flex', gap: '5px' }}>
              <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '10px', color: 'white', outline: 'none' }} placeholder="Ask AI..." />
              <button onClick={handleSendMessage} style={{ padding: '8px', borderRadius: '8px', background: 'var(--accent-blue)', color: 'white', border: 'none' }}><Send size={18} /></button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
          <MessageSquare size={28} />
        </button>
      </div>

    </div>
  );
};

export default AIInsightsPage;
