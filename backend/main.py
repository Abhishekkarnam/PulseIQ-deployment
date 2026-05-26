from __future__ import annotations

from io import StringIO
from typing import Literal

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .data_service import (
    ai_insights_payload,
    assistant_reply,
    dashboard_payload,
    financials_payload,
    load_metrics,
    operations_payload,
    patients_payload,
    raw_records,
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)


app = FastAPI(
    title="PulseIQ Hospital Analytics API",
    description="Backend API for the PulseIQ hospital intelligence dashboard.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, object]:
    metrics = load_metrics()
    return {
        "status": "ok",
        "rows": len(metrics.frame),
        "latestDate": metrics.latest.Date.isoformat(),
    }


@app.get("/api/dashboard")
def dashboard() -> dict[str, object]:
    return dashboard_payload()


@app.get("/api/financials")
def financials() -> dict[str, object]:
    return financials_payload()


@app.get("/api/patients")
def patients() -> dict[str, object]:
    return patients_payload()


@app.get("/api/operations")
def operations() -> dict[str, object]:
    return operations_payload()


@app.get("/api/ai-insights")
def ai_insights() -> dict[str, object]:
    return ai_insights_payload()


@app.post("/api/assistant/chat")
def chat(request: ChatRequest) -> dict[str, str]:
    return assistant_reply(request.message)


@app.get("/api/data")
def data(limit: int = 500) -> dict[str, object]:
    if limit < 1 or limit > 5000:
        raise HTTPException(status_code=400, detail="limit must be between 1 and 5000")
    return {"records": raw_records(limit)}


@app.get("/api/export/{section}")
def export_csv(section: Literal["dashboard", "financials", "patients", "operations", "ai-insights", "raw"]):
    if section == "raw":
        frame = pd.DataFrame(raw_records(5000))
    else:
        payloads = {
            "dashboard": dashboard_payload,
            "financials": financials_payload,
            "patients": patients_payload,
            "operations": operations_payload,
            "ai-insights": ai_insights_payload,
        }
        frame = pd.json_normalize(payloads[section](), sep=".")

    buffer = StringIO()
    frame.to_csv(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="pulseiq-{section}.csv"'},
    )
