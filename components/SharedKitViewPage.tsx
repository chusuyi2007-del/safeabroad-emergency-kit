"use client";

import { KitLoader } from "@/components/KitLoader";
import { SharedKitView } from "@/components/SharedKitView";
import { Shell } from "@/components/Shell";

export function SharedKitViewPage({ kitId }: { kitId: string }) {
  return (
    <KitLoader token={kitId}>
      {(kit) => (
        <Shell>
          <SharedKitView kit={kit} />
        </Shell>
      )}
    </KitLoader>
  );
}
