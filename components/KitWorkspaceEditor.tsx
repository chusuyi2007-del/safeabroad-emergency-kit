"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, Edit3, FileText, LockKeyhole, MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/Button";
import { DeleteKitButton } from "@/components/DeleteKitButton";
import { Notice } from "@/components/Notice";
import { saveKit } from "@/lib/kit-store";
import type { FieldStatus, KitRecord, WorkspaceField } from "@/lib/types";
import {
  completionPercent,
  ensureWorkspace,
  requiredMissing,
  sectionLabels,
  sourceLabels,
  statusLabels,
  updateWorkspaceField,
  workspaceFields
} from "@/lib/workspace";

const statusActions: Array<[FieldStatus, string]> = [
  ["confirmed", "标记为已确认"],
  ["not_sure", "标记为不确定"],
  ["needs_student_confirmation", "需要学生确认"],
  ["needs_parent_confirmation", "需要家长确认"]
];

function statusTone(status: FieldStatus) {
  if (status === "confirmed") return "border-teal-200 bg-mist text-teal-900";
  if (status === "doctor_should_verify") return "border-amber-200 bg-[#fff8e8] text-amber-950";
  if (status === "not_sure") return "border-gray-200 bg-gray-50 text-gray-700";
  return "border-sky-200 bg-sky-50 text-ocean";
}

function sectionIcon(section: WorkspaceField["section"]) {
  if (section === "medical") return MessageSquareWarning;
  if (section === "rights") return LockKeyhole;
  if (section === "contacts") return CheckCircle2;
  return FileText;
}

function FieldRow({
  field,
  onChange
}: {
  field: WorkspaceField;
  onChange: (fieldId: string, patch: Partial<Pick<WorkspaceField, "value" | "status">>) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-md border border-line bg-white/95 p-4 shadow-sm ring-1 ring-white/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-ink">{field.label}</h3>
            {field.required ? <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">必填</span> : null}
          </div>
          {editing ? (
            <textarea
              className="mt-3 min-h-24 w-full rounded-md border border-line bg-paper/60 px-3 py-2 outline-none focus:border-calm focus:ring-4 focus:ring-teal-100"
              onChange={(event) => onChange(field.id, { value: event.target.value })}
              value={field.value}
            />
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-gray-800">{field.value || "未填写"}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-md border border-line bg-paper px-2 py-1">来源：{sourceLabels[field.source]}</span>
            <span className={`rounded-md border px-2 py-1 ${statusTone(field.status)}`}>状态：{statusLabels[field.status]}</span>
          </div>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-calm hover:bg-mist" onClick={() => setEditing(!editing)} type="button">
          <Edit3 className="h-4 w-4" />
          {editing ? "完成编辑" : "编辑"}
        </button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {statusActions.map(([status, label]) => (
          <button
            className={`rounded-md border px-3 py-2 text-sm font-bold transition hover:border-calm ${
              field.status === status ? "border-calm bg-mist text-calm" : "border-line bg-paper text-ink"
            }`}
            key={status}
            onClick={() => onChange(field.id, { status })}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function KitWorkspaceEditor({ initialKit }: { initialKit: KitRecord }) {
  const router = useRouter();
  const [kit, setKit] = useState(() => ensureWorkspace(initialKit));
  const [saved, setSaved] = useState(false);
  const fields = useMemo(() => workspaceFields(kit), [kit]);
  const missing = useMemo(() => requiredMissing(kit), [kit]);
  const progress = completionPercent(kit);

  const grouped = useMemo(
    () =>
      fields.reduce<Record<WorkspaceField["section"], WorkspaceField[]>>(
        (acc, field) => {
          acc[field.section].push(field);
          return acc;
        },
        { basic: [], location: [], medical: [], contacts: [], rights: [] }
      ),
    [fields]
  );

  function updateField(fieldId: string, patch: Partial<Pick<WorkspaceField, "value" | "status">>) {
    setSaved(false);
    setKit((current) => updateWorkspaceField(current, fieldId, patch));
  }

  async function save() {
    const next = await saveKit(kit);
    setKit(next);
    setSaved(true);
  }

  async function createView() {
    const next = await saveKit({ ...kit, workspace: { ...kit.workspace, viewRevoked: false } });
    setKit(next);
    router.push(`/kit/${next.kitId}/view`);
  }

  async function revokeView() {
    const next = await saveKit({ ...kit, workspace: { ...kit.workspace, viewRevoked: true } });
    setKit(next);
    setSaved(true);
  }

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-md border border-white/70 bg-white shadow-sm ring-1 ring-line/50">
        <div className="bg-ink px-5 py-5 text-white sm:px-6">
          <p className="text-sm font-bold text-teal-100">共享应急包工作区</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">
              {kit.parent.studentChineseName || kit.parent.studentEnglishName || "学生"} 的 Emergency Kit
            </h1>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-300">
              <Clock3 className="h-4 w-4" />
              Last updated: {new Date(kit.updatedAt).toLocaleDateString("en-US")}
            </p>
          </div>
            <div className="min-w-52 rounded-md border border-white/10 bg-white/10 p-4">
              <p className="text-sm font-bold text-teal-100">完成度 {progress}%</p>
              <div className="mt-2 h-3 rounded-full bg-white/15">
                <div className="h-3 rounded-full bg-teal-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 sm:p-6">
        <div className="rounded-md border border-line bg-paper p-4 text-sm font-semibold leading-6 text-gray-700">
          {missing.length ? (
            <p>缺少必填信息：{missing.map((field) => field.label).join("、")}</p>
          ) : (
            <p>必填信息已齐全。仍建议学生、家长和医生分别确认相关内容。</p>
          )}
        </div>
        </div>
      </section>

      <Notice />

      {(["basic", "location", "medical", "contacts", "rights"] as const).map((section) => (
        <section className="space-y-3" key={section}>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-calm shadow-sm ring-1 ring-line">
              {(() => {
                const Icon = sectionIcon(section);
                return <Icon className="h-5 w-5" />;
              })()}
            </span>
            <h2 className="text-2xl font-black text-ink">{sectionLabels[section]}</h2>
          </div>
          <div className="grid gap-3">
            {grouped[section].map((field) => (
              <FieldRow field={field} key={field.id} onChange={updateField} />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-md border border-line bg-white/95 p-5 shadow-sm ring-1 ring-white/70">
        <h2 className="text-2xl font-black text-ink">隐私与安全</h2>
        <div className="mt-3 space-y-2 text-sm leading-6 text-gray-700">
          <p>导出或保存后，可以删除所有 kit 数据。</p>
          <p>共享只应发给可信任的人。请不要填写护照、I-20、SSN 或完整保险号码。</p>
          <p>共享查看链接状态：{kit.workspace.viewRevoked ? "已撤销占位" : "可生成/查看"}</p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button onClick={revokeView} variant="secondary">撤销共享查看链接（占位）</Button>
          <DeleteKitButton token={kit.token} />
        </div>
      </section>

      <div className="rounded-md border border-line bg-white/90 p-4 shadow-sm ring-1 ring-white/70">
        <p className="mb-3 text-sm font-bold text-gray-600">工作区操作</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button onClick={save}>{saved ? "已保存" : "保存工作区更新"}</Button>
          <Button onClick={createView} variant="secondary">生成只读应急页面</Button>
          <Button href={`/cards/${kit.token}`} variant="secondary">预览卡片</Button>
          <Button href={`/export/${kit.token}`} variant="secondary">导出卡片</Button>
        </div>
      </div>
    </div>
  );
}
