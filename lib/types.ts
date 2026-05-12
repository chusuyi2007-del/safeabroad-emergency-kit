export type DetailChoice = "none" | "not_sure" | "details";

export type DetailField = {
  choice: DetailChoice;
  details?: string;
};

export type FieldSource = "parent" | "student" | "unknown";

export type FieldStatus =
  | "confirmed"
  | "not_sure"
  | "needs_student_confirmation"
  | "needs_parent_confirmation"
  | "doctor_should_verify";

export type WorkspaceField = {
  id: string;
  label: string;
  section: "basic" | "location" | "medical" | "contacts" | "rights";
  value: string;
  required?: boolean;
  important?: boolean;
  source: FieldSource;
  status: FieldStatus;
  doubleChecked?: boolean;
  doubleCheckedAt?: string;
  updatedAt: string;
};

export type KitWorkspace = {
  fields: Record<string, WorkspaceField>;
  viewRevoked?: boolean;
};

export type ParentInfo = {
  studentEnglishName: string;
  studentChineseName: string;
  preferredLanguage: string;
  allergies: DetailField;
  conditions: DetailField;
  surgeries: DetailField;
  erHistory?: string;
  familyContactName: string;
  familyContactPhone: string;
  doctorNotes?: string;
};

export type StudentInfo = {
  usPhone: string;
  school: string;
  address: string;
  floorRoom: string;
  landmark: string;
  medications: DetailField;
  medicationDosage?: string;
  medicationSchedule?: string;
  medicationAppearance?: string;
  usContactName: string;
  usContactPhone: string;
  insurancePlan?: string;
  studentNotes?: string;
};

export type KitRecord = {
  token: string;
  kitId: string;
  createdAt: string;
  updatedAt: string;
  parentComplete: boolean;
  studentComplete: boolean;
  parent: ParentInfo;
  student: StudentInfo;
  workspace: KitWorkspace;
};

export type EmergencyCard = {
  id: string;
  title: string;
  english: string;
  chinese: string;
  disclaimer?: string;
};
