"""
config.py — Application settings loaded from environment variables.

Pydantic Settings reads values from the `.env` file (or real env vars).
Every configurable value lives here — nothing is hard-coded in app code.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Server ────────────────────────────────────────────────────────────────
    app_name: str = "NEXORA AI — Skin Health Analyzer"
    app_version: str = "0.1.0"
    debug: bool = False

    # ── Static frontend ───────────────────────────────────────────────────────
    # Absolute or relative (to working directory) path to the Vite build output.
    # FastAPI will serve these files as the frontend on the same host/port.
    # Default assumes Uvicorn is launched from the backend/ directory.
    frontend_build_dir: str = "../frontend/dist"

    # ── CORS (development only) ───────────────────────────────────────────────
    # In single-host mode the browser sees everything as same-origin, so CORS
    # headers are NOT required. This value is kept so the local dev workflow
    # (Vite :5173 + FastAPI :8000 with Vite proxy) continues to work unchanged.
    allowed_origins: str = "http://localhost:5173"

    # ── Pydantic Settings config ───────────────────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        """Split the comma-separated string into a list FastAPI CORS middleware accepts."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def frontend_build_path(self) -> Path:
        """Resolve frontend_build_dir to an absolute Path object."""
        return Path(self.frontend_build_dir).resolve()


# Single shared instance — import this everywhere instead of re-instantiating.
settings = Settings()
