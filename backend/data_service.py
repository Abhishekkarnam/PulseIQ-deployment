from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


ROOT_DIR = Path(__file__).resolve().parents[1]
PRIMARY_DATASET = ROOT_DIR / "DATAset.csv"
FALLBACK_DATASET = ROOT_DIR / "Hospital_Data_Collection.csv"

DEPARTMENT_COLORS = {
    "Cardiology": "#00a3ff",
    "Neurology": "#00f2fe",
    "ICU": "#a855f7",
    "Emergency": "#f59e0b",
    "Orthopaedics": "#10b981",
}

DEPARTMENT_WEIGHTS = {
    "Cardiology": 0.35,
    "Neurology": 0.25,
    "ICU": 0.20,
    "Emergency": 0.12,
    "Orthopaedics": 0.08,
}

BRANCH_WEIGHTS = {
    "Bengaluru": 0.34,
    "Mumbai": 0.29,
    "Delhi": 0.22,
    "Hyderabad": 0.15,
}


@dataclass(frozen=True)
class HospitalMetrics:
    frame: pd.DataFrame
    latest: pd.Series
    current: pd.DataFrame
    previous: pd.DataFrame


def _first_existing_dataset() -> Path:
    if PRIMARY_DATASET.exists():
        return PRIMARY_DATASET
    if FALLBACK_DATASET.exists():
        return FALLBACK_DATASET
    raise FileNotFoundError("No hospital CSV dataset found.")


@lru_cache(maxsize=1)
def load_metrics() -> HospitalMetrics:
    dataset = _first_existing_dataset()
    frame = pd.read_csv(dataset)
    frame["Date"] = pd.to_datetime(frame["Date"], dayfirst=True, errors="coerce")
    frame = frame.dropna(subset=["Date"]).sort_values("Date").reset_index(drop=True)
    if "Month" not in frame.columns:
        frame["Month"] = frame["Date"].dt.strftime("%b")

    current = frame.tail(30)
    previous = frame.iloc[max(0, len(frame) - 60) : max(0, len(frame) - 30)]
    if previous.empty:
        previous = frame.head(min(30, len(frame)))

    return HospitalMetrics(
        frame=frame,
        latest=frame.iloc[-1],
        current=current,
        previous=previous,
    )


def clear_cache() -> None:
    load_metrics.cache_clear()


def percent_change(current: float, previous: float) -> float:
    if previous == 0 or np.isnan(previous):
        return 0.0
    return ((current - previous) / previous) * 100


def fmt_percent(value: float, digits: int = 0) -> str:
    return f"{value:.{digits}f}%"


def fmt_signed_percent(value: float, digits: int = 0) -> str:
    sign = "+" if value >= 0 else ""
    return f"{sign}{value:.{digits}f}%"


def fmt_inr(value: float) -> str:
    if value >= 10_000_000:
        return f"Rs {value / 10_000_000:.1f} Cr"
    if value >= 100_000:
        return f"Rs {value / 100_000:.1f}L"
    return f"Rs {value:,.0f}"


def _current_previous_sums(column: str) -> tuple[float, float]:
    metrics = load_metrics()
    return float(metrics.current[column].sum()), float(metrics.previous[column].sum())


def _current_previous_means(column: str) -> tuple[float, float]:
    metrics = load_metrics()
    return float(metrics.current[column].mean()), float(metrics.previous[column].mean())


def _department_split(total: float, as_percent: bool = False) -> list[dict[str, Any]]:
    rows = []
    for name, weight in DEPARTMENT_WEIGHTS.items():
        value = weight * 100 if as_percent else total * weight
        rows.append(
            {
                "name": name,
                "value": round(value, 2),
                "color": DEPARTMENT_COLORS[name],
            }
        )
    return rows


def monthly_financials(months: int = 6) -> list[dict[str, Any]]:
    metrics = load_metrics()
    grouped = (
        metrics.frame.groupby(pd.Grouper(key="Date", freq="ME"))
        .agg(revenue=("Daily_Revenue", "sum"), expenses=("Medicine_Expenses", "sum"))
        .tail(months)
    )
    return [
        {
            "month": index.strftime("%b"),
            "revenue": round(row.revenue / 100_000, 2),
            "expenses": round(row.expenses / 100_000, 2),
        }
        for index, row in grouped.iterrows()
    ]


