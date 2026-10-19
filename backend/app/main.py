"""
main.py — FastAPI application factory.

Single-host architecture:
  - All /api/* routes are handled by FastAPI.
  - /assets/* and other static files are served directly from the Vite build.
  - Every other path returns index.html so React Router handles client-side routing.
  - Frontend and backend share the same origin (http://localhost:8000), so
    the browser never issues a CORS preflight for production traffic.

Dev workflow (optional):
  If you prefer Vite's hot-module replacement during development you can still
  run `npm run dev` (port 5173) alongside Uvicorn (port 8000). Vite's proxy
  (configured in vite.config.ts) forwards /api/* calls to FastAPI — same-origin
  from the browser's point of view, so the CORS middleware entry below covers it.
"""

import logging
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.DEBUG if settings.debug else logging.INFO)
logger = logging.getLogger(__name__)

# ── App instance ──────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS middleware ───────────────────────────────────────────────────────────
# Only needed when the Vite dev server (port 5173) is running separately.
# In single-host production mode (FastAPI serves the built frontend) the browser
# sees one origin — no preflight is ever sent and these headers are ignored.
_cors_origins = settings.allowed_origins_list
logger.info("CORS allowed origins: %s", _cors_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handler ──────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all for any unhandled exception.
    Logs the full traceback server-side; returns a generic safe JSON body
    so clients always receive structured JSON, never an HTML 500 page.
    """
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )

# ── API routes ────────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Health-check endpoint.
    Returns app name, version, and status. Used by load-balancers and the
    frontend to confirm the service is reachable before routing real traffic.
    """
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
    }

# ── Static frontend (single-host) ─────────────────────────────────────────────
# Mount the Vite build output so FastAPI serves the React app.
# This block runs only when the build directory exists — if it doesn't (e.g.
# you haven't run `npm run build` yet) the server still starts cleanly for API
# development and logs a clear warning instead of crashing.

_dist: Path = settings.frontend_build_path

if _dist.exists() and _dist.is_dir():
    logger.info("Serving frontend from: %s", _dist)

    # Mount /assets — Vite places all hashed JS/CSS bundles here.
    _assets = _dist / "assets"
    if _assets.exists():
        app.mount("/assets", StaticFiles(directory=_assets), name="static-assets")

    # SPA catch-all — must be registered AFTER all /api/* routes.
    # Any request that reaches here gets index.html so React Router can handle it.
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str) -> FileResponse:
        # If the path matches a real file inside dist/ (e.g. /vite.svg), serve it.
        candidate = _dist / full_path
        if candidate.is_file():
            return FileResponse(candidate)
        # Otherwise hand control to React Router via index.html.
        return FileResponse(_dist / "index.html")

else:
    logger.warning(
        "Frontend build directory not found at '%s'. "
        "Run `npm run build` inside frontend/ to enable single-host mode. "
        "API endpoints (/api/*) are still available.",
        _dist,
    )
