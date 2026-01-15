from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base

class GroupSettings(Base):
    __tablename__ = "group_settings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    keycloak_group_id = Column(String, unique=True, nullable=False)
    custom_settings = Column(JSONB, nullable=True)
