from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.core.database import SessionLocal
from app.core.audit_logger import log_event
from app.core.security import verify_token
from sqlalchemy.orm import Session

class AuditMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        db: Session = SessionLocal()
        ip = request.headers.get("x-forwarded-for") or request.client.host
        user_agent = request.headers.get("user-agent")
        token = None
        user_id = None
        user_email = None
        roles = []
        if "authorization" in request.headers:
            auth_header = request.headers["authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1]
                # Only try to verify if token looks like a JWT (3 segments)
                if token.count('.') == 2:
                    try:
                        payload = verify_token(token)
                        user_id = payload.get("sub")
                        user_email = payload.get("email")
                        roles = payload.get("realm_access", {}).get("roles", [])
                    except Exception:
                        pass
        details = {
            "path": request.url.path,
            "method": request.method,
            "roles": roles,
        }
        await log_event(
            db,
            user_id=user_id,
            event_type="API_ACCESS",
            ip=ip,
            details=details,
            user_email=user_email,
            user_agent=user_agent,
        )
        response = await call_next(request)
        db.close()
        return response