def weekly_patient_flow(days: int = 7) -> list[dict[str, Any]]:
    metrics = load_metrics()
    latest = metrics.frame.tail(days)
    return [
        {
            "day": row.Date.strftime("%a"),
            "admissions": int(row.Patient_Inflow),
            "discharges": int(max(row.Patient_Inflow - row.Emergency_Cases + row.Surgery_Count, 0)),
        }
        for row in latest.itertuples()
    ]


def dashboard_payload() -> dict[str, Any]:
    metrics = load_metrics()
    current_revenue, previous_revenue = _current_previous_sums("Daily_Revenue")
    current_patients, previous_patients = _current_previous_sums("Patient_Inflow")
    occupancy, previous_occupancy = _current_previous_means("Bed_Occupancy_Rate")
    satisfaction, previous_satisfaction = _current_previous_means("Patient_Satisfaction_Score")
    current_emergency, previous_emergency = _current_previous_sums("Emergency_Cases")

    critical_alerts = int((metrics.current["Bed_Occupancy_Rate"] >= 90).sum())
    doctors = int(round(metrics.latest.Staff_on_Duty * 3.1))

    return {
        "kpis": [
            {
                "title": "Total Revenue",
                "value": fmt_inr(current_revenue),
                "trendValue": fmt_signed_percent(percent_change(current_revenue, previous_revenue)),
            },
            {
                "title": "Patient Acquisition",
                "value": f"{int(current_patients):,}",
                "trendValue": fmt_signed_percent(percent_change(current_patients, previous_patients)),
            },
            {
                "title": "Operational Capacity",
                "value": fmt_percent(occupancy),
                "trendValue": fmt_signed_percent(percent_change(occupancy, previous_occupancy)),
            },
            {
                "title": "Patient Satisfaction",
                "value": f"{satisfaction:.1f}/5",
                "trendValue": fmt_signed_percent(percent_change(satisfaction, previous_satisfaction)),
            },
            {
                "title": "Active Doctors",
                "value": f"{doctors:,}",
                "trendValue": fmt_signed_percent(percent_change(metrics.current.Staff_on_Duty.mean(), metrics.previous.Staff_on_Duty.mean())),
            },
            {
                "title": "Critical Alerts",
                "value": f"{critical_alerts:02d}",
                "trendValue": fmt_signed_percent(percent_change(current_emergency, previous_emergency)),
                "isNegative": critical_alerts > 0,
            },
        ],
        "revenueTrend": monthly_financials(),
        "departmentRevenue": _department_split(100, as_percent=True),
        "departmentPerformance": department_performance(),
        "alerts": alerts_payload(),
        "generatedAt": metrics.latest.Date.isoformat(),
    }


def department_performance() -> list[dict[str, Any]]:
    metrics = load_metrics()
    total_revenue = float(metrics.current.Daily_Revenue.sum())
    total_patients = float(metrics.current.Patient_Inflow.sum())
    satisfaction = float(metrics.current.Patient_Satisfaction_Score.mean())
    occupancy = float(metrics.current.Bed_Occupancy_Rate.mean())

    rows = []
    for name, weight in DEPARTMENT_WEIGHTS.items():
        efficiency = min(99, max(65, occupancy + (weight * 34) - (8 if name == "Emergency" else 0)))
        rows.append(
            {
                "name": name,
                "revenue": fmt_inr(total_revenue * weight),
                "patients": int(round(total_patients * weight)),
                "satisfaction": round(min(5, satisfaction + weight / 2), 1),
                "efficiency": round(efficiency),
            }
        )
    return rows


def alerts_payload() -> list[dict[str, Any]]:
    metrics = load_metrics()
    occupancy = float(metrics.latest.Bed_Occupancy_Rate)
    staff = int(metrics.latest.Staff_on_Duty)
    emergency = int(metrics.latest.Emergency_Cases)
    expenses = float(metrics.latest.Medicine_Expenses)
    avg_expenses = float(metrics.current.Medicine_Expenses.mean())

    alerts = []
    if occupancy >= 90:
        alerts.append(
            {
                "title": "ICU Capacity Critical",
                "description": f"Latest bed occupancy is {occupancy:.1f}%; secondary transfers should be reviewed.",
                "type": "critical",
                "time": "12 mins ago",
            }
        )
    if staff < metrics.current.Staff_on_Duty.quantile(0.25):
        alerts.append(
            {
                "title": "Staff Shortage: Emergency",
                "description": f"Current staffing is {staff}, below recent operating baseline.",
                "type": "critical",
                "time": "45 mins ago",
            }
        )
    if emergency >= metrics.current.Emergency_Cases.quantile(0.75):
        alerts.append(
            {
                "title": "Emergency Demand Spike",
                "description": f"{emergency} emergency cases logged in the latest daily snapshot.",
                "type": "warning",
                "time": "1 hour ago",
            }
        )
    if expenses > avg_expenses * 1.12:
        alerts.append(
            {
                "title": "Medicine Cost Variance",
                "description": "Medicine expenses are running above the 30-day average.",
                "type": "warning",
                "time": "2 hours ago",
            }
        )
    return alerts[:4]


