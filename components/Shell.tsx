import Link from "next/link";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-paper/95 py-4">
          <Link href="/" className="inline-flex items-baseline gap-2 text-base font-bold text-ink">
            <span>SafeAbroad</span>
            <span className="text-xs font-semibold text-gray-500">Emergency Kit</span>
          </Link>
          <Link href="/privacy" className="text-sm font-semibold text-calm hover:underline">
            隐私与说明
          </Link>
        </header>
        <div className="flex-1 py-8 sm:py-10">{children}</div>
      </div>
    </main>
  );
}
