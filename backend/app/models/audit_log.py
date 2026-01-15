import uuid
from sqlalchemy import Column, String, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class EventType(enum.Enum):
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    API_ACCESS = "API_ACCESS"
    USER_UPDATE = "USER_UPDATE"

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    user_id = Column(String, nullable=True)
    user_email = Column(String, nullable=True)
    event_type = Column(Enum(EventType), nullable=False)
    resource_type = Column(String, nullable=True)
    resource_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=False)
    user_agent = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
