"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { KitLoader } from "@/components/KitLoader";
import { KitWorkspaceEditor } from "@/components/KitWorkspaceEditor";
import { Shell } from "@/components/Shell";

function EditPageContent({ kitId }: { kitId: string }) {
  const params = useSearchParams();
  const token = params.get("token") ?? kitId;

  return (
    <KitLoader token={token}>
      {(kit) => (
        <Shell>
          <KitWorkspaceEditor initialKit={kit} />
        </Shell>
      )}
    </KitLoader>
  );
}

export default function KitEditPage({ params }: { params: { kitId: string } }) {
  return (
    <Suspense>
      <EditPageContent kitId={params.kitId} />
    </Suspense>
  );
}
