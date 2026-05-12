import { Button } from "@/components/Button";
import { Shell } from "@/components/Shell";

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-ink">隐私与免责声明</h1>
        <div className="mt-5 space-y-4 text-base leading-7 text-gray-700">
          <p>SafeAbroad v1 只帮助用户整理和沟通应急信息，不提供医疗诊断、法律建议或官方资源替代服务。</p>
          <p>紧急情况请优先拨打 911，或联系医生、医院、学校官方资源、律师等合适机构。</p>
          <p>请不要上传护照、I-20、SSN、完整保险文件、医疗文件或其他高敏感文件。本 MVP 只收集卡片所需的最少文字信息。</p>
          <p>数据按临时使用设计。导出后，你可以在页面中点击删除按钮清除应急包数据。</p>
        </div>
        <div className="mt-8">
          <Button href="/parent/start">返回开始</Button>
        </div>
      </div>
    </Shell>
  );
}
