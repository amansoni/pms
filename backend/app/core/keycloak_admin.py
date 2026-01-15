import requests
import os
from typing import List, Dict

# Make sure these match your Keycloak setup:
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://keycloak:8080")
REALM = os.getenv("KEYCLOAK_REALM", "mental-health-realm")
CLIENT_ID = os.getenv("CLIENT_ID", "admin-cli")
CLIENT_SECRET = os.getenv("CLIENT_SECRET", "puzPUwNz0JfgSSFwJJ7Y7ACNNOVYn4pv")

def get_admin_token():
    # Use client credentials grant if CLIENT_SECRET is set, else fallback to password grant
    if CLIENT_SECRET:
        data = {
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        }
    else:
        ADMIN_USER = os.getenv("KEYCLOAK_ADMIN", "admin")
        ADMIN_PASS = os.getenv("KEYCLOAK_ADMIN_PASSWORD", "admin123")
        data = {
            "grant_type": "password",
            "client_id": CLIENT_ID,
            "username": ADMIN_USER,
            "password": ADMIN_PASS,
        }
    resp = requests.post(
        f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if resp.status_code == 400 and "user_not_found" in resp.text:
        raise Exception(
            f"Keycloak admin authentication failed: user_not_found. "
            f"Check that the admin user exists in the correct realm and credentials are correct."
        )
    if resp.status_code == 400:
        raise Exception(
            f"Keycloak admin authentication failed (400 Bad Request). "
            f"Check that the admin-cli client exists, and that credentials are correct. "
            f"Also ensure the request uses application/x-www-form-urlencoded encoding."
        )
    if resp.status_code == 401:
        raise Exception(
            f"Keycloak admin authentication failed (401 Unauthorized). "
            f"Check that credentials are correct and Keycloak is running. "
            f"URL tried: {KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/token"
        )
    resp.raise_for_status()
    return resp.json()["access_token"]

def get_user_groups(user_id: str) -> List[Dict]:
    token = get_admin_token()
    resp = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}/groups",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()
    return resp.json()

def get_group_attributes(group_id: str) -> Dict:
    token = get_admin_token()
    resp = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/groups/{group_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()
    return resp.json().get("attributes", {})

def update_group_attributes(group_id: str, attributes: Dict):
    token = get_admin_token()
    resp = requests.put(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/groups/{group_id}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"attributes": attributes}
    )
    resp.raise_for_status()

def add_user_to_group(user_id: str, group_id: str):
    token = get_admin_token()
    resp = requests.put(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}/groups/{group_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()

def remove_user_from_group(user_id: str, group_id: str):
    token = get_admin_token()
    resp = requests.delete(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}/groups/{group_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()

def list_users(page=1, limit=10):
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users",
        headers=headers,
        params={"first": (page-1)*limit, "max": limit}
    )
    if resp.status_code == 403:
        raise Exception(
            "Keycloak admin API returned 403 Forbidden. "
            "The admin-cli client or service account does not have sufficient permissions. "
            "Make sure the admin-cli client has 'realm-admin' role assigned to its service account in the realm, "
            "or that your admin user has the correct roles."
        )
    resp.raise_for_status()
    return resp.json()

def get_user(user_id: str):
    token = get_admin_token()
    resp = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()
    return resp.json()

def create_user(data: dict):
    token = get_admin_token()
    resp = requests.post(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=data
    )
    resp.raise_for_status()
    # Get created user (location header)
    location = resp.headers.get("Location")
    if location:
        user_id = location.rstrip("/").split("/")[-1]
        return get_user(user_id)
    return {"success": True}

def update_user(user_id: str, data: dict):
    token = get_admin_token()
    resp = requests.put(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json=data
    )
    resp.raise_for_status()
    return get_user(user_id)

def delete_user(user_id: str):
    token = get_admin_token()
    resp = requests.delete(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    resp.raise_for_status()
    return {"success": True}

def search_users(q: str):
    token = get_admin_token()
    resp = requests.get(
        f"{KEYCLOAK_URL}/admin/realms/{REALM}/users",
        headers={"Authorization": f"Bearer {token}"},
        params={"search": q}
    )
    resp.raise_for_status()
    return resp.json()
