# DB-LEGACY-NOTES.md

## Overview
This backend integrates Keycloak (for identity, roles, and groups) with a legacy MySQL schema used for mental health risk assessment. Keycloak remains the source of truth for authentication and group/role membership, while MySQL stores application-specific data for clinicians, patients, consents, devices, and audit logs.

## Legacy Tables and Usage
- **org_launch_clinician_permissions**: Maps clinicians (legacy Drupal UID) to groups (NID) and tracks privileged access. Used to check and set clinician permissions for group access.
- **org_launch_consent_clinician_group**: Stores consent flags (1-7) for clinicians per group, with timestamps.
- **org_launch_consent_mygrace_group**: Stores patient (end-user) consent to group association.
- **org_launch_direct_mygrace_patients**: Maps patients to groups and external system IDs (grist_id).
- **org_launch_logs**: Audit log for actions, including user/group/patient references and metadata.
- **org_launch_patients**: Patient records, including hashed IDs, identifiers, group, and clinician association.
- **org_launch_sensors_box_registration**: Device registration for patients, linking boxes to patients and clinicians.
- **org_launch_trusts**: Configuration for each group (trust), including passwords, default settings, and group NID.

## Keycloak User Mapping
- **keycloak_user_mapping**: Maps Keycloak user `sub` (subject) claim to legacy Drupal UID. Used to bridge modern Keycloak identities with legacy tables that require a UID. Created/queried automatically when clinicians interact with legacy data.

## Migration Risks and Rollback
- **Risks**: Adding foreign keys and indexes may fail if legacy data is inconsistent. Migration scripts are idempotent and check for existence before creating constraints.
- **Rollback**: Alembic downgrade removes only the new constraints and the mapping table, leaving legacy data untouched. No columns or tables are dropped/renamed in the legacy schema.

## Integration Notes
- All endpoints use Keycloak JWT for authentication and role checks.
- Legacy UID is resolved via the mapping table; if not present, it is created on first use.
- All writes to legacy tables are logged in `org_launch_logs` with action type and metadata.
- No changes are made to Keycloak itself; all integration is at the application layer.

---
For further details, see the SQLAlchemy models and Alembic migration scripts in the codebase.
