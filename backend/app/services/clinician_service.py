from sqlalchemy.orm import Session
from typing import Optional, Dict
from app.models.legacy_models import ClinicianPermission, ClinicianGroupConsent, KeycloakUserMapping
from app.core.identity_mapping import get_or_create_mapping
from datetime import datetime

def get_clinician_permissions(db: Session, keycloak_sub: str, group_nid: int) -> Optional[ClinicianPermission]:
    mapping = db.query(KeycloakUserMapping).filter_by(keycloak_sub=keycloak_sub).first()
    if not mapping or mapping.legacy_uid is None:
        return None
    return db.query(ClinicianPermission).filter_by(clinician_drupal_uid=mapping.legacy_uid, group_nid=group_nid).first()

def set_clinician_privileged_access(db: Session, keycloak_sub: str, group_nid: int, enabled: bool) -> bool:
    mapping = db.query(KeycloakUserMapping).filter_by(keycloak_sub=keycloak_sub).first()
    if not mapping or mapping.legacy_uid is None:
        return False
    perm = db.query(ClinicianPermission).filter_by(clinician_drupal_uid=mapping.legacy_uid, group_nid=group_nid).first()
    if not perm:
        return False
    perm.priviledged_access = 1 if enabled else 0
    db.commit()
    return True

def record_clinician_group_consent(db: Session, keycloak_sub: str, group_nid: int, consent_flags: Dict[str, bool]) -> bool:
    mapping = db.query(KeycloakUserMapping).filter_by(keycloak_sub=keycloak_sub).first()
    if not mapping or mapping.legacy_uid is None:
        return False
    consent = ClinicianGroupConsent(
        uid=mapping.legacy_uid,
        group_nid=group_nid,
        timestamp=int(datetime.utcnow().timestamp()),
        consent1=consent_flags.get('consent1', False),
        consent2=consent_flags.get('consent2', False),
        consent3=consent_flags.get('consent3', False),
        consent4=consent_flags.get('consent4', False),
        consent5=consent_flags.get('consent5', False),
        consent6=consent_flags.get('consent6', False),
        consent7=consent_flags.get('consent7', False),
    )
    db.add(consent)
    db.commit()
    return True
