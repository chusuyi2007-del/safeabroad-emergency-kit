"use client";

import { Bandage, Circle, Pill, Syringe } from "lucide-react";

const items = [
  {
    title: "片剂 / Tablet",
    note: "记录药名、剂量、颜色、形状、药瓶标签关键词",
    icon: Pill,
    color: "bg-white"
  },
  {
    title: "胶囊 / Capsule",
    note: "记录两端颜色、剂量、每天几次",
    icon: Circle,
    color: "bg-mist"
  },
  {
    title: "吸入器 / Inhaler",
    note: "记录品牌名、剂量、使用频率",
    icon: Bandage,
    color: "bg-sky-50"
  },
  {
    title: "注射笔 / Injector",
    note: "记录药名、剂量、是否随身携带",
    icon: Syringe,
    color: "bg-amber-50"
  }
];

export function MedicationVisualGuide() {
  return (
    <section className="rounded-md border border-line bg-white p-4">
      <h3 className="text-base font-bold text-ink">常见药品记录参考</h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        下面只是帮助你记录药品外观和标签信息，不是用药建议。请按药瓶标签、医生说明或本人已知信息填写。
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ title, note, icon: Icon, color }) => (
          <div className="flex gap-3 rounded-md border border-line bg-paper p-3" key={title}>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line ${color}`}>
              <Icon className="h-5 w-5 text-calm" />
            </span>
            <div>
              <p className="font-bold text-ink">{title}</p>
              <p className="mt-1 text-sm leading-5 text-gray-600">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
