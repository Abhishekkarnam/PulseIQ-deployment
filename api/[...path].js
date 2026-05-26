import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const DATASET_PATH = fs.existsSync(path.join(ROOT_DIR, 'DATAset.csv'))
  ? path.join(ROOT_DIR, 'DATAset.csv')
  : path.join(ROOT_DIR, 'Hospital_Data_Collection.csv');

const DEPARTMENT_COLORS = {
  Cardiology: '#00a3ff',
  Neurology: '#00f2fe',
  ICU: '#a855f7',
  Emergency: '#f59e0b',
  Orthopaedics: '#10b981',
};

const DEPARTMENT_WEIGHTS = {
  Cardiology: 0.35,
  Neurology: 0.25,
  ICU: 0.2,
  Emergency: 0.12,
  Orthopaedics: 0.08,
};

const BRANCH_WEIGHTS = {
  Bengaluru: 0.34,
  Mumbai: 0.29,
  Delhi: 0.22,
  Hyderabad: 0.15,
};

let cachedMetrics;

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function parseDate(value) {
  const normalized = String(value || '').trim();
  if (!normalized) return null;

  if (normalized.includes('-')) {
    const parts = normalized.split('-').map(Number);
    if (parts[0] > 1900) return new Date(parts[0], parts[1] - 1, parts[2]);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function monthName(date) {
  return date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
}

function loadMetrics() {
  if (cachedMetrics) return cachedMetrics;

  const csv = fs.readFileSync(DATASET_PATH, 'utf8').trim();
  const [headerLine, ...lines] = csv.split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  const rows = lines
    .map((line) => {
      const values = parseCsvLine(line);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      row.Date = parseDate(row.Date);
      row.Month = row.Month || monthName(row.Date);

      for (const key of [
        'Patient_Inflow',
        'Outpatients',
        'Emergency_Cases',
        'Bed_Occupancy_Rate',
        'Staff_on_Duty',
        'Daily_Revenue',
        'Medicine_Expenses',
        'Surgery_Count',
        'Operating_Theater_Utilization',
        'Patient_Satisfaction_Score',
      ]) {
        row[key] = Number(row[key] || 0);
      }

      return row;
    })
    .filter((row) => row.Date && !Number.isNaN(row.Date.getTime()))
    .sort((a, b) => a.Date - b.Date);

  const current = rows.slice(-30);
  let previous = rows.slice(Math.max(0, rows.length - 60), Math.max(0, rows.length - 30));
  if (!previous.length) previous = rows.slice(0, Math.min(30, rows.length));

  cachedMetrics = {
    rows,
    latest: rows[rows.length - 1],
    current,
    previous,
  };
  return cachedMetrics;
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function mean(rows, key) {
  return rows.length ? sum(rows, key) / rows.length : 0;
}

function std(rows, key) {
  if (!rows.length) return 0;
  const avg = mean(rows, key);
  return Math.sqrt(rows.reduce((total, row) => total + ((row[key] || 0) - avg) ** 2, 0) / rows.length);
}

function quantile(rows, key, q) {
  const values = rows.map((row) => Number(row[key] || 0)).sort((a, b) => a - b);
  if (!values.length) return 0;
  return values[Math.floor((values.length - 1) * q)];
}

function percentChange(current, previous) {
  if (!previous || Number.isNaN(previous)) return 0;
  return ((current - previous) / previous) * 100;
}

function fmtPercent(value, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

function fmtSignedPercent(value, digits = 0) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

function fmtInr(value) {
  if (value >= 10000000) return `Rs ${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `Rs ${(value / 100000).toFixed(1)}L`;
  return `Rs ${Math.round(value).toLocaleString('en-IN')}`;
}

function departmentSplit(total, asPercent = false) {
  return Object.entries(DEPARTMENT_WEIGHTS).map(([name, weight]) => ({
    name,
    value: Number((asPercent ? weight * 100 : total * weight).toFixed(2)),
    color: DEPARTMENT_COLORS[name],
  }));
}

function monthlyFinancials(months = 6) {
  const { rows } = loadMetrics();
  const grouped = new Map();

  for (const row of rows) {
    const key = `${row.Date.getFullYear()}-${String(row.Date.getMonth() + 1).padStart(2, '0')}`;
    const item = grouped.get(key) || { date: row.Date, revenue: 0, expenses: 0 };
    item.revenue += row.Daily_Revenue;
    item.expenses += row.Medicine_Expenses;
    grouped.set(key, item);
  }

  return [...grouped.values()].slice(-months).map((row) => ({
    month: monthName(row.date),
    revenue: Number((row.revenue / 100000).toFixed(2)),
    expenses: Number((row.expenses / 100000).toFixed(2)),
  }));
}

function weeklyPatientFlow(days = 7) {
  const { rows } = loadMetrics();
  return rows.slice(-days).map((row) => ({
    day: row.Date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    admissions: Math.round(row.Patient_Inflow),
    discharges: Math.max(Math.round(row.Patient_Inflow - row.Emergency_Cases + row.Surgery_Count), 0),
  }));
}

function departmentPerformance() {
  const { current } = loadMetrics();
  const totalRevenue = sum(current, 'Daily_Revenue');
  const totalPatients = sum(current, 'Patient_Inflow');
  const satisfaction = mean(current, 'Patient_Satisfaction_Score');
  const occupancy = mean(current, 'Bed_Occupancy_Rate');

  return Object.entries(DEPARTMENT_WEIGHTS).map(([name, weight]) => {
    const efficiency = Math.min(99, Math.max(65, occupancy + weight * 34 - (name === 'Emergency' ? 8 : 0)));
    return {
      name,
      revenue: fmtInr(totalRevenue * weight),
      patients: Math.round(totalPatients * weight),
      satisfaction: Number(Math.min(5, satisfaction + weight / 2).toFixed(1)),
      efficiency: Math.round(efficiency),
    };
  });
}

function alertsPayload() {
  const { latest, current } = loadMetrics();
  const alerts = [];
  const occupancy = latest.Bed_Occupancy_Rate;
  const staff = latest.Staff_on_Duty;
  const emergency = latest.Emergency_Cases;
  const expenses = latest.Medicine_Expenses;
  const avgExpenses = mean(current, 'Medicine_Expenses');

  if (occupancy >= 90) {
    alerts.push({
      title: 'ICU Capacity Critical',
      description: `Latest bed occupancy is ${occupancy.toFixed(1)}%; secondary transfers should be reviewed.`,
      type: 'critical',
      time: '12 mins ago',
    });
  }
  if (staff < quantile(current, 'Staff_on_Duty', 0.25)) {
    alerts.push({
      title: 'Staff Shortage: Emergency',
      description: `Current staffing is ${staff}, below recent operating baseline.`,
      type: 'critical',
      time: '45 mins ago',
    });
  }
  if (emergency >= quantile(current, 'Emergency_Cases', 0.75)) {
    alerts.push({
      title: 'Emergency Demand Spike',
      description: `${emergency} emergency cases logged in the latest daily snapshot.`,
      type: 'warning',
      time: '1 hour ago',
    });
  }
  if (expenses > avgExpenses * 1.12) {
    alerts.push({
      title: 'Medicine Cost Variance',
      description: 'Medicine expenses are running above the 30-day average.',
      type: 'warning',
      time: '2 hours ago',
    });
  }

  return alerts.slice(0, 4);
}

function dashboardPayload() {
  const { latest, current, previous } = loadMetrics();
  const currentRevenue = sum(current, 'Daily_Revenue');
  const previousRevenue = sum(previous, 'Daily_Revenue');
  const currentPatients = sum(current, 'Patient_Inflow');
  const previousPatients = sum(previous, 'Patient_Inflow');
  const occupancy = mean(current, 'Bed_Occupancy_Rate');
  const previousOccupancy = mean(previous, 'Bed_Occupancy_Rate');
  const satisfaction = mean(current, 'Patient_Satisfaction_Score');
  const previousSatisfaction = mean(previous, 'Patient_Satisfaction_Score');
  const currentEmergency = sum(current, 'Emergency_Cases');
  const previousEmergency = sum(previous, 'Emergency_Cases');
  const criticalAlerts = current.filter((row) => row.Bed_Occupancy_Rate >= 90).length;

  return {
    kpis: [
      { title: 'Total Revenue', value: fmtInr(currentRevenue), trendValue: fmtSignedPercent(percentChange(currentRevenue, previousRevenue)) },
      { title: 'Patient Acquisition', value: Math.round(currentPatients).toLocaleString('en-IN'), trendValue: fmtSignedPercent(percentChange(currentPatients, previousPatients)) },
      { title: 'Operational Capacity', value: fmtPercent(occupancy), trendValue: fmtSignedPercent(percentChange(occupancy, previousOccupancy)) },
      { title: 'Patient Satisfaction', value: `${satisfaction.toFixed(1)}/5`, trendValue: fmtSignedPercent(percentChange(satisfaction, previousSatisfaction)) },
      { title: 'Active Doctors', value: Math.round(latest.Staff_on_Duty * 3.1).toLocaleString('en-IN'), trendValue: fmtSignedPercent(percentChange(mean(current, 'Staff_on_Duty'), mean(previous, 'Staff_on_Duty'))) },
      { title: 'Critical Alerts', value: String(criticalAlerts).padStart(2, '0'), trendValue: fmtSignedPercent(percentChange(currentEmergency, previousEmergency)), isNegative: criticalAlerts > 0 },
    ],
    revenueTrend: monthlyFinancials(),
    departmentRevenue: departmentSplit(100, true),
    departmentPerformance: departmentPerformance(),
    alerts: alertsPayload(),
    generatedAt: latest.Date.toISOString(),
  };
}

function branchPerformance(revenue, expenses) {
  return Object.entries(BRANCH_WEIGHTS).map(([name, weight], index) => {
    const branchRevenue = revenue * weight;
    const branchExpenses = expenses * (weight + (name === 'Hyderabad' ? 0.02 : 0));
    const margin = branchRevenue ? ((branchRevenue - branchExpenses) / branchRevenue) * 100 : 0;
    return {
      branch: name,
      revenue: fmtInr(branchRevenue),
      expenses: fmtInr(branchExpenses),
      margin: fmtPercent(margin),
      growth: fmtSignedPercent(14 - index * 4),
      status: name === 'Hyderabad' ? 'down' : 'up',
    };
  });
}

function financialsPayload() {
  const { current, previous } = loadMetrics();
  const revenue = sum(current, 'Daily_Revenue');
  const previousRevenue = sum(previous, 'Daily_Revenue');
  const expenses = sum(current, 'Medicine_Expenses');
  const previousExpenses = sum(previous, 'Medicine_Expenses');
  const netProfit = revenue - expenses;
  const previousProfit = previousRevenue - previousExpenses;

  return {
    kpis: {
      totalRevenue: fmtInr(revenue),
      netProfit: fmtInr(netProfit),
      operationalCosts: fmtInr(expenses),
      insuranceApproved: '84%',
      outstanding: fmtInr(revenue * 0.085),
      growthRate: fmtSignedPercent(percentChange(revenue, previousRevenue)),
      trends: {
        revenue: fmtSignedPercent(percentChange(revenue, previousRevenue)),
        profit: fmtSignedPercent(percentChange(netProfit, previousProfit)),
        costs: fmtSignedPercent(percentChange(expenses, previousExpenses)),
      },
    },
    monthlyRevenue: monthlyFinancials(),
    departmentRevenue: departmentSplit(100, true),
    branchPerformance: branchPerformance(revenue, expenses),
    insights: [
      'Cardiology remains the largest revenue contributor in the current operating mix.',
      'Medicine costs are the biggest direct expense driver in the latest 30-day window.',
      'Emergency case volatility is the most visible pressure on staffing and margin.',
    ],
    alerts: alertsPayload(),
  };
}

function recentAdmissions(limit = 6) {
  const { rows } = loadMetrics();
  const names = ['Alok Sharma', 'Sarah Wilson', 'John Doe', 'Anita Gupta', 'Rohan Mehta', 'Priya Nair'];
  const departments = Object.keys(DEPARTMENT_WEIGHTS);
  const statuses = ['Stable', 'Under Observation', 'Critical', 'Recovering', 'Stable', 'Recovering'];

  return rows.slice(-limit).map((row, index) => ({
    id: `P-${1024 + index}`,
    name: names[index % names.length],
    age: 28 + (Math.round(row.Patient_Inflow) % 35),
    dept: departments[index % departments.length],
    status: statuses[index % statuses.length],
    date: `${String(row.Date.getDate()).padStart(2, '0')} ${monthName(row.Date)}, 00:00`,
  }));
}

function patientsPayload() {
  const { latest, current, previous } = loadMetrics();
  const patients = sum(current, 'Patient_Inflow');
  const previousPatients = sum(previous, 'Patient_Inflow');
  const outpatients = sum(current, 'Outpatients');
  const previousOutpatients = sum(previous, 'Outpatients');
  const surgeries = sum(current, 'Surgery_Count');
  const previousSurgeries = sum(previous, 'Surgery_Count');
  const satisfaction = mean(current, 'Patient_Satisfaction_Score');
  const previousSatisfaction = mean(previous, 'Patient_Satisfaction_Score');
  const avgStay = Math.max(2.5, 6.2 - mean(current, 'Bed_Occupancy_Rate') / 35);

  return {
    kpis: {
      totalPatients: Math.round(patients).toLocaleString('en-IN'),
      newAdmissions: Math.round(latest.Patient_Inflow),
      avgStayDuration: `${avgStay.toFixed(1)} Days`,
      patientSatisfaction: `${satisfaction.toFixed(1)}/5`,
      outpatients: Math.round(outpatients).toLocaleString('en-IN'),
      surgeriesDone: Math.round(surgeries),
      trends: {
        patients: fmtSignedPercent(percentChange(patients, previousPatients)),
        outpatients: fmtSignedPercent(percentChange(outpatients, previousOutpatients)),
        surgeries: fmtSignedPercent(percentChange(surgeries, previousSurgeries)),
        satisfaction: fmtSignedPercent(percentChange(satisfaction, previousSatisfaction)),
      },
    },
    admissions: weeklyPatientFlow(),
    departmentLoad: departmentSplit(100, true).map((row) => ({ ...row, count: Math.round(patients * DEPARTMENT_WEIGHTS[row.name]) })),
    satisfactionRadar: [
      { subject: 'Wait Time', score: Math.round(Math.max(60, 100 - mean(current, 'Emergency_Cases') * 1.8)) },
      { subject: 'Treatment', score: Math.round(satisfaction * 20) },
      { subject: 'Facilities', score: Math.round(Math.max(65, 100 - std(current, 'Bed_Occupancy_Rate'))) },
      { subject: 'Staff', score: Math.round(Math.min(98, mean(current, 'Staff_on_Duty') * 1.45)) },
      { subject: 'Post-op Care', score: Math.round(Math.min(96, satisfaction * 19)) },
    ],
    recentAdmissions: recentAdmissions(),
  };
}

function bedCapacity(occupancy) {
  const totals = {
    'General Ward': 150,
    ICU: 50,
    'Semi-Private': 80,
    Emergency: 30,
    Private: 40,
  };
  const modifiers = {
    'General Ward': -6,
    ICU: 8,
    'Semi-Private': -12,
    Emergency: 6,
    Private: -3,
  };
  const colors = ['#00a3ff', '#f59e0b', '#00f2fe', '#ef4444', '#a855f7'];

  return Object.entries(totals).map(([name, total], index) => {
    const rate = Math.min(99, Math.max(30, occupancy + modifiers[name]));
    return { name, occupied: Math.round((total * rate) / 100), total, color: colors[index] };
  });
}

function otEfficiency() {
  const { current } = loadMetrics();
  const base = mean(current, 'Operating_Theater_Utilization');
  const slots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const offsets = [0, 8, 4, 2, -7, -18, -30];
  return slots.map((slot, index) => ({ time: slot, load: Math.round(Math.min(99, Math.max(20, base + offsets[index]))) }));
}

function equipmentStatus() {
  const { latest } = loadMetrics();
  return [
    { name: 'MRI Scanner', status: 'Active', load: fmtPercent(Math.min(98, latest.Operating_Theater_Utilization + 4)), lastService: '12 May' },
    { name: 'CT Scanner', status: 'Maintenance', load: '0%', lastService: '25 May' },
    { name: 'Ventilators (50)', status: 'Active', load: fmtPercent(Math.min(99, latest.Bed_Occupancy_Rate)), lastService: '15 May' },
    { name: 'X-Ray Unit', status: 'Active', load: fmtPercent(Math.max(45, latest.Operating_Theater_Utilization - 8)), lastService: '20 May' },
  ];
}

function operationsPayload() {
  const { current, previous } = loadMetrics();
  const occupancy = mean(current, 'Bed_Occupancy_Rate');
  const previousOccupancy = mean(previous, 'Bed_Occupancy_Rate');
  const ot = mean(current, 'Operating_Theater_Utilization');
  const previousOt = mean(previous, 'Operating_Theater_Utilization');
  const staff = mean(current, 'Staff_on_Duty');
  const previousStaff = mean(previous, 'Staff_on_Duty');

  return {
    kpis: {
      overallBedOccupancy: fmtPercent(occupancy),
      otUtilization: fmtPercent(ot),
      avgTurnaroundTime: `${Math.max(28, 70 - occupancy / 2).toFixed(0)}m`,
      safetyCompliance: fmtPercent(Math.min(99, 90 + staff / 10)),
      trends: {
        occupancy: fmtSignedPercent(percentChange(occupancy, previousOccupancy)),
        ot: fmtSignedPercent(percentChange(ot, previousOt)),
        staff: fmtSignedPercent(percentChange(staff, previousStaff)),
      },
    },
    bedCapacity: bedCapacity(occupancy),
    otEfficiency: otEfficiency(),
    equipmentStatus: equipmentStatus(),
    alerts: alertsPayload(),
  };
}

function aiInsightsPayload() {
  const { latest, current, previous } = loadMetrics();
  const occupancy = latest.Bed_Occupancy_Rate;
  const emergency = latest.Emergency_Cases;
  const revenueGrowth = percentChange(sum(current, 'Daily_Revenue'), sum(previous, 'Daily_Revenue'));
  const healthScore = Math.round(mean([
    { value: Math.min(100, mean(current, 'Patient_Satisfaction_Score') * 20) },
    { value: Math.max(0, 100 - Math.abs(82 - mean(current, 'Bed_Occupancy_Rate'))) },
    { value: Math.min(100, mean(current, 'Operating_Theater_Utilization')) },
    { value: Math.min(100, 70 + revenueGrowth) },
  ], 'value'));

  return {
    summary: 'Revenue momentum remains positive, while bed occupancy and emergency demand need active daily coordination.',
    healthScore,
    riskAlerts: [
      { text: `Bed occupancy at ${occupancy.toFixed(1)}%`, type: occupancy >= 90 ? 'Critical' : 'Moderate' },
      { text: `Emergency cases at ${emergency}`, type: emergency >= 25 ? 'Warning' : 'Moderate' },
      { text: 'Medicine expenses should be monitored against revenue growth', type: 'Moderate' },
    ],
    predictions: weeklyPatientFlow().map((row, index) => ({
      day: row.day,
      load: row.admissions + row.discharges,
      icu: Math.round(Math.min(99, occupancy + index)),
      er: row.admissions,
    })),
    recommendations: [
      'Increase ICU staffing coverage during high occupancy windows.',
      'Pre-plan emergency overflow routing for peak inflow days.',
      'Track medicine expense variance daily until it returns to baseline.',
    ],
    opportunities: [
      'Cardiology and Neurology remain the strongest expansion candidates.',
      'OT utilization supports a more predictable elective surgery calendar.',
      'Patient satisfaction signals room for a wait-time reduction initiative.',
    ],
  };
}

function assistantReply(message = '') {
  const normalized = message.toLowerCase().trim();
  if (!normalized) return { reply: 'Ask me about revenue, patients, operations, or current risks.' };

  if (normalized.includes('revenue') || normalized.includes('profit') || normalized.includes('financial')) {
    const payload = financialsPayload();
    return { reply: `Current 30-day revenue is ${payload.kpis.totalRevenue} with net profit at ${payload.kpis.netProfit}. The most useful next check is medicine cost variance.` };
  }
  if (normalized.includes('patient') || normalized.includes('admission')) {
    const payload = patientsPayload();
    return { reply: `The latest patient snapshot shows ${payload.kpis.newAdmissions} new admissions and satisfaction at ${payload.kpis.patientSatisfaction}.` };
  }
  if (normalized.includes('icu') || normalized.includes('bed') || normalized.includes('operation')) {
    const payload = operationsPayload();
    return { reply: `Overall bed occupancy is ${payload.kpis.overallBedOccupancy} and OT utilization is ${payload.kpis.otUtilization}. Keep ICU and emergency overflow plans active.` };
  }
  return { reply: 'The strongest signal is to balance revenue growth with occupancy pressure: protect ICU capacity, watch emergency inflow, and keep medicine expenses inside target.' };
}

function rawRecords(limit = 500) {
  const { rows } = loadMetrics();
  return rows.slice(-limit).map((row) => ({
    ...row,
    Date: row.Date.toISOString().slice(0, 10),
  }));
}

function sendCsv(res, section, payload) {
  const rows = Array.isArray(payload) ? payload : [payload];
  const text = JSON.stringify(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="pulseiq-${section}.csv"`);
  res.status(200).send(text);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

export default async function handler(req, res) {
  try {
    const pathParts = Array.isArray(req.query.path) ? req.query.path : [req.query.path].filter(Boolean);
    const route = pathParts.join('/');

    if (route === 'health') {
      const { rows, latest } = loadMetrics();
      return res.status(200).json({ status: 'ok', rows: rows.length, latestDate: latest.Date.toISOString() });
    }
    if (route === 'dashboard') return res.status(200).json(dashboardPayload());
    if (route === 'financials') return res.status(200).json(financialsPayload());
    if (route === 'patients') return res.status(200).json(patientsPayload());
    if (route === 'operations') return res.status(200).json(operationsPayload());
    if (route === 'ai-insights') return res.status(200).json(aiInsightsPayload());
    if (route === 'assistant/chat' && req.method === 'POST') {
      const body = await readBody(req);
      return res.status(200).json(assistantReply(body.message));
    }
    if (route === 'data') return res.status(200).json({ records: rawRecords(Number(req.query.limit || 500)) });
    if (route.startsWith('export/')) {
      const section = route.replace('export/', '');
      const payloads = {
        dashboard: dashboardPayload,
        financials: financialsPayload,
        patients: patientsPayload,
        operations: operationsPayload,
        'ai-insights': aiInsightsPayload,
        raw: () => rawRecords(5000),
      };
      return sendCsv(res, section, payloads[section]?.() || []);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
