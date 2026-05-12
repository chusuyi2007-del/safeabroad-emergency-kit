"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { DetailChoiceField, Field } from "@/components/Field";
import { Notice } from "@/components/Notice";
import { Progress } from "@/components/Progress";
import { Shell } from "@/components/Shell";
import { emptyKit } from "@/lib/defaults";
import { loadKit, saveKit } from "@/lib/kit-store";
import type { KitRecord, ParentInfo } from "@/lib/types";

function ParentForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [kit, setKit] = useState<KitRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    async function run() {
      if (!token) return;
      setKit((await loadKit(token)) ?? emptyKit(token));
    }
    setOrigin(window.location.origin);
    run();
  }, [token]);

  if (!kit) {
    return (
      <Shell>
        <p>正在加载...</p>
      </Shell>
    );
  }

  const parent = kit.parent;
  const shareUrl = `${origin}/student/${kit.token}`;

  function update(parentPatch: Partial<ParentInfo>) {
    setKit((current) => (current ? { ...current, parent: { ...current.parent, ...parentPatch } } : current));
  }

  async function submit() {
    if (!kit) return;
    const saved = await saveKit({ ...kit, parentComplete: true });
    router.push(`/kit/${saved.kitId}/edit?token=${saved.token}`);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">家长信息</h1>
          <p className="mt-2 text-gray-700">填写你已经知道的信息。不确定的地方请选择“不确定”。</p>
        </div>
        <Progress parentComplete={kit.parentComplete} studentComplete={kit.studentComplete} />
        <Notice />
        <form className="grid gap-5 rounded-md border border-line bg-white p-4 sm:p-6" onSubmit={(event) => event.preventDefault()}>
          <Field help="会显示在 911 Card 和医疗卡上。建议使用学校、护照或保险资料里常用的英文拼写。" label="学生英文名" onChange={(value) => update({ studentEnglishName: value })} required value={parent.studentEnglishName} />
          <Field help="方便家人核对身份；英文应急卡主要仍使用英文名。" label="学生中文名" onChange={(value) => update({ studentChineseName: value })} value={parent.studentChineseName} />
          <Field help="默认是 Mandarin Chinese。如果学生更习惯 Cantonese 或 English，可以改掉。" label="偏好语言" onChange={(value) => update({ preferredLanguage: value })} value={parent.preferredLanguage} />
          <DetailChoiceField help="只写已经知道的过敏。若不确定，请选“不确定”，不要猜。" label="过敏 / Allergies" noneLabel="无已知过敏 / No known allergies" onChange={(allergies) => update({ allergies })} value={parent.allergies} />
          <DetailChoiceField help="记录医生曾明确说过的诊断或长期情况。这里不做诊断。" label="既往或当前疾病 / Medical conditions" noneLabel="无 / None" onChange={(conditions) => update({ conditions })} value={parent.conditions} />
          <DetailChoiceField help="可写手术名称和大概年份；不记得就选“不确定”。" label="手术史 / Surgeries" noneLabel="无 / None" onChange={(surgeries) => update({ surgeries })} value={parent.surgeries} />
          <Field help="例如曾因哮喘、过敏、受伤去过 ER 或 urgent care。没有也可以留空。" label="过去急诊或 urgent care 经历（可选）" onChange={(value) => update({ erHistory: value })} textarea value={parent.erHistory ?? ""} />
          <Field help="优先填写紧急情况下能快速接电话的人。" label="家庭紧急联系人姓名" onChange={(value) => update({ familyContactName: value })} required value={parent.familyContactName} />
          <Field help="建议包含国家区号，例如 +86 或 +1。" label="家庭紧急联系人电话" onChange={(value) => update({ familyContactPhone: value })} required value={parent.familyContactPhone} />
          <Field help="写给医生看的沟通提示，例如“需要普通话翻译”“家人知道更多病史”。不要上传或粘贴完整病历。" label="给医生的备注（可选）" onChange={(value) => update({ doctorNotes: value })} textarea value={parent.doctorNotes ?? ""} />
          <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row">
            <Button onClick={submit}>保存并生成学生链接</Button>
            <Button onClick={copyLink} variant="secondary">
              {copied ? "已复制链接" : "复制学生分享链接"}
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}

export default function ParentFormPage() {
  return (
    <Suspense>
      <ParentForm />
    </Suspense>
  );
}
