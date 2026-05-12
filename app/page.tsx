import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { Shell } from "@/components/Shell";

export default function LandingPage() {
  return (
    <Shell>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-calm">中国留学生家庭应急准备</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">
            Family Emergency Kit Generator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-700">
            父母和学生分别补充自己知道的信息，生成可保存、可打印、可分享的英文应急卡片，并附中文解释。
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/parent/start">开始创建应急包</Button>
            <Button href="/privacy" variant="secondary">
              查看隐私与免责声明
            </Button>
          </div>
        </div>
        <div className="rounded-md border border-line bg-white p-5">
          <h2 className="text-xl font-bold text-ink">流程</h2>
          <ol className="mt-4 space-y-3 text-gray-700">
            <li>1. 家长填写已知信息</li>
            <li>2. 生成学生分享链接</li>
            <li>3. 学生补充美国本地信息</li>
            <li>4. 合并生成应急卡</li>
            <li>5. 导出 PNG 和 PDF</li>
          </ol>
        </div>
      </section>
      <div className="mt-6">
        <Notice />
      </div>
    </Shell>
  );
}
