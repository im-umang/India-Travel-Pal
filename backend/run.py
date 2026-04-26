"""
India Travel Pal — Backend Server Launcher
Run with: python run.py
"""

import uvicorn
import sys
import io

# Force UTF-8 encoding for stdout/stderr to prevent Windows console crashes
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from app.config import settings

if __name__ == "__main__":
    print("=" * 55)
    print("  India Travel Pal - AI Backend v2.0")
    print("=" * 55)
    print(f"  API Docs:    http://localhost:{settings.PORT}/docs")
    print(f"  Health:      http://localhost:{settings.PORT}/api/health")
    print(f"  Chat API:    POST http://localhost:{settings.PORT}/api/chat")
    print(f"  Auth:        POST http://localhost:{settings.PORT}/api/auth/login")
    print(f"  Admin:       http://localhost:{settings.PORT}/api/admin/stats")
    print(f"  Database:    {settings.MONGODB_URI}")
    print("=" * 55)
    print()

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
