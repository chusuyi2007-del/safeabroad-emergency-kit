import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-3 z-20 flex items-center justify-between gap-4 rounded-md border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <Link href="/" className="inline-flex items-center gap-2 text-base font-bold text-ink">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-calm text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>SafeAbroad</span>
          </Link>
          <Link href="/privacy" className="rounded-md px-3 py-2 text-sm font-semibold text-calm hover:bg-mist">
            隐私与说明
          </Link>
        </header>
        <div className="flex-1 py-8 sm:py-10">{children}</div>
      </div>
    </main>
  );
}
