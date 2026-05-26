import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FinancialAnalytics from './pages/FinancialAnalytics';
import PatientInsights from './pages/PatientInsights';
import Operations from './pages/Operations';
import StaffManagement from './pages/StaffManagement';
import AIInsightsPage from './pages/AIInsightsPage';
import Settings from './pages/Settings';
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
