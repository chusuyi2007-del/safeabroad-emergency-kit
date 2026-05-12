import type { KitRecord } from "./types";

export function emptyKit(token = crypto.randomUUID()): KitRecord {
  const now = new Date().toISOString();

  return {
    token,
    kitId: token,
    createdAt: now,
    updatedAt: now,
    parentComplete: false,
    studentComplete: false,
    parent: {
      studentEnglishName: "",
      studentChineseName: "",
      preferredLanguage: "Mandarin Chinese",
      allergies: { choice: "not_sure" },
      conditions: { choice: "not_sure" },
      surgeries: { choice: "not_sure" },
      erHistory: "",
      familyContactName: "",
      familyContactPhone: "",
      doctorNotes: ""
    },
    student: {
      usPhone: "",
      school: "",
      address: "",
      floorRoom: "",
      landmark: "",
      medications: { choice: "not_sure" },
      medicationDosage: "",
      medicationSchedule: "",
      medicationAppearance: "",
      usContactName: "",
      usContactPhone: "",
      insurancePlan: "",
      studentNotes: ""
    },
    workspace: {
      fields: {},
      viewRevoked: false
    }
  };
}
