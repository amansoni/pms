from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import users
from app.api.routes import audit
from app.api.routes import groups
from app.api.routes import legacy
from app.api.middleware.audit import AuditMiddleware
from app.core.database import engine
from app.models.audit_log import Base as AuditBase

app = FastAPI()

# CORS: Only set allow_origins to trusted origins, do not use unpacking
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost",
        "http://localhost:5173",
        "http://backend:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.on_event("startup")
def on_startup():
    AuditBase.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(audit.router)
app.include_router(groups.router)
app.include_router(legacy.router, prefix="/api")
app.add_middleware(AuditMiddleware)
