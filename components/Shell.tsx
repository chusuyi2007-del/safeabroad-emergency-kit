import Link from "next/link";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <Link href="/" className="text-lg font-bold text-ink">
            SafeAbroad
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-calm">
            隐私与说明
          </Link>
        </header>
        <div className="flex-1 py-6">{children}</div>
      </div>
    </main>
  );
}
