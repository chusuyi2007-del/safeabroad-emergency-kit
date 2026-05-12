import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { Shell } from "@/components/Shell";

export default function StudentSharePage({ params }: { params: { token: string } }) {
  return (
    <Shell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-ink">学生补充信息</h1>
        <p className="mt-4 leading-7 text-gray-700">
          家人已经开始创建应急包。请补充美国本地电话、学校、住址、用药和本地紧急联系人。
        </p>
        <div className="mt-6">
          <Notice />
        </div>
        <div className="mt-6">
          <Button href={`/student/${params.token}/form`}>填写学生信息</Button>
        </div>
      </div>
    </Shell>
  );
}
