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
from typing import Optional
from uuid import uuid4

from fastapi import FastAPI, File, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.config import settings
from app.services.ollama_service import analyze_skin_image_with_medgemma, check_ollama_health

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
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handler ──────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all for exceptions. Preserves explicit HTTPException status codes and details;
    logs full traceback and returns structured JSON for unhandled server errors.
    """
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "status": "error",
                "message": str(exc.detail),
                "detail": str(exc.detail),
            },
        )
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
    Returns app name, version, and Ollama connection status.
    """
    ollama_info = await check_ollama_health()
    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
        "ollama": ollama_info,
    }


@app.get("/api/model/status", tags=["AI Model"])
async def model_status():
    """
    Returns the status of the local Ollama LLM service and MedGemma model.
    """
    return await check_ollama_health()


@app.post("/api/analyze", tags=["Analysis"])
async def analyze_image(image: UploadFile = File(...)):
    """
    Analyzes an uploaded skin image using the local MedGemma 27B model via Ollama.
    Returns structured analysis results matching the NEXORA AI frontend contract.
    """
    if not image or not image.filename:
        raise HTTPException(
            status_code=400,
            detail="No image file provided. Please upload a valid skin image.",
        )

    # Read image bytes
    contents = await image.read()
    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty. Please select a valid photo.",
        )

    result = await analyze_skin_image_with_medgemma(
        image_bytes=contents,
        filename=image.filename,
        declared_content_type=image.content_type,
    )
    if isinstance(result, dict) and "result" in result:
        _SCANS_DB.insert(0, result["result"])
    return result


# ── Authentication endpoints ──────────────────────────────────────────────────

class LoginPayload(BaseModel):
    email_or_username: str
    password: str


class RegisterPayload(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str
    confirm_password: Optional[str] = None


# Seed default demo account
_DEMO_USER = {
    "id": "usr_demo",
    "username": "demo",
    "email": "demo@nexora.ai",
    "first_name": "Demo",
    "last_name": "User",
    "created_at": "2026-01-01T00:00:00Z",
}
_DEMO_PASS = "password123"

_USERS_DB = {
    "demo@nexora.ai": (_DEMO_USER, _DEMO_PASS),
    "demo": (_DEMO_USER, _DEMO_PASS),
}
_TOKENS_DB = {
    "nexora_token_usr_demo": _DEMO_USER,
}


@app.post("/api/auth/login", tags=["Auth"])
async def auth_login(payload: LoginPayload):
    """
    Authenticate user with email or username and password.
    """
    key = payload.email_or_username.strip().lower()
    user_entry = _USERS_DB.get(key)
    if not user_entry or user_entry[1] != payload.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email/username or password. Please try again.",
        )

    user_info = user_entry[0]
    token = f"nexora_token_{user_info['id']}"
    _TOKENS_DB[token] = user_info

    return {
        "user": user_info,
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful",
    }


@app.post("/api/auth/register", tags=["Auth"])
async def auth_register(payload: RegisterPayload):
    """
    Register a new user account and return an authentication token.
    """
    email_key = payload.email.strip().lower()
    user_key = payload.username.strip().lower()

    if email_key in _USERS_DB or user_key in _USERS_DB:
        raise HTTPException(
            status_code=400,
            detail="An account with this email or username already exists.",
        )

    user_id = f"usr_{uuid4().hex[:8]}"
    new_user = {
        "id": user_id,
        "username": payload.username.strip(),
        "email": payload.email.strip(),
        "first_name": payload.first_name.strip(),
        "last_name": payload.last_name.strip(),
        "created_at": "2026-11-04T00:00:00Z",
    }

    _USERS_DB[email_key] = (new_user, payload.password)
    _USERS_DB[user_key] = (new_user, payload.password)
    token = f"nexora_token_{user_id}"
    _TOKENS_DB[token] = new_user

    return {
        "user": new_user,
        "access_token": token,
        "token_type": "bearer",
        "message": "Account created successfully",
    }


@app.get("/api/auth/me", tags=["Auth"])
async def auth_me(authorization: Optional[str] = Header(None)):
    """
    Returns the currently authenticated user based on the Bearer token.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        if token in _TOKENS_DB:
            return _TOKENS_DB[token]

    # Default fallback for demo session
    return _DEMO_USER


@app.post("/api/auth/logout", tags=["Auth"])
async def auth_logout():
    """
    Logout active session.
    """
    return {"message": "Logged out successfully"}


@app.get("/api/profile", tags=["Profile"])
async def get_profile(authorization: Optional[str] = Header(None)):
    """
    Returns current user profile.
    """
    return await auth_me(authorization)


class ProfileUpdatePayload(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None


@app.put("/api/profile", tags=["Profile"])
async def update_profile(
    payload: ProfileUpdatePayload,
    authorization: Optional[str] = Header(None),
):
    """
    Updates the authenticated user's profile details.
    """
    user = await auth_me(authorization)
    if payload.first_name:
        user["first_name"] = payload.first_name.strip()
    if payload.last_name:
        user["last_name"] = payload.last_name.strip()
    if payload.username:
        user["username"] = payload.username.strip()
    if payload.email:
        user["email"] = payload.email.strip()
    return user


@app.post("/api/profile/image", tags=["Profile"])
async def update_profile_image(
    profile_image: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
):
    """
    Updates profile image with base64 data.
    """
    user = await auth_me(authorization)
    data = await profile_image.read()
    if data:
        import base64

        b64 = base64.b64encode(data).decode("utf-8")
        mime = profile_image.content_type or "image/jpeg"
        user["profile_image"] = f"data:{mime};base64,{b64}"
    return user


# ── History & Dashboard storage & routes ───────────────────────────────────────

_SCANS_DB: list[dict] = []


@app.get("/api/history", tags=["History"])
async def get_history(page: int = 1, per_page: int = 10):
    """
    Returns paginated scan history.
    """
    start = (page - 1) * per_page
    end = start + per_page
    items = _SCANS_DB[start:end]
    return {
        "items": items,
        "total": len(_SCANS_DB),
        "page": page,
        "per_page": per_page,
        "has_next": end < len(_SCANS_DB),
    }


@app.get("/api/history/{scan_id}", tags=["History"])
async def get_history_detail(scan_id: str):
    """
    Returns specific historical scan report by ID.
    """
    for scan in _SCANS_DB:
        if str(scan.get("id")) == scan_id:
            return scan
    raise HTTPException(status_code=404, detail="Scan record not found.")


@app.delete("/api/history/{scan_id}", tags=["History"])
async def delete_history_item(scan_id: str):
    """
    Deletes a historical scan record.
    """
    global _SCANS_DB
    _SCANS_DB = [s for s in _SCANS_DB if str(s.get("id")) != scan_id]
    return {"message": "Analysis deleted successfully."}


@app.get("/api/dashboard/stats", tags=["Dashboard"])
async def get_dashboard_stats():
    """
    Returns user aggregate statistics for dashboard metrics.
    """
    latest = _SCANS_DB[0] if _SCANS_DB else None
    return {
        "total_analyses": len(_SCANS_DB),
        "recent_analyses": _SCANS_DB[:5],
        "latest_prediction": latest.get("predicted_condition") if latest else None,
        "latest_confidence": latest.get("confidence") if latest else None,
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