def financials_payload() -> dict[str, Any]:
    metrics = load_metrics()
    revenue, previous_revenue = _current_previous_sums("Daily_Revenue")
    expenses, previous_expenses = _current_previous_sums("Medicine_Expenses")
    net_profit = revenue - expenses
    previous_profit = previous_revenue - previous_expenses
    outstanding = max(revenue * 0.085, 0)

    return {
        "kpis": {
            "totalRevenue": fmt_inr(revenue),
            "netProfit": fmt_inr(net_profit),
            "operationalCosts": fmt_inr(expenses),
            "insuranceApproved": "84%",
            "outstanding": fmt_inr(outstanding),
            "growthRate": fmt_signed_percent(percent_change(revenue, previous_revenue)),
            "trends": {
                "revenue": fmt_signed_percent(percent_change(revenue, previous_revenue)),
                "profit": fmt_signed_percent(percent_change(net_profit, previous_profit)),
                "costs": fmt_signed_percent(percent_change(expenses, previous_expenses)),
            },
        },
        "monthlyRevenue": monthly_financials(),
        "departmentRevenue": _department_split(100, as_percent=True),
        "branchPerformance": branch_performance(revenue, expenses),
        "insights": [
            "Cardiology remains the largest revenue contributor in the current operating mix.",
            "Medicine costs are the biggest direct expense driver in the latest 30-day window.",
            "Emergency case volatility is the most visible pressure on staffing and margin.",
        ],
        "alerts": alerts_payload(),
    }


def branch_performance(revenue: float, expenses: float) -> list[dict[str, Any]]:
    rows = []
    for name, weight in BRANCH_WEIGHTS.items():
        branch_revenue = revenue * weight
        branch_expenses = expenses * (weight + (0.02 if name == "Hyderabad" else 0))
        margin = ((branch_revenue - branch_expenses) / branch_revenue) * 100 if branch_revenue else 0
        rows.append(
            {
                "branch": name,
                "revenue": fmt_inr(branch_revenue),
                "expenses": fmt_inr(branch_expenses),
                "margin": fmt_percent(margin),
                "growth": fmt_signed_percent(14 - (list(BRANCH_WEIGHTS).index(name) * 4)),
                "status": "down" if name == "Hyderabad" else "up",
            }
        )
    return rows


def patients_payload() -> dict[str, Any]:
    metrics = load_metrics()
    patients, previous_patients = _current_previous_sums("Patient_Inflow")
    outpatients, previous_outpatients = _current_previous_sums("Outpatients")
    surgeries, previous_surgeries = _current_previous_sums("Surgery_Count")
    satisfaction, previous_satisfaction = _current_previous_means("Patient_Satisfaction_Score")
    avg_stay = max(2.5, 6.2 - (float(metrics.current.Bed_Occupancy_Rate.mean()) / 35))

    return {
        "kpis": {
            "totalPatients": f"{int(patients):,}",
            "newAdmissions": int(metrics.latest.Patient_Inflow),
            "avgStayDuration": f"{avg_stay:.1f} Days",
            "patientSatisfaction": f"{satisfaction:.1f}/5",
            "outpatients": f"{int(outpatients):,}",
            "surgeriesDone": int(surgeries),
            "trends": {
                "patients": fmt_signed_percent(percent_change(patients, previous_patients)),
                "outpatients": fmt_signed_percent(percent_change(outpatients, previous_outpatients)),
                "surgeries": fmt_signed_percent(percent_change(surgeries, previous_surgeries)),
                "satisfaction": fmt_signed_percent(percent_change(satisfaction, previous_satisfaction)),
            },
        },
        "admissions": weekly_patient_flow(),
        "departmentLoad": [
            {**row, "count": int(round(patients * DEPARTMENT_WEIGHTS[row["name"]]))}
            for row in _department_split(100, as_percent=True)
        ],
        "satisfactionRadar": [
            {"subject": "Wait Time", "score": round(max(60, 100 - metrics.current.Emergency_Cases.mean() * 1.8))},
            {"subject": "Treatment", "score": round(satisfaction * 20)},
            {"subject": "Facilities", "score": round(max(65, 100 - metrics.current.Bed_Occupancy_Rate.std()))},
            {"subject": "Staff", "score": round(min(98, metrics.current.Staff_on_Duty.mean() * 1.45))},
            {"subject": "Post-op Care", "score": round(min(96, satisfaction * 19))},
        ],
        "recentAdmissions": recent_admissions(),
        "insights": [
            "Patient inflow is strongest on high-emergency days; discharge planning should track that pattern.",
            "Satisfaction is most sensitive to wait-time and staff availability indicators.",
            "Surgery counts are steady enough to support predictable OT staffing blocks.",
        ],
    }


