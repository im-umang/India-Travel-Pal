"""
India Travel Pal — Production FastAPI Application
Features: MongoDB, JWT Auth, Rate Limiting, CORS, Error Handling
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import connect_database, disconnect_database
from app.middleware.error_handler import (
    global_exception_handler,
    validation_exception_handler,
)

# Routes
from app.routes.auth_routes import router as auth_router
from app.routes.chat_routes import router as chat_router
from app.routes.trip_routes import router as trip_router
from app.routes.admin_routes import router as admin_router


# ── Rate limiter ──
limiter = Limiter(key_func=get_remote_address)


# ── Lifespan (startup / shutdown) ──
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 India Travel Pal — Starting up...")
    await connect_database()

    # Seed knowledge base into MongoDB collections (idempotent)
    try:
        from app.database import get_db
        from app.services.knowledge_service import seed_database
        db = get_db()
        if db is not None:
            await seed_database(db)
            print("✅ Knowledge base seeded into MongoDB")
        else:
            print("⚠️  DB not connected — skipping seed")
    except Exception as e:
        print(f"⚠️  KB seed error (non-fatal): {e}")

    yield
    # Shutdown
    await disconnect_database()
    print("👋 Server shutting down...")


# ── Create app ──
app = FastAPI(
    title="India Travel Pal — AI Backend",
    description=(
        "AI-Based Real-Time Voice Enabled Travel Planning Chatbot SaaS. "
        "ML-powered intent classification, NLP entity extraction, "
        "MongoDB persistence, JWT authentication, and admin panel."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Store debug flag
app.debug = settings.DEBUG

# ── Rate limiter ──
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── Error handlers ──
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# ── CORS — Must be registered BEFORE other http middleware ──
# (FastAPI applies middleware in reverse registration order,
#  so registering CORS first makes it the outermost wrapper.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Security headers middleware ──
# Registered AFTER CORS so it runs inside the CORS layer.
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Skip preflight requests — CORS middleware handles them
    if request.method == "OPTIONS":
        return await call_next(request)
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# ── Register routers ──
# Production Routes (v1)
from app.api.v1 import auth as auth_v1
from app.api.v1 import chat as chat_v1

# Use v1 as the primary prefix for all logic
app.include_router(auth_v1.router, prefix="/api/v1/auth", tags=["Auth v1"])
app.include_router(chat_v1.router, prefix="/api/v1/chat", tags=["Chat v1"])
app.include_router(trip_router, prefix="/api/v1", tags=["Trips v1"])
app.include_router(admin_router, prefix="/api/v1", tags=["Admin v1"])

# Maintain backward compatibility for existing /api calls if necessary, 
# but point them to the same logic.
app.include_router(auth_router, prefix="/api", tags=["Legacy Auth"])
app.include_router(chat_router, prefix="/api", tags=["Legacy Chat"])
app.include_router(trip_router, prefix="/api", tags=["Legacy Trips"])
app.include_router(admin_router, prefix="/api", tags=["Legacy Admin"])


# ── Health & root ──
@app.get("/")
async def root():
    return {
        "message": "🙏 Namaste! India Travel Pal AI Backend v2.0",
        "docs": "/docs",
        "health": "/api/health",
        "version": "2.0.0",
    }


@app.get("/api/health")
async def health():
    from app.database import get_db
    db = get_db()
    return {
        "status": "healthy",
        "service": "India Travel Pal",
        "version": "2.0.0",
        "database": "connected" if db is not None else "disconnected (fallback mode)",
    }
