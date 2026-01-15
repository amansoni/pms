from app.models.audit_log import AuditLog, EventType
from sqlalchemy.orm import Session

GROUP_EVENTS = [
    "GROUP_SETTINGS_UPDATED",
    "GROUP_MEMBER_ADDED",
    "GROUP_MEMBER_REMOVED"
]

async def log_event(
    db: Session,
    user_id: str,
    event_type: str,
    ip: str,
    details: dict,
    user_email: str = None,
    resource_type: str = None,
    resource_id: str = None,
    user_agent: str = None,
):
    entry = AuditLog(
        user_id=user_id,
        user_email=user_email,
        event_type=EventType(event_type),
        resource_type=resource_type,
        resource_id=resource_id,
        ip_address=ip,
        user_agent=user_agent,
        details=details,
    )
    db.add(entry)
    db.commit()
