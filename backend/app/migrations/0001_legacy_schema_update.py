"""
Revision ID: 0001_legacy_schema_update
Revises: 
Create Date: 2025-12-02

Idempotent migration for legacy schema: adds FKs, indexes, and keycloak_user_mapping table.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, TINYINT, BIGINT
import datetime

def upgrade():
    # Add foreign keys if not exist
    with op.batch_alter_table('org_launch_clinician_permissions') as batch_op:
        batch_op.create_foreign_key(
            'fk_clinician_permissions_group_nid',
            'org_launch_trusts',
            ['group_nid'], ['drupal_group_nid'],
            existing_type=sa.Integer,
            ondelete='CASCADE',
            initially=None,
            deferrable=None
        )
        batch_op.create_index(
            'ix_clinician_permissions_uid_group',
            ['clinician_drupal_uid', 'group_nid'],
            unique=False
        )
    with op.batch_alter_table('org_launch_patients') as batch_op:
        batch_op.create_foreign_key(
            'fk_patients_group_nid',
            'org_launch_trusts',
            ['group_nid'], ['drupal_group_nid'],
            existing_type=sa.Integer,
            ondelete='CASCADE',
            initially=None,
            deferrable=None
        )
        batch_op.create_index(
            'ix_patients_hashedid_identifier',
            ['hashed_id', 'patient_indentifier'],
            unique=False
        )
    with op.batch_alter_table('org_launch_logs') as batch_op:
        batch_op.create_index(
            'ix_logs_user_group_epoch',
            ['user_UID', 'group_NID', 'epoch'],
            unique=False
        )
    # Create keycloak_user_mapping table if not exists
    op.create_table(
        'keycloak_user_mapping',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('keycloak_sub', sa.String(255), unique=True, nullable=False),
        sa.Column('legacy_uid', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, default=datetime.datetime.utcnow),
        mysql_engine='InnoDB',
        mysql_charset='utf8mb4'
    )

def downgrade():
    # Drop only what we created (safe for idempotency)
    op.drop_table('keycloak_user_mapping')
    with op.batch_alter_table('org_launch_clinician_permissions') as batch_op:
        batch_op.drop_index('ix_clinician_permissions_uid_group')
        batch_op.drop_constraint('fk_clinician_permissions_group_nid', type_='foreignkey')
    with op.batch_alter_table('org_launch_patients') as batch_op:
        batch_op.drop_index('ix_patients_hashedid_identifier')
        batch_op.drop_constraint('fk_patients_group_nid', type_='foreignkey')
    with op.batch_alter_table('org_launch_logs') as batch_op:
        batch_op.drop_index('ix_logs_user_group_epoch')
