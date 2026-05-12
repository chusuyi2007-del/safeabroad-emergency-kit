"use client";

import { Copy, Printer } from "lucide-react";
import { CardPreview } from "@/components/CardPreview";
import { buildCards, lockScreenText, updatedDate } from "@/lib/cards";
import type { KitRecord } from "@/lib/types";

function CopyButton({ text }: { text: string }) {
  return (
    <button
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-calm"
      onClick={() => navigator.clipboard.writeText(text)}
      type="button"
    >
      <Copy className="h-4 w-4" />
      复制
    </button>
  );
}

export function SharedKitView({ kit }: { kit: KitRecord }) {
  const cards = buildCards(kit);

  if (kit.workspace?.viewRevoked) {
    return (
      <div className="mx-auto max-w-2xl rounded-md border border-line bg-white p-5">
        <h1 className="text-2xl font-bold text-ink">共享查看链接已撤销</h1>
        <p className="mt-3 leading-7 text-gray-700">这个只读页面目前不可用。请联系应急包创建者获取新的链接。</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-amber-200 bg-[#fff8e8] p-4 text-sm font-bold leading-6 text-amber-950 shadow-sm">
        This page may contain sensitive information. Only share with trusted people.
      </section>

      <section className="rounded-md border border-line bg-white p-5 shadow-sm ring-1 ring-white/70">
        <p className="inline-flex rounded-md bg-mist px-3 py-1 text-sm font-bold text-calm">只读共享页面</p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-ink">
          {kit.parent.studentEnglishName || kit.parent.studentChineseName || "Emergency Kit"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">Last updated: {updatedDate(kit)}</p>
        <p className="mt-4 leading-7 text-gray-700">
          本页面只用于整理和沟通应急信息，不替代 911、医疗服务、法律建议、律师、医生、医院或学校官方资源。
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-calm bg-calm px-5 py-3 font-semibold text-white"
            onClick={() => window.print()}
            type="button"
          >
            <Printer className="h-5 w-5" />
            打印
          </button>
        </div>
      </section>

      <article className="rounded-md border border-line bg-ink p-5 text-white shadow-sm">
        <p className="text-sm font-bold uppercase text-teal-100">Lock-screen Card</p>
        <p className="mt-4 text-2xl font-bold leading-9">{lockScreenText(kit)}</p>
        <p className="mt-5 text-sm text-gray-300">Last updated: {updatedDate(kit)}</p>
        <div className="mt-4">
          <CopyButton text={lockScreenText(kit)} />
        </div>
      </article>

      <div className="grid gap-4">
        {cards.map((card) => (
          <div className="space-y-2" key={card.id}>
            <CardPreview card={card} kit={kit} />
            <CopyButton text={`${card.title}\n${card.english}\n${card.chinese}${card.disclaimer ? `\n${card.disclaimer}` : ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
