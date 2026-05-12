"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Shell } from "@/components/Shell";
import { loadKit } from "@/lib/kit-store";
import type { KitRecord } from "@/lib/types";

export function KitLoader({
  token,
  children
}: {
  token: string;
  children: (kit: KitRecord) => ReactNode;
}) {
  const [kit, setKit] = useState<KitRecord | null | undefined>(undefined);

  useEffect(() => {
    async function run() {
      setKit(await loadKit(token));
    }
    run();
  }, [token]);

  if (kit === undefined) {
    return (
      <Shell>
        <p>正在加载...</p>
      </Shell>
    );
  }

  if (kit === null) {
    return (
      <Shell>
        <div className="mx-auto max-w-2xl rounded-md border border-line bg-white p-5">
          <h1 className="text-2xl font-bold text-ink">找不到应急包</h1>
          <p className="mt-3 text-gray-700">链接可能已过期或数据已被删除。</p>
        </div>
      </Shell>
    );
  }

  return <>{children(kit)}</>;
}
