import type { Metadata } from "next";
import { SharedKitViewPage } from "@/components/SharedKitViewPage";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function KitViewPage({ params }: { params: { kitId: string } }) {
  return <SharedKitViewPage kitId={params.kitId} />;
}
