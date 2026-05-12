"use client";

import { Button } from "@/components/Button";
import { DeleteKitButton } from "@/components/DeleteKitButton";
import { KitLoader } from "@/components/KitLoader";
import { Notice } from "@/components/Notice";
import { Progress } from "@/components/Progress";
import { Shell } from "@/components/Shell";

export default function ReviewPage({ params }: { params: { token: string } }) {
  return (
    <KitLoader token={params.token}>
      {(kit) => (
        <Shell>
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-ink">合并检查</h1>
              <p className="mt-2 text-gray-700">确认家长和学生两边的信息都已完成，然后生成最终应急卡。</p>
            </div>
            <Progress parentComplete={kit.parentComplete} studentComplete={kit.studentComplete} />
            <Notice />
            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-md border border-line bg-white p-5">
                <h2 className="text-xl font-bold text-ink">家长部分</h2>
                <dl className="mt-4 space-y-2 text-sm text-gray-700">
                  <div><dt className="font-semibold">学生姓名</dt><dd>{kit.parent.studentEnglishName || "未填写"} / {kit.parent.studentChineseName || "未填写"}</dd></div>
                  <div><dt className="font-semibold">家庭联系人</dt><dd>{kit.parent.familyContactName || "未填写"} {kit.parent.familyContactPhone || ""}</dd></div>
                  <div><dt className="font-semibold">偏好语言</dt><dd>{kit.parent.preferredLanguage}</dd></div>
                </dl>
                <div className="mt-5">
                  <Button href={`/parent/form?token=${kit.token}`} variant="secondary">编辑家长信息</Button>
                </div>
              </section>
              <section className="rounded-md border border-line bg-white p-5">
                <h2 className="text-xl font-bold text-ink">学生部分</h2>
                <dl className="mt-4 space-y-2 text-sm text-gray-700">
                  <div><dt className="font-semibold">学校</dt><dd>{kit.student.school || "未填写"}</dd></div>
                  <div><dt className="font-semibold">地址</dt><dd>{kit.student.address || "未填写"} {kit.student.floorRoom || ""}</dd></div>
                  <div><dt className="font-semibold">美国联系人</dt><dd>{kit.student.usContactName || "未填写"} {kit.student.usContactPhone || ""}</dd></div>
                </dl>
                <div className="mt-5">
                  <Button href={`/student/${kit.token}/form`} variant="secondary">编辑学生信息</Button>
                </div>
              </section>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={`/kit/${kit.kitId}/edit?token=${kit.token}`}>打开共享编辑工作区</Button>
              <DeleteKitButton token={kit.token} />
            </div>
          </div>
        </Shell>
      )}
    </KitLoader>
  );
}