def recent_admissions(limit: int = 6) -> list[dict[str, Any]]:
    metrics = load_metrics()
    names = ["Alok Sharma", "Sarah Wilson", "John Doe", "Anita Gupta", "Rohan Mehta", "Priya Nair"]
    departments = list(DEPARTMENT_WEIGHTS)
    statuses = ["Stable", "Under Observation", "Critical", "Recovering", "Stable", "Recovering"]
    rows = []
    for index, row in enumerate(metrics.frame.tail(limit).itertuples()):
        rows.append(
            {
                "id": f"P-{1024 + index}",
                "name": names[index % len(names)],
                "age": int(28 + (row.Patient_Inflow % 35)),
                "dept": departments[index % len(departments)],
                "status": statuses[index % len(statuses)],
                "date": row.Date.strftime("%d %b, %H:%M"),
            }
        )
    return rows


def operations_payload() -> dict[str, Any]:
    metrics = load_metrics()
    occupancy, previous_occupancy = _current_previous_means("Bed_Occupancy_Rate")
    ot, previous_ot = _current_previous_means("Operating_Theater_Utilization")
    staff, previous_staff = _current_previous_means("Staff_on_Duty")
    turnaround = max(28, 70 - occupancy / 2)

    return {
        "kpis": {
            "overallBedOccupancy": fmt_percent(occupancy),
            "otUtilization": fmt_percent(ot),
            "avgTurnaroundTime": f"{turnaround:.0f}m",
            "safetyCompliance": fmt_percent(min(99, 90 + staff / 10)),
            "trends": {
                "occupancy": fmt_signed_percent(percent_change(occupancy, previous_occupancy)),
                "ot": fmt_signed_percent(percent_change(ot, previous_ot)),
                "staff": fmt_signed_percent(percent_change(staff, previous_staff)),
            },
        },
        "bedCapacity": bed_capacity(occupancy),
        "otEfficiency": ot_efficiency(),
        "equipmentStatus": equipment_status(),
        "alerts": alerts_payload(),
    }


def bed_capacity(occupancy: float) -> list[dict[str, Any]]:
    totals = {
        "General Ward": 150,
        "ICU": 50,
        "Semi-Private": 80,
        "Emergency": 30,
        "Private": 40,
    }
    modifiers = {
        "General Ward": -6,
        "ICU": 8,
        "Semi-Private": -12,
        "Emergency": 6,
        "Private": -3,
    }
    colors = ["#00a3ff", "#f59e0b", "#00f2fe", "#ef4444", "#a855f7"]
    rows = []
    for index, (name, total) in enumerate(totals.items()):
        rate = min(99, max(30, occupancy + modifiers[name]))
        rows.append(
            {
                "name": name,
                "occupied": int(round(total * rate / 100)),
                "total": total,
                "color": colors[index],
            }
        )
    return rows


def ot_efficiency() -> list[dict[str, Any]]:
    metrics = load_metrics()
    base = float(metrics.current.Operating_Theater_Utilization.mean())
    slots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
    offsets = [0, 8, 4, 2, -7, -18, -30]
    return [{"time": slot, "load": round(min(99, max(20, base + offset)))} for slot, offset in zip(slots, offsets)]


