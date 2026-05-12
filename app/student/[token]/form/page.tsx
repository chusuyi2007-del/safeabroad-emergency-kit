"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { DetailChoiceField, Field } from "@/components/Field";
import { Notice } from "@/components/Notice";
import { Progress } from "@/components/Progress";
import { Shell } from "@/components/Shell";
import { emptyKit } from "@/lib/defaults";
import { loadKit, saveKit } from "@/lib/kit-store";
import type { KitRecord, StudentInfo } from "@/lib/types";

export default function StudentFormPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [kit, setKit] = useState<KitRecord | null>(null);

  useEffect(() => {
    async function run() {
      setKit((await loadKit(params.token)) ?? emptyKit(params.token));
    }
    run();
  }, [params.token]);

  if (!kit) {
    return (
      <Shell>
        <p>正在加载...</p>
      </Shell>
    );
  }

  const student = kit.student;

  function update(studentPatch: Partial<StudentInfo>) {
    setKit((current) => (current ? { ...current, student: { ...current.student, ...studentPatch } } : current));
  }

  async function submit() {
    if (!kit) return;
    const saved = await saveKit({ ...kit, studentComplete: true });
    router.push(`/kit/${saved.kitId}/edit?token=${saved.token}`);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">学生信息</h1>
          <p className="mt-2 text-gray-700">填写美国本地应急信息。不确定的地方请选择“不确定”。</p>
        </div>
        <Progress parentComplete={kit.parentComplete} studentComplete={kit.studentComplete} />
        <Notice />
        <form className="grid gap-5 rounded-md border border-line bg-white p-4 sm:p-6" onSubmit={(event) => event.preventDefault()}>
          <Field label="美国手机号" onChange={(value) => update({ usPhone: value })} required value={student.usPhone} />
          <Field label="学校" onChange={(value) => update({ school: value })} required value={student.school} />
          <Field label="宿舍/公寓地址" onChange={(value) => update({ address: value })} required value={student.address} />
          <Field label="楼层/房间" onChange={(value) => update({ floorRoom: value })} value={student.floorRoom} />
          <Field label="附近地标" onChange={(value) => update({ landmark: value })} value={student.landmark} />
          <DetailChoiceField label="当前用药 / Current medications" noneLabel="无 / None" onChange={(medications) => update({ medications })} value={student.medications} />
          <Field label="美国紧急联系人姓名" onChange={(value) => update({ usContactName: value })} required value={student.usContactName} />
          <Field label="美国紧急联系人电话" onChange={(value) => update({ usContactPhone: value })} required value={student.usContactPhone} />
          <Field label="保险计划名称（可选，只写名称）" onChange={(value) => update({ insurancePlan: value })} value={student.insurancePlan ?? ""} />
          <Field label="学生备注（可选）" onChange={(value) => update({ studentNotes: value })} textarea value={student.studentNotes ?? ""} />
          <div className="border-t border-line pt-5">
            <Button onClick={submit}>保存并查看合并结果</Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
