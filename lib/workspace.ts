import type { DetailField, FieldSource, FieldStatus, KitRecord, WorkspaceField } from "./types";

type FieldConfig = {
  id: string;
  label: string;
  section: WorkspaceField["section"];
  required?: boolean;
  important?: boolean;
  getValue: (kit: KitRecord) => string;
  source: FieldSource;
  status: FieldStatus;
};

export const sectionLabels: Record<WorkspaceField["section"], string> = {
  basic: "基础信息",
  location: "位置",
  medical: "医疗史",
  contacts: "联系人",
  rights: "权利卡"
};

export const statusLabels: Record<FieldStatus, string> = {
  confirmed: "已确认",
  not_sure: "不确定",
  needs_student_confirmation: "需要学生确认",
  needs_parent_confirmation: "需要家长确认",
  doctor_should_verify: "建议医生核实"
};

export const sourceLabels: Record<FieldSource, string> = {
  parent: "家长",
  student: "学生",
  unknown: "未知"
};

export function detailToText(field: DetailField, noneText = "None"): string {
  if (field.choice === "none") return noneText;
  if (field.choice === "not_sure") return "Not sure";
  return field.details?.trim() || "Details not provided";
}

function detailStatus(field: DetailField, medical = false): FieldStatus {
  if (field.choice === "not_sure") return "not_sure";
  if (medical && field.choice === "details") return "doctor_should_verify";
  return "confirmed";
}

const fieldConfigs: FieldConfig[] = [
  {
    id: "studentEnglishName",
    label: "学生英文名",
    section: "basic",
    required: true,
    important: true,
    source: "parent",
    status: "needs_student_confirmation",
    getValue: (kit) => kit.parent.studentEnglishName
  },
  {
    id: "studentChineseName",
    label: "学生中文名",
    section: "basic",
    source: "parent",
    status: "needs_student_confirmation",
    getValue: (kit) => kit.parent.studentChineseName
  },
  {
    id: "preferredLanguage",
    label: "偏好语言",
    section: "basic",
    required: true,
    source: "parent",
    status: "confirmed",
    getValue: (kit) => kit.parent.preferredLanguage
  },
  {
    id: "school",
    label: "学校",
    section: "location",
    required: true,
    important: true,
    source: "student",
    status: "confirmed",
    getValue: (kit) => kit.student.school
  },
  {
    id: "address",
    label: "宿舍/公寓地址",
    section: "location",
    required: true,
    important: true,
    source: "student",
    status: "confirmed",
    getValue: (kit) => kit.student.address
  },
  {
    id: "floorRoom",
    label: "楼层/房间",
    section: "location",
    important: true,
    source: "student",
    status: "confirmed",
    getValue: (kit) => kit.student.floorRoom
  },
  {
    id: "landmark",
    label: "附近地标",
    section: "location",
    important: true,
    source: "student",
    status: "confirmed",
    getValue: (kit) => kit.student.landmark
  },
  {
    id: "allergies",
    label: "过敏",
    section: "medical",
    important: true,
    source: "parent",
    status: "doctor_should_verify",
    getValue: (kit) => detailToText(kit.parent.allergies, "No known allergies")
  },
  {
    id: "conditions",
    label: "既往或当前疾病",
    section: "medical",
    important: true,
    source: "parent",
    status: "doctor_should_verify",
    getValue: (kit) => detailToText(kit.parent.conditions)
  },
  {
    id: "surgeries",
    label: "手术史",
    section: "medical",
    important: true,
    source: "parent",
    status: "doctor_should_verify",
    getValue: (kit) => detailToText(kit.parent.surgeries)
  },
  {
    id: "erHistory",
    label: "急诊或 urgent care 经历",
    section: "medical",
    important: true,
    source: "parent",
    status: "doctor_should_verify",
    getValue: (kit) => kit.parent.erHistory ?? ""
  },
  {
    id: "medications",
    label: "当前用药",
    section: "medical",
    important: true,
    source: "student",
    status: "doctor_should_verify",
    getValue: (kit) => detailToText(kit.student.medications)
  },
  {
    id: "familyContact",
    label: "家庭紧急联系人",
    section: "contacts",
    required: true,
    important: true,
    source: "parent",
    status: "confirmed",
    getValue: (kit) => [kit.parent.familyContactName, kit.parent.familyContactPhone].filter(Boolean).join(" / ")
  },
  {
    id: "usContact",
    label: "美国紧急联系人",
    section: "contacts",
    required: true,
    important: true,
    source: "student",
    status: "confirmed",
    getValue: (kit) => [kit.student.usContactName, kit.student.usContactPhone].filter(Boolean).join(" / ")
  },
  {
    id: "usPhone",
    label: "学生美国手机号",
    section: "contacts",
    required: true,
    important: true,
    source: "student",
    status: "confirmed",
    getValue: (kit) => kit.student.usPhone
  },
  {
    id: "insurancePlan",
    label: "保险计划名称",
    section: "medical",
    source: "student",
    status: "needs_parent_confirmation",
    getValue: (kit) => kit.student.insurancePlan ?? ""
  },
  {
    id: "rightsCard",
    label: "权利卡固定文本",
    section: "rights",
    required: true,
    source: "unknown",
    status: "confirmed",
    getValue: () =>
      "I choose to remain silent. I do not consent to a search. I want to speak to a lawyer. I will not sign anything without speaking to a lawyer. I need a Mandarin interpreter."
  }
];

