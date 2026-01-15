from fastapi import APIRouter, Depends, HTTPException, Query, Request
from app.core.keycloak_admin import (
    get_user_groups, get_group_attributes, update_group_attributes,
    add_user_to_group, remove_user_from_group
)
from app.core.database import get_db
from app.models.group_settings import GroupSettings
from app.api.dependencies import get_current_user, require_group_admin
from sqlalchemy.orm import Session
import requests

router = APIRouter()

@router.get("/api/groups")
def list_groups(user: dict = Depends(get_current_user)):
    return get_user_groups(user["sub"])

@router.get("/api/groups/{group_id}")
def group_details(group_id: str, db: Session = Depends(get_db)):
    attrs = get_group_attributes(group_id)
    settings = db.query(GroupSettings).filter_by(keycloak_group_id=group_id).first()
    return {"attributes": attrs, "custom_settings": settings.custom_settings if settings else {}}

@router.get("/api/groups/{group_id}/members")
def group_members(group_id: str, user: dict = Depends(get_current_user)):
    if not user:
        # Log and raise explicit error for debugging
        import logging
        logging.warning("Unauthorized access attempt to group members endpoint.")
        raise HTTPException(status_code=401, detail="Not authenticated")
    # Keycloak API: /groups/{group_id}/members
    from app.core.keycloak_admin import get_admin_token, KEYCLOAK_URL, REALM
    token = get_admin_token()
    resp = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/groups/{group_id}/members",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()
    return resp.json()

@router.patch("/api/groups/{group_id}/settings")
def patch_group_settings(group_id: str, settings: dict, db: Session = Depends(get_db), user: dict = Depends(require_group_admin)):
    gs = db.query(GroupSettings).filter_by(keycloak_group_id=group_id).first()
    if not gs:
        gs = GroupSettings(keycloak_group_id=group_id, custom_settings=settings)
        db.add(gs)
    else:
        gs.custom_settings = settings
    db.commit()
    # log audit event here
    return {"success": True}

@router.post("/api/groups/{group_id}/members")
def add_member(group_id: str, user_id: str, user: dict = Depends(require_group_admin)):
    add_user_to_group(user_id, group_id)
    # log audit event here
    return {"success": True}

@router.delete("/api/groups/{group_id}/members/{user_id}")
def remove_member(group_id: str, user_id: str, user: dict = Depends(require_group_admin)):
    remove_user_from_group(user_id, group_id)
    # log audit event here
    return {"success": True}
