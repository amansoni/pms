from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict
from app.services.clinician_service import (
    get_clinician_permissions,
    set_clinician_privileged_access,
    record_clinician_group_consent
)
from app.core.identity_mapping import resolve_legacy_uid_from_token
from app.models.legacy_models import LaunchLog, TrustConfig, ClinicianPermission, LaunchPatient
from app.core.database import get_db
from app.api.dependencies import get_current_user, require_role
import json
from datetime import datetime

router = APIRouter()

@router.get("/clinician/permissions")
def clinician_permissions(group_nid: int = Query(...), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    perm = get_clinician_permissions(db, current_user['sub'], group_nid)
    if not perm:
        raise HTTPException(status_code=404, detail="No permission found")
    return {"privileged_access": perm.has_privileged_access}

@router.post("/clinician/permissions")
def toggle_clinician_privileged_access(
    group_nid: int,
    enabled: bool,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    _: None = Depends(require_role("admin"))
):
    ok = set_clinician_privileged_access(db, current_user['sub'], group_nid, enabled)
    if not ok:
        raise HTTPException(status_code=404, detail="Permission not found or not mapped")
    # Log action
    log = LaunchLog(
        epoch=int(datetime.utcnow().timestamp()),
        type="toggle_privileged_access",
        user_UID=current_user.get('legacy_uid', 0),
        group_NID=group_nid,
        patient_serial=None,
        MetaData=json.dumps({"enabled": enabled})
    )
    db.add(log)
    db.commit()
    return {"success": True}

@router.get("/clinician/consent")
def get_clinician_consent(group_nid: int = Query(...), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    legacy_uid = resolve_legacy_uid_from_token(db, current_user)
    if not legacy_uid:
        raise HTTPException(status_code=404, detail="No mapping for user")
    # Return latest consent for this user/group
    from app.models.legacy_models import ClinicianGroupConsent
    consent = db.query(ClinicianGroupConsent).filter_by(uid=legacy_uid, group_nid=group_nid).order_by(ClinicianGroupConsent.timestamp.desc()).first()
    if not consent:
        return {"consent": None}
    return {"consent": {f"consent{i}": getattr(consent, f"consent{i}") for i in range(1,8)}}

@router.post("/clinician/consent")
def post_clinician_consent(
    group_nid: int,
    consent_flags: Dict[str, bool],
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ok = record_clinician_group_consent(db, current_user['sub'], group_nid, consent_flags)
    if not ok:
        raise HTTPException(status_code=400, detail="Consent not recorded")
    # Log action
    log = LaunchLog(
        epoch=int(datetime.utcnow().timestamp()),
        type="clinician_consent",
        user_UID=current_user.get('legacy_uid', 0),
        group_NID=group_nid,
        patient_serial=None,
        MetaData=json.dumps(consent_flags)
    )
    db.add(log)
    db.commit()
    return {"success": True}

@router.get("/admin/trusts")
def list_trusts(db: Session = Depends(get_db), _: None = Depends(require_role("admin"))):
    trusts = db.query(TrustConfig).all()
    result = []
    for trust in trusts:
        patient_count = db.query(LaunchPatient).filter_by(group_nid=trust.drupal_group_nid).count()
        clinician_count = db.query(ClinicianPermission).filter_by(group_nid=trust.drupal_group_nid).count()
        result.append({
            "trust_id": trust.trust_id,
            "drupal_group_nid": trust.drupal_group_nid,
            "patient_count": patient_count,
            "clinician_count": clinician_count
        })
    return result

@router.get("/admin/trusts/{group_nid}/patients")
def list_trust_patients(
    group_nid: int,
    db: Session = Depends(get_db),
    _: None = Depends(require_role("admin")),
):
    patients = db.query(LaunchPatient).filter_by(group_nid=group_nid).order_by(LaunchPatient.serial).all()
    return [
        {
            "serial": patient.serial,
            "name": patient.full_name,
            "identifier": patient.patient_indentifier,
        }
        for patient in patients
    ]
