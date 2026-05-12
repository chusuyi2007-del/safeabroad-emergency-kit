"use client";

import { Button } from "@/components/Button";
import { CardPreview } from "@/components/CardPreview";
import { DeleteKitButton } from "@/components/DeleteKitButton";
import { KitLoader } from "@/components/KitLoader";
import { Progress } from "@/components/Progress";
import { Shell } from "@/components/Shell";
import { buildCards, lockScreenText, updatedDate } from "@/lib/cards";

export default function CardsPage({ params }: { params: { token: string } }) {
  return (
    <KitLoader token={params.token}>
      {(kit) => {
        const cards = buildCards(kit);

        return (
          <Shell>
            <div className="space-y-6">
              <div className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold text-ink">最终应急卡预览</h1>
                <p className="mt-2 text-gray-700">每张卡都包含英文应急表达、中文解释和最后更新时间。</p>
              </div>
              <Progress parentComplete={kit.parentComplete} studentComplete={kit.studentComplete} />
              <div className="grid gap-4 lg:grid-cols-2">
                {cards.map((card) => (
                  <CardPreview card={card} exportId={`card-${card.id}`} key={card.id} kit={kit} />
                ))}
              </div>
              <section className="rounded-md border border-line bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-calm">Lock-screen Card</p>
                <p className="mt-3 text-xl font-semibold leading-8">{lockScreenText(kit)}</p>
                <p className="mt-4 text-sm text-gray-500">Last updated: {updatedDate(kit)}</p>
              </section>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href={`/export/${kit.token}`}>前往导出</Button>
                <Button href={`/kit/${kit.kitId}/edit?token=${kit.token}`} variant="secondary">返回共享工作区</Button>
                <DeleteKitButton token={kit.token} />
              </div>
            </div>
          </Shell>
        );
      }}
    </KitLoader>
  );
}
