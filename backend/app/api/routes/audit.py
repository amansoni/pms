from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit_log import AuditLog
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/api/audit-logs")
def get_audit_logs(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user_id: str = None,
    event_type: str = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    if "admin" not in user.get("roles", []):
        raise HTTPException(status_code=403, detail="Admin role required")
    query = db.query(AuditLog)
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    if event_type:
        query = query.filter(AuditLog.event_type == event_type)
    logs = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()
    return [dict(
        id=str(log.id),
        timestamp=log.timestamp.isoformat(),
        user_id=log.user_id,
        user_email=log.user_email,
        event_type=log.event_type.value,
        resource_type=log.resource_type,
        resource_id=log.resource_id,
        ip_address=log.ip_address,
        user_agent=log.user_agent,
        details=log.details,
    ) for log in logs]