export function ensureWorkspace(kit: KitRecord): KitRecord {
  const now = kit.updatedAt || new Date().toISOString();
  const fields = { ...(kit.workspace?.fields ?? {}) };

  for (const config of fieldConfigs) {
    const value = config.getValue(kit);
    const existing = fields[config.id];
    const status =
      config.id === "allergies"
        ? detailStatus(kit.parent.allergies, true)
        : config.id === "conditions"
          ? detailStatus(kit.parent.conditions, true)
          : config.id === "surgeries"
            ? detailStatus(kit.parent.surgeries, true)
            : config.id === "medications"
              ? detailStatus(kit.student.medications, true)
              : config.status;

    fields[config.id] = {
      id: config.id,
      label: config.label,
      section: config.section,
      required: config.required,
      important: config.important,
      value: existing?.value?.trim() ? existing.value : value,
      source: existing?.source ?? config.source,
      status: existing?.status ?? status,
      doubleChecked: existing?.doubleChecked ?? false,
      doubleCheckedAt: existing?.doubleCheckedAt,
      updatedAt: existing?.updatedAt ?? now
    };
  }

  return {
    ...kit,
    kitId: kit.kitId ?? kit.token,
    workspace: {
      fields,
      viewRevoked: kit.workspace?.viewRevoked ?? false
    }
  };
}

export function updateWorkspaceField(
  kit: KitRecord,
  fieldId: string,
  patch: Partial<Pick<WorkspaceField, "value" | "source" | "status">>
): KitRecord {
  const hydrated = ensureWorkspace(kit);
  const field = hydrated.workspace.fields[fieldId];
  if (!field) return hydrated;
  const valueChanged = patch.value !== undefined && patch.value !== field.value;

  return {
    ...hydrated,
    workspace: {
      ...hydrated.workspace,
      fields: {
        ...hydrated.workspace.fields,
        [fieldId]: {
          ...field,
          ...patch,
          doubleChecked: valueChanged ? false : field.doubleChecked,
          doubleCheckedAt: valueChanged ? undefined : field.doubleCheckedAt,
          updatedAt: new Date().toISOString()
        }
      }
    }
  };
}

export function toggleDoubleCheck(kit: KitRecord, fieldId: string, checked: boolean): KitRecord {
  const hydrated = ensureWorkspace(kit);
  const field = hydrated.workspace.fields[fieldId];
  if (!field) return hydrated;

  return {
    ...hydrated,
    workspace: {
      ...hydrated.workspace,
      fields: {
        ...hydrated.workspace.fields,
        [fieldId]: {
          ...field,
          doubleChecked: checked,
          doubleCheckedAt: checked ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        }
      }
    }
  };
}

export function workspaceFields(kit: KitRecord): WorkspaceField[] {
  return Object.values(ensureWorkspace(kit).workspace.fields);
}

export function requiredMissing(kit: KitRecord): WorkspaceField[] {
  return workspaceFields(kit).filter((field) => field.required && !field.value.trim());
}

export function importantNeedingDoubleCheck(kit: KitRecord): WorkspaceField[] {
  return workspaceFields(kit).filter(
    (field) => field.important && field.value.trim() && !field.doubleChecked
  );
}

export function completionPercent(kit: KitRecord): number {
  const fields = workspaceFields(kit);
  const required = fields.filter((field) => field.required);
  if (required.length === 0) return 100;
  const complete = required.filter((field) => field.value.trim() && field.status !== "not_sure").length;
  return Math.round((complete / required.length) * 100);
}
