from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.core.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    # Extract user info
    return {
        "email": payload.get("email"),
        "sub": payload.get("sub"),
        "roles": payload.get("realm_access", {}).get("roles", [])
    }

def require_group_admin(group_id: str):
    def dependency(user: dict = Depends(get_current_user)):
        roles = user.get("roles", [])
        groups = user.get("groups", [])
        if "admin" in roles or "group-admin" in roles or group_id in groups:
            return user
        raise HTTPException(status_code=403, detail="Group admin required")
    return Depends(dependency)
