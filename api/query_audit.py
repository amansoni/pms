from app.core.database import get_audit_entries

entries = get_audit_entries(limit=10)
for entry in entries:
    print({
        "id": str(entry.id),
        "timestamp": entry.timestamp.isoformat(),
        "user_id": entry.user_id,
        "user_email": entry.user_email,
        "event_type": entry.event_type.value,
        "resource_type": entry.resource_type,
        "resource_id": entry.resource_id,
        "ip_address": entry.ip_address,
        "user_agent": entry.user_agent,
        "details": entry.details,
    })
