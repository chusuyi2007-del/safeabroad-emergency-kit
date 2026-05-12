import type { WorkspaceField } from "./types";

export type VoiceSuggestion = {
  fieldId: string;
  label: string;
  value: string;
  reason: string;
};

const classifiers: Array<{
  fieldId: string;
  label: string;
  reason: string;
  patterns: RegExp[];
}> = [
  {
    fieldId: "studentEnglishName",
    label: "学生英文名",
    reason: "识别到姓名/英文名相关描述",
    patterns: [/英文名(?:是|叫)?\s*([^，。；;\n]+)/i, /English name(?: is|:)?\s*([^,.;\n]+)/i, /my name is\s*([^,.;\n]+)/i]
  },
  {
    fieldId: "studentChineseName",
    label: "学生中文名",
    reason: "识别到中文名相关描述",
    patterns: [/中文名(?:是|叫)?\s*([^，。；;\n]+)/i, /Chinese name(?: is|:)?\s*([^,.;\n]+)/i]
  },
  {
    fieldId: "school",
    label: "学校",
    reason: "识别到学校相关描述",
    patterns: [/学校(?:是|在)?\s*([^，。；;\n]+)/i, /就读(?:于|在)\s*([^，。；;\n]+)/i, /school(?: is|:)?\s*([^,.;\n]+)/i]
  },
  {
    fieldId: "address",
    label: "宿舍/公寓地址",
    reason: "识别到地址相关描述",
    patterns: [/(?:地址|住址|宿舍|公寓)(?:是|在)?\s*([^。；;\n]+)/i, /address(?: is|:)?\s*([^.;\n]+)/i]
  },
  {
    fieldId: "floorRoom",
    label: "楼层/房间",
    reason: "识别到楼层或房间号",
    patterns: [/(?:房间|房号|楼层|room|floor)(?:是|在|:)?\s*([^，。；;\n]+)/i]
  },
  {
    fieldId: "landmark",
    label: "附近地标",
    reason: "识别到地标或附近位置",
    patterns: [/(?:地标|附近|旁边|near|landmark)(?:是|有|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "allergies",
    label: "过敏",
    reason: "识别到过敏信息",
    patterns: [/(?:过敏|allerg(?:y|ies))(?:是|有|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "conditions",
    label: "既往或当前疾病",
    reason: "识别到疾病或病史信息",
    patterns: [/(?:疾病|病史|诊断|condition|medical history)(?:是|有|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "surgeries",
    label: "手术史",
    reason: "识别到手术史信息",
    patterns: [/(?:手术|手术史|surger(?:y|ies))(?:是|有|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "erHistory",
    label: "急诊或 urgent care 经历",
    reason: "识别到急诊或 urgent care 经历",
    patterns: [/(?:急诊|urgent care|ER)(?:经历|去过|是|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "medications",
    label: "当前用药",
    reason: "识别到当前用药信息",
    patterns: [/(?:用药|药物|吃药|medication|medicine)(?:是|有|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "medicationDosage",
    label: "药品剂量",
    reason: "识别到药品剂量",
    patterns: [/(?:剂量|dosage|dose)(?:是|:)?\s*([^。；;\n]+)/i, /(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|tablet|tablets|片|粒))/i]
  },
  {
    fieldId: "medicationSchedule",
    label: "服用频率/周期",
    reason: "识别到服用频率或周期",
    patterns: [/(?:频率|周期|多久一次|每天|每晚|每周|schedule|frequency)(?:是|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "medicationAppearance",
    label: "药品外观备注",
    reason: "识别到药品外观信息",
    patterns: [/(?:药品外观|外观|颜色|形状|药瓶标签|appearance|color|shape|label)(?:是|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "familyContact",
    label: "家庭紧急联系人",
    reason: "识别到家庭联系人",
    patterns: [/(?:家庭|家里|父母|妈妈|爸爸).{0,8}(?:联系人|电话)(?:是|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "usContact",
    label: "美国紧急联系人",
    reason: "识别到美国本地联系人",
    patterns: [/(?:美国|本地).{0,8}(?:联系人|电话)(?:是|:)?\s*([^。；;\n]+)/i]
  },
  {
    fieldId: "usPhone",
    label: "学生美国手机号",
    reason: "识别到学生美国手机号",
    patterns: [/(?:美国手机号|美国电话|我的电话|学生电话|phone)(?:是|:)?\s*([+\d\s().-]{7,})/i]
  },
  {
    fieldId: "insurancePlan",
    label: "保险计划名称",
    reason: "识别到保险计划名称",
    patterns: [/(?:保险计划|保险名称|insurance plan)(?:是|:)?\s*([^，。；;\n]+)/i]
  }
];

const sensitivePatterns = [
  /护照|passport/i,
  /I-?20/i,
  /SSN|social security/i,
  /完整保险号|保险号码|full insurance/i
];

function clean(value: string): string {
  return value.replace(/^(是|在|有|:|：)\s*/i, "").trim();
}

export function classifyVoiceText(
  text: string,
  fields: Record<string, WorkspaceField>
): { suggestions: VoiceSuggestion[]; warnings: string[] } {
  const suggestions = new Map<string, VoiceSuggestion>();

  for (const classifier of classifiers) {
    for (const pattern of classifier.patterns) {
      const match = text.match(pattern);
      const value = clean(match?.[1] ?? "");
      if (value) {
        suggestions.set(classifier.fieldId, {
          fieldId: classifier.fieldId,
          label: fields[classifier.fieldId]?.label ?? classifier.label,
          value,
          reason: classifier.reason
        });
        break;
      }
    }
  }

  const warnings = [
    "请先核对自动分类结果，再写入工作区。",
    "不要填写护照、I-20、SSN、完整保险号码或完整医疗文件内容。"
  ];

  if (sensitivePatterns.some((pattern) => pattern.test(text))) {
    warnings.unshift("检测到可能的高敏感信息，请删除后再保存。");
  }

  if (suggestions.size === 0 && text.trim()) {
    warnings.push("这段话暂时没有识别出明确字段，可以手动复制到对应字段。");
  }

  return { suggestions: Array.from(suggestions.values()), warnings };
}
