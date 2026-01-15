from fastapi import APIRouter, Depends, HTTPException, Query, Body
from app.api.dependencies import get_current_user
from app.core.keycloak_admin import (
    list_users, get_user, create_user, update_user, delete_user, search_users
)

router = APIRouter()

@router.get("/api/users/me")
def read_users_me(user: dict = Depends(get_current_user)):
    return {
        "email": user["email"],
        "sub": user["sub"],
        "roles": user["roles"]
    }

# --- ADMIN USER MANAGEMENT ---

@router.get("/api/admin/users")
def admin_list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    user: dict = Depends(get_current_user)
):
    if "admin" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Admin role required")
    return list_users(page=page, limit=limit)

@router.get("/api/admin/users/{user_id}")
def admin_get_user(user_id: str, user: dict = Depends(get_current_user)):
    if "admin" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Admin role required")
    return get_user(user_id)

@router.post("/api/admin/users")
def admin_create_user(data: dict = Body(...), user: dict = Depends(get_current_user)):
    if "admin" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Admin role required")
    return create_user(data)

@router.patch("/api/admin/users/{user_id}")
def admin_update_user(user_id: str, data: dict = Body(...), user: dict = Depends(get_current_user)):
    if "admin" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Admin role required")
    return update_user(user_id, data)

@router.delete("/api/admin/users/{user_id}")
def admin_delete_user(user_id: str, user: dict = Depends(get_current_user)):
    if "admin" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Admin role required")
    return delete_user(user_id)

@router.get("/api/admin/users/search")
def admin_search_users(q: str = Query(...), user: dict = Depends(get_current_user)):
    if "admin" not in user["roles"]:
        raise HTTPException(status_code=403, detail="Admin role required")
    return search_users(q)
