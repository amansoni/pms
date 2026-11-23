import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import Depends

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://dbuser:securepass123@postgres:5432/mental_health_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_audit_entries(limit=10, offset=0):
    from app.models.audit_log import AuditLog
    db = SessionLocal()
    try:
        return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()
    finally:
        db.close()
