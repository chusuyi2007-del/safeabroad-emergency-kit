"use client";

import { useMemo, useState } from "react";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import type { WorkspaceField } from "@/lib/types";
import { classifyVoiceText, type VoiceSuggestion } from "@/lib/voice-classifier";

export function BulkVoiceIntake({
  fields,
  onApply
}: {
  fields: Record<string, WorkspaceField>;
  onApply: (suggestions: VoiceSuggestion[]) => void;
}) {
  const [text, setText] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const result = useMemo(() => classifyVoiceText(text, fields), [fields, text]);

  function appendText(next: string) {
    setText((current) => (current ? `${current} ${next}` : next));
    setReviewOpen(true);
  }

  function apply() {
    onApply(result.suggestions);
    setReviewOpen(false);
  }

  return (
    <section className="rounded-md border border-line bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">整段语音整理</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            可以直接说完整情况，例如姓名、学校、住址、过敏、用药和联系人。系统会先自动分类，再让你确认。
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            示例：我的英文名是 Lina Wang，学校是 UCLA，住在 330 De Neve Drive，房间 405，过敏是花生，当前用药是 Zyrtec 10 mg once daily。
          </p>
        </div>
        <VoiceInputButton label="开始整段语音输入" onText={appendText} />
      </div>

      <textarea
        className="mt-4 min-h-28 w-full rounded-md border border-line bg-paper/60 px-4 py-3 outline-none focus:border-calm focus:ring-4 focus:ring-teal-100"
        onChange={(event) => {
          setText(event.target.value);
          setReviewOpen(Boolean(event.target.value.trim()));
        }}
        placeholder="也可以把语音转写内容粘贴到这里，然后让系统分类。"
        value={text}
      />
      <p className="mt-2 text-xs leading-5 text-gray-500">
        自动分类是辅助功能。写入后请在下面字段里逐项检查，重要信息还需要 double check。
      </p>

      {reviewOpen ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-[#fff8e8] p-4">
          <h3 className="font-bold text-ink">写入前提醒</h3>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-950">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>

          <div className="mt-4 rounded-md border border-line bg-white p-3">
            <p className="text-sm font-bold text-ink">自动分类结果</p>
            {result.suggestions.length ? (
              <div className="mt-3 grid gap-2">
                {result.suggestions.map((suggestion) => (
                  <div className="rounded-md border border-line bg-paper p-3" key={suggestion.fieldId}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <p className="font-bold text-ink">{suggestion.label}</p>
                      <p className="text-xs text-gray-500">{suggestion.reason}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{suggestion.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm leading-6 text-gray-600">
                暂时没有识别出明确字段。可以改成“学校是…”“地址是…”“当前用药是…”这种更明确的句式再试。
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              className="min-h-11 rounded-md border border-calm bg-calm px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              disabled={!result.suggestions.length}
              onClick={apply}
              type="button"
            >
              确认并写入分类字段
            </button>
            <button
              className="min-h-11 rounded-md border border-line bg-white px-4 py-2 text-sm font-bold text-ink"
              onClick={() => setReviewOpen(false)}
              type="button"
            >
              暂不写入
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
