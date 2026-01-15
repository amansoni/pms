import requests
from jose import jwt, JWTError
from fastapi import HTTPException
from app.core.config import settings

def get_jwks():
    url = f"{settings.KEYCLOAK_URL}/realms/{settings.KEYCLOAK_REALM}/protocol/openid-connect/certs"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()["keys"]

def verify_token(token: str):
    jwks = get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    key = next((k for k in jwks if k["kid"] == unverified_header["kid"]), None)
    if not key:
        raise HTTPException(status_code=401, detail="Invalid token header")
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=[key["alg"]],
            options={"verify_aud": False}
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_user_groups_from_token(token: dict):
    return token.get("groups", [])

def get_user_primary_group(token: dict) -> str:
    groups = get_user_groups_from_token(token)
    return groups[0] if groups else None
