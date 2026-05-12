"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { DetailChoiceField, Field } from "@/components/Field";
import { MedicationVisualGuide } from "@/components/MedicationVisualGuide";
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
          <Field help="填可以联系到你的美国号码。紧急联系人卡和 lock-screen 卡会用到。" label="美国手机号" onChange={(value) => update({ usPhone: value })} required value={student.usPhone} />
          <Field help="写学校常用英文名，例如 UCLA / NYU / University of Michigan。" label="学校" onChange={(value) => update({ school: value })} required value={student.school} />
          <Field help="尽量写到街道地址。这个信息会进入 Location Card，帮助 911 或朋友定位。" label="宿舍/公寓地址" onChange={(value) => update({ address: value })} required value={student.address} />
          <Field help="例如 Floor 4 / Room 405 / Apt 12B。地址很大时，这个很重要。" label="楼层/房间" onChange={(value) => update({ floorRoom: value })} value={student.floorRoom} />
          <Field help="例如 near main library / next to dining hall / across from CVS。可帮助别人快速找到你。" label="附近地标" onChange={(value) => update({ landmark: value })} value={student.landmark} />
          <DetailChoiceField help="只记录当前正在服用或随身携带的药。若不确定药名，请选“不确定”。" label="当前用药 / Current medications" noneLabel="无 / None" onChange={(medications) => update({ medications })} value={student.medications} />
          <section className="rounded-md border border-line bg-paper p-4">
            <h2 className="text-lg font-bold text-ink">药品剂量与服用周期</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              只记录医生、药瓶标签或本人已知的信息。不确定请选择不确定或留空，不要猜。
            </p>
            <div className="mt-4 grid gap-4">
              <Field help="照药瓶标签写，例如 10 mg、500 mg、1 tablet。看不清或不确定就留空。" label="药品剂量（例如 10 mg / 1 tablet）" onChange={(value) => update({ medicationDosage: value })} value={student.medicationDosage ?? ""} />
              <Field help="照实际标签或医生说明写，例如 once daily、twice daily、as needed。不要自行推测。" label="服用频率/周期（例如 once daily / 每晚一次）" onChange={(value) => update({ medicationSchedule: value })} value={student.medicationSchedule ?? ""} />
              <Field help="帮助急诊人员或朋友识别药品：颜色、形状、药瓶上的关键词即可。不要上传完整医疗文件。" label="药品外观备注（颜色、形状、药瓶标签关键词，可选）" onChange={(value) => update({ medicationAppearance: value })} textarea value={student.medicationAppearance ?? ""} />
            </div>
          </section>
          <MedicationVisualGuide />
          <Field help="最好是在美国、能较快接电话并帮助沟通的人。" label="美国紧急联系人姓名" onChange={(value) => update({ usContactName: value })} required value={student.usContactName} />
          <Field help="建议写 +1 开头的完整号码。" label="美国紧急联系人电话" onChange={(value) => update({ usContactPhone: value })} required value={student.usContactPhone} />
          <Field help="只写保险计划名称，例如 Aetna Student Health。不要填写完整保险号或上传保险文件。" label="保险计划名称（可选，只写名称）" onChange={(value) => update({ insurancePlan: value })} value={student.insurancePlan ?? ""} />
          <Field help="写自己希望别人知道的沟通偏好或补充信息。不要写 SSN、护照号、I-20 信息。" label="学生备注（可选）" onChange={(value) => update({ studentNotes: value })} textarea value={student.studentNotes ?? ""} />
          <div className="border-t border-line pt-5">
            <Button onClick={submit}>保存并查看合并结果</Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
