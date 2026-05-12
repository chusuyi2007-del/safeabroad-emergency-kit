import type { DetailField, EmergencyCard, KitRecord } from "./types";

function detailText(field: DetailField, noneText = "None"): string {
  if (field.choice === "none") return noneText;
  if (field.choice === "not_sure") return "Not sure";
  return field.details?.trim() || "Details not provided";
}

function orFallback(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

export function updatedDate(kit: KitRecord): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(kit.updatedAt));
}

export function buildCards(kit: KitRecord): EmergencyCard[] {
  const name = orFallback(kit.parent.studentEnglishName, "the student");
  const address = orFallback(kit.student.address, "my current address");
  const floor = orFallback(kit.student.floorRoom, "my floor or room");
  const landmark = orFallback(kit.student.landmark, "a nearby landmark");
  const contactName =
    kit.student.usContactName.trim() || kit.parent.familyContactName.trim() || "my emergency contact";
  const contactPhone =
    kit.student.usContactPhone.trim() || kit.parent.familyContactPhone.trim() || "my emergency contact phone";

  return [
    {
      id: "911",
      title: "911 Card",
      english: `I need help. I need a Mandarin interpreter. My name is ${name}. My location is ${address} / ${floor} / ${landmark}. Please send police or an ambulance.`,
      chinese: "给 911 接线员看的求助卡：说明需要中文普通话翻译、姓名、位置，并请求警察或救护车。"
    },
    {
      id: "location",
      title: "Location Card",
      english: `I am at ${address}. I am on ${floor}. I am near ${landmark}.`,
      chinese: "位置卡：帮助你在紧急情况下清楚说出地址、楼层/房间和附近地标。"
    },
    {
      id: "medical",
      title: "ER Medical Summary Card",
      english: `I need a Mandarin medical interpreter. My allergies are: ${detailText(
        kit.parent.allergies,
        "No known allergies"
      )}. My current medications are: ${detailText(kit.student.medications)}. My medical history is: ${detailText(
        kit.parent.conditions
      )}. My surgeries are: ${detailText(kit.parent.surgeries)}. My past ER or urgent care history is: ${orFallback(
        kit.parent.erHistory,
        "Not provided"
      )}. Please call my emergency contact: ${contactName}, ${contactPhone}.`,
      chinese: "急诊医疗摘要卡：只整理已知信息，方便和医生沟通；不能替代医生诊断或医疗建议。"
    },
    {
      id: "cant-speak",
      title: "I Can't Speak Card",
      english:
        "I cannot speak clearly right now. Please help me. I need a Mandarin interpreter. Please check my emergency card.",
      chinese: "无法清楚说话时使用：请对方帮助你，并查看你的应急卡。"
    },
    {
      id: "rights",
      title: "Know Your Rights Card",
      english:
        "I choose to remain silent. I do not consent to a search. I want to speak to a lawyer. I will not sign anything without speaking to a lawyer. I need a Mandarin interpreter.",
      chinese: "权利提示卡：固定英文内容，用于表达保持沉默、不同意搜查、希望联系律师和需要普通话翻译。",
      disclaimer: "This is general information, not legal advice."
    },
    {
      id: "contact",
      title: "Emergency Contact Card",
      english: `My emergency contact is ${contactName}. Phone: ${contactPhone}. If I cannot speak, please contact them.`,
      chinese: "紧急联系人卡：在你无法说话或需要帮助时，请对方联系这里的联系人。"
    }
  ];
}

export function lockScreenText(kit: KitRecord): string {
  const phone = kit.student.usContactPhone.trim() || kit.parent.familyContactPhone.trim() || "emergency contact phone";
  return `I need help. I need a Mandarin interpreter. Emergency contact: ${phone}. Medical summary available in my emergency kit.`;
}
