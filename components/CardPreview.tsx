import { updatedDate } from "@/lib/cards";
import type { EmergencyCard, KitRecord } from "@/lib/types";

export function CardPreview({
  card,
  kit,
  exportId
}: {
  card: EmergencyCard;
  kit: KitRecord;
  exportId?: string;
}) {
  return (
    <article
      className="card-export flex min-h-72 flex-col justify-between rounded-md border border-line p-5"
      id={exportId}
    >
      <div>
        <p className="text-sm font-bold text-calm">{card.title}</p>
        <p className="mt-4 text-xl font-semibold leading-8 text-ink">{card.english}</p>
        <p className="mt-5 border-t border-line pt-4 text-base leading-7 text-gray-700">{card.chinese}</p>
        {card.disclaimer ? <p className="mt-3 text-sm font-semibold text-red-700">{card.disclaimer}</p> : null}
      </div>
      <p className="mt-5 text-sm text-gray-500">Last updated: {updatedDate(kit)}</p>
    </article>
  );
}
