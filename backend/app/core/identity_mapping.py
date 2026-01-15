from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from backend.app.models.legacy_models import KeycloakUserMapping
from datetime import datetime
from typing import Optional, Any

def get_or_create_mapping(db: Session, keycloak_sub: str, legacy_uid: Optional[int] = None) -> KeycloakUserMapping:
    mapping = db.query(KeycloakUserMapping).filter_by(keycloak_sub=keycloak_sub).first()
    if mapping:
        return mapping
    mapping = KeycloakUserMapping(keycloak_sub=keycloak_sub, legacy_uid=legacy_uid, created_at=datetime.utcnow())
    db.add(mapping)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        mapping = db.query(KeycloakUserMapping).filter_by(keycloak_sub=keycloak_sub).first()
    return mapping

def resolve_legacy_uid_from_token(db: Session, token_payload: dict) -> Optional[int]:
    sub = token_payload.get('sub')
    if not sub:
        return None
    mapping = db.query(KeycloakUserMapping).filter_by(keycloak_sub=sub).first()
    if mapping:
        return mapping.legacy_uid
    return None
