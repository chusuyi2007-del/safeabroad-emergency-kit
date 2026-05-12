"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { Shell } from "@/components/Shell";
import { createKit } from "@/lib/kit-store";

export default function ParentStartPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    const kit = await createKit();
    router.push(`/parent/form?token=${kit.token}`);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-ink">家长开始创建应急包</h1>
        <p className="mt-4 leading-7 text-gray-700">
          先填写家长通常知道的信息。提交后会生成一个学生分享链接，让学生补充美国电话、住址、学校和本地联系人。
        </p>
        <div className="mt-6">
          <Notice />
        </div>
        <div className="mt-6">
          <Button disabled={busy} onClick={start}>
            {busy ? "正在创建..." : "创建新的应急包"}
          </Button>
        </div>
      </div>
    </Shell>
  );
}
