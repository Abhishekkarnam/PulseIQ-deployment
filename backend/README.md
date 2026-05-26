# PulseIQ Backend

FastAPI service for the existing PulseIQ React frontend. It reads the hospital CSV dataset in the project root and exposes dashboard-ready analytics without requiring frontend changes.

## Run

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

API docs are available at `http://127.0.0.1:8000/docs`.

## Main Endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/financials`
- `GET /api/patients`
- `GET /api/operations`
- `GET /api/ai-insights`
- `POST /api/assistant/chat`
- `GET /api/export/{section}`
