from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import employee, insights

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="API for Salary Management Platform",
    version="1.0.0"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employee.router, prefix="/api/v1")
app.include_router(insights.router, prefix="/api/v1")
app.include_router(insights.ref_router, prefix="/api/v1")

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}

@app.get("/", tags=["system"])
def root():
    return {
        "app": settings.APP_NAME,
        "docs_url": "/docs",
        "health_url": "/health"
    }
