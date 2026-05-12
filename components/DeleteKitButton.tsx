"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { deleteKit } from "@/lib/kit-store";

export function DeleteKitButton({ token }: { token: string }) {
  const router = useRouter();

  async function remove() {
    const ok = window.confirm("确定删除这个应急包数据吗？导出的 PNG/PDF 不会被删除。");
    if (!ok) return;
    await deleteKit(token);
    router.push("/");
  }

  return (
    <Button onClick={remove} variant="danger">
      删除应急包数据
    </Button>
  );
}
