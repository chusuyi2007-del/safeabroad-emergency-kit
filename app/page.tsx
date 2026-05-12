import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { Shell } from "@/components/Shell";

export default function LandingPage() {
  const steps = [
    ["1", "家长先填", "姓名、家庭联系人、已知医疗史"],
    ["2", "学生补充", "美国电话、学校、住址、本地联系人"],
    ["3", "一起确认", "标记已确认、不确定、需要谁确认"],
    ["4", "导出备用", "只读页面、PNG、PDF、钱包卡"]
  ] as const;

  return (
    <Shell>
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="py-2 sm:py-8">
          <p className="text-sm font-bold text-calm">中国留学生家庭应急准备</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-ink sm:text-5xl">
            家长和学生共用的一份应急信息清单
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-700">
            SafeAbroad 用来整理紧急联系人、住址、医疗沟通信息和几张常用英文应急卡。它是准备工具，不是医疗或法律服务。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/parent/start">开始创建应急包</Button>
            <Button href="/privacy" variant="secondary">
              查看隐私与免责声明
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="border-b border-line pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-ink">共享工作区示例</p>
                <p className="mt-1 text-sm text-gray-500">Emergency Kit for Student</p>
              </div>
              <span className="rounded-md border border-teal-200 bg-mist px-3 py-1 text-sm font-bold text-calm">64%</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              ["学生英文名", "已确认", "parent"],
              ["宿舍/公寓地址", "需要学生确认", "student"],
              ["当前用药", "建议医生核实", "student"],
              ["家庭紧急联系人", "已确认", "parent"]
            ].map(([label, status, source]) => (
              <div className="grid grid-cols-[1fr_auto] gap-3 rounded-md border border-line bg-paper px-3 py-3" key={label}>
                <div>
                  <p className="font-semibold text-ink">{label}</p>
                  <p className="mt-1 text-xs text-gray-500">来源：{source}</p>
                </div>
                <p className="self-center rounded-md bg-white px-2 py-1 text-xs font-bold text-gray-700">{status}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <p className="text-sm font-bold text-ink">流程</p>
            <div className="mt-3 grid gap-2">
              {steps.map(([number, title, body]) => (
                <div className="grid grid-cols-[2rem_1fr] gap-3 text-sm" key={title}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white font-bold text-calm">
                    {number}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{title}</p>
                    <p className="mt-1 leading-6 text-gray-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-line bg-white p-4">
              <p className="text-sm font-bold text-ink">911 Card</p>
              <p className="mt-2 text-base font-semibold leading-7 text-gray-800">
                I need help. I need a Mandarin interpreter.
              </p>
              <p className="mt-2 text-xs text-gray-500">Last updated: May 12, 2026</p>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-6">
        <Notice />
      </div>
    </Shell>
  );
}
