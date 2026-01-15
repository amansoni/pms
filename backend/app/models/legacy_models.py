from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, BigInteger, SmallInteger
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class ClinicianPermission(Base):
    __tablename__ = 'org_launch_clinician_permissions'
    serial = Column(Integer, primary_key=True, autoincrement=True)
    clinician_drupal_uid = Column(Integer, nullable=False)
    group_nid = Column(Integer, ForeignKey('org_launch_trusts.drupal_group_nid'), nullable=False)
    launch_type = Column(String(50), nullable=False, default='default')
    priviledged_access = Column(Integer, nullable=False, default=0)

    trust = relationship('TrustConfig', back_populates='clinician_permissions')

    @property
    def has_privileged_access(self) -> bool:
        return bool(self.priviledged_access)

class ClinicianGroupConsent(Base):
    __tablename__ = 'org_launch_consent_clinician_group'
    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(Integer, nullable=False)
    group_nid = Column(Integer, nullable=False)
    timestamp = Column(Integer, nullable=False)
    consent1 = Column(Boolean, nullable=False)
    consent2 = Column(Boolean, nullable=False)
    consent3 = Column(Boolean, nullable=False)
    consent4 = Column(Boolean, nullable=False)
    consent5 = Column(Boolean, nullable=False)
    consent6 = Column(Boolean, nullable=False)
    consent7 = Column(Boolean, nullable=False)

class MyGraceGroupConsent(Base):
    __tablename__ = 'org_launch_consent_mygrace_group'
    uid = Column(Integer, primary_key=True, nullable=False)
    timestamp = Column(BigInteger, nullable=False)
    group_nid = Column(Integer, nullable=False)

class DirectMyGracePatient(Base):
    __tablename__ = 'org_launch_direct_mygrace_patients'
    serial = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(Integer, nullable=False)
    nid = Column(Integer, nullable=False)
    grist_id = Column(String(100), nullable=False)

class LaunchLog(Base):
    __tablename__ = 'org_launch_logs'
    entry_no = Column(Integer, primary_key=True, autoincrement=True)
    epoch = Column(BigInteger, nullable=False)
    type = Column(String(20), nullable=False)
    user_UID = Column(Integer, nullable=False)
    group_NID = Column(Integer, nullable=False)
    patient_serial = Column(BigInteger, nullable=True)
    MetaData = Column(String(200), nullable=False)

class LaunchPatient(Base):
    __tablename__ = 'org_launch_patients'
    serial = Column(Integer, primary_key=True, autoincrement=True)
    hashed_id = Column(String(100), nullable=False)
    patient_indentifier = Column(String(100), nullable=False)
    group_nid = Column(Integer, ForeignKey('org_launch_trusts.drupal_group_nid'), nullable=False)
    clinician_drupal_uid = Column(String(100), nullable=False)
    forename = Column(String(100), nullable=True)
    surname = Column(String(100), nullable=True)

    trust = relationship('TrustConfig', back_populates='patients')

    @property
    def full_name(self) -> str:
        return f"{self.forename or ''} {self.surname or ''}".strip()

class SensorBoxRegistration(Base):
    __tablename__ = 'org_launch_sensors_box_registration'
    id = Column(Integer, primary_key=True, autoincrement=True)
    drupal_uid = Column(Integer, nullable=False)
    box_id = Column(String(100), nullable=False)
    bewell_patient_id = Column(Integer, nullable=False)
    grist_id = Column(String(100), nullable=False)

class TrustConfig(Base):
    __tablename__ = 'org_launch_trusts'
    trust_id = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    privileged_password = Column(String(100), nullable=False)
    drupal_group_nid = Column(Integer, primary_key=True)
    salt = Column(String(100), nullable=False)
    default_tool = Column(String(100), nullable=False)
    default_assessment_mode = Column(String(50), nullable=False)
    default_population = Column(String(100), nullable=False)
    default_launch_type = Column(String(100), nullable=False)
    dafault_start_in_screening = Column(Integer, nullable=False, default=0)
    show_patient_list = Column(Integer, nullable=False, default=1)

    patients = relationship('LaunchPatient', back_populates='trust')
    clinician_permissions = relationship('ClinicianPermission', back_populates='trust')

class KeycloakUserMapping(Base):
    __tablename__ = 'keycloak_user_mapping'
    id = Column(Integer, primary_key=True, autoincrement=True)
    keycloak_sub = Column(String(255), unique=True, nullable=False)
    legacy_uid = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
