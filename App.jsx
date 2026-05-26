import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import FinancialAnalytics from './FinancialAnalytics';
import PatientInsights from './PatientInsights';
import Operations from './Operations';
import StaffManagement from './StaffManagement';
import AIInsightsPage from './AIInsightsPage';
import Settings from './Settings';
import './index.css';

function App() {
  return (
    <Router>
      <div className="dashboard-container">
        <Sidebar />
        
        <main className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/financials" element={<FinancialAnalytics />} />
            <Route path="/patients" element={<PatientInsights />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
