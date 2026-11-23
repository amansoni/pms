export interface User {
  id: string;
  email: string;
  name: string;
  groups: string[];
  roles: string[];
  enabled: boolean;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  path: string;
  attributes: Record<string, string[]>;
  memberCount: number;
}

export interface GroupSettings {
  max_assessments?: number;
  data_retention_days?: number;
  features?: string[];
}

export interface TrustSummary {
  trust_id: string;
  drupal_group_nid: number;
  patient_count: number;
  clinician_count: number;
}

export interface PatientRecord {
  serial: number;
  name: string;
  identifier: string;
}

export interface UserFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  enabled: boolean;
  roles: string[];
  groups: string[];
}

export interface GroupFormData {
  name: string;
  attributes?: Record<string, string[]>;
  settings?: GroupSettings;
}

// No changes needed; types are sufficient for CRUD.
