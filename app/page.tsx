import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { Shell } from "@/components/Shell";
import { ClipboardCheck, Link2, MessageCircle, Printer } from "lucide-react";

export default function LandingPage() {
  const steps = [
    ["家长先填", "家长补充姓名、医疗史和家庭联系人。", ClipboardCheck],
    ["学生确认", "学生打开链接补充学校、位置和本地联系人。", Link2],
    ["共同维护", "双方在共享工作区确认、标记不确定或请求对方核实。", MessageCircle],
    ["导出备用", "生成英文应急卡、只读页面、PNG 和 PDF。", Printer]
  ] as const;

  return (
    <Shell>
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="py-4 sm:py-10">
          <p className="inline-flex rounded-md border border-teal-100 bg-mist px-3 py-1 text-sm font-bold text-calm">
            中国留学生家庭应急准备
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-6xl">
            让家长和学生一起维护一份安心应急包
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700">
            SafeAbroad 把家庭知道的信息、学生在美国本地的信息合并成一个共享工作区，再生成英文应急卡片和中文说明。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/parent/start">开始创建应急包</Button>
            <Button href="/privacy" variant="secondary">
              查看隐私与免责声明
            </Button>
          </div>
        </div>
        <div className="rounded-md border border-white/70 bg-white/85 p-4 shadow-sm ring-1 ring-line/50 backdrop-blur">
          <div className="rounded-md bg-ink p-5 text-white">
            <p className="text-sm font-semibold text-teal-100">Emergency card preview</p>
            <p className="mt-4 text-2xl font-black leading-9">
              I need help. I need a Mandarin interpreter.
            </p>
            <p className="mt-5 border-t border-white/20 pt-4 text-sm leading-6 text-gray-200">
              给 911、急诊、学校或可信联系人看的英文应急表达。每张卡都显示最后更新时间。
            </p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {steps.map(([title, body, Icon]) => (
              <div className="rounded-md border border-line bg-paper p-4" key={title}>
                <Icon className="h-5 w-5 text-calm" />
                <h2 className="mt-3 font-bold text-ink">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mt-6">
        <Notice />
      </div>
    </Shell>
  );
}