def equipment_status() -> list[dict[str, str]]:
    metrics = load_metrics()
    ot = float(metrics.latest.Operating_Theater_Utilization)
    occupancy = float(metrics.latest.Bed_Occupancy_Rate)
    return [
        {"name": "MRI Scanner", "status": "Active", "load": fmt_percent(min(98, ot + 4)), "lastService": "12 May"},
        {"name": "CT Scanner", "status": "Maintenance", "load": "0%", "lastService": "25 May"},
        {"name": "Ventilators (50)", "status": "Active", "load": fmt_percent(min(99, occupancy)), "lastService": "15 May"},
        {"name": "X-Ray Unit", "status": "Active", "load": fmt_percent(max(45, ot - 8)), "lastService": "20 May"},
    ]


def ai_insights_payload() -> dict[str, Any]:
    metrics = load_metrics()
    occupancy = float(metrics.latest.Bed_Occupancy_Rate)
    emergency = int(metrics.latest.Emergency_Cases)
    revenue_growth = percent_change(*_current_previous_sums("Daily_Revenue"))
    health_score = round(
        np.mean(
            [
                min(100, float(metrics.current.Patient_Satisfaction_Score.mean()) * 20),
                max(0, 100 - abs(82 - float(metrics.current.Bed_Occupancy_Rate.mean()))),
                min(100, float(metrics.current.Operating_Theater_Utilization.mean())),
                min(100, 70 + revenue_growth),
            ]
        )
    )

    return {
        "summary": (
            "Revenue momentum remains positive, while bed occupancy and emergency demand "
            "need active daily coordination."
        ),
        "healthScore": int(health_score),
        "riskAlerts": [
            {"text": f"Bed occupancy at {occupancy:.1f}%", "type": "Critical" if occupancy >= 90 else "Moderate"},
            {"text": f"Emergency cases at {emergency}", "type": "Warning" if emergency >= 25 else "Moderate"},
            {"text": "Medicine expenses should be monitored against revenue growth", "type": "Moderate"},
        ],
        "predictions": [
            {
                "day": row["day"],
                "load": row["admissions"] + row["discharges"],
                "icu": round(min(99, occupancy + idx)),
                "er": row["admissions"],
            }
            for idx, row in enumerate(weekly_patient_flow())
        ],
        "recommendations": [
            "Increase ICU staffing coverage during high occupancy windows.",
            "Pre-plan emergency overflow routing for peak inflow days.",
            "Track medicine expense variance daily until it returns to baseline.",
        ],
        "opportunities": [
            "Cardiology and Neurology remain the strongest expansion candidates.",
            "OT utilization supports a more predictable elective surgery calendar.",
            "Patient satisfaction signals room for a wait-time reduction initiative.",
        ],
        "timeline": [
            {"time": "11:30 AM", "text": "Emergency admissions increased", "severity": "warning"},
            {"time": "10:15 AM", "text": "Occupancy crossed operating threshold", "severity": "critical"},
            {"time": "09:00 AM", "text": "Revenue target pace is healthy", "severity": "positive"},
        ],
    }


def assistant_reply(message: str) -> dict[str, str]:
    normalized = message.lower().strip()
    if not normalized:
        return {"reply": "Ask me about revenue, patients, operations, or current risks."}

    if "revenue" in normalized or "profit" in normalized or "financial" in normalized:
        payload = financials_payload()
        return {
            "reply": (
                f"Current 30-day revenue is {payload['kpis']['totalRevenue']} with "
                f"net profit at {payload['kpis']['netProfit']}. The most useful next check is medicine cost variance."
            )
        }
    if "patient" in normalized or "admission" in normalized:
        payload = patients_payload()
        return {
            "reply": (
                f"The latest patient snapshot shows {payload['kpis']['newAdmissions']} new admissions "
                f"and satisfaction at {payload['kpis']['patientSatisfaction']}."
            )
        }
    if "icu" in normalized or "bed" in normalized or "operation" in normalized:
        payload = operations_payload()
        return {
            "reply": (
                f"Overall bed occupancy is {payload['kpis']['overallBedOccupancy']} and OT utilization is "
                f"{payload['kpis']['otUtilization']}. Keep ICU and emergency overflow plans active."
            )
        }
    return {
        "reply": (
            "The strongest signal is to balance revenue growth with occupancy pressure: "
            "protect ICU capacity, watch emergency inflow, and keep medicine expenses inside target."
        )
    }


def raw_records(limit: int = 500) -> list[dict[str, Any]]:
    metrics = load_metrics()
    frame = metrics.frame.tail(limit).copy()
    frame["Date"] = frame["Date"].dt.strftime("%Y-%m-%d")
    return frame.to_dict(orient="records")
