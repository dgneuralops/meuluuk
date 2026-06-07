"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/utils/constants";
import { useDarkMode } from "@/hooks/useDarkMode";
import { CreditBadge } from "@/components/ui/CreditBadge";

export function AppNavbar() {
  const { isDark, toggle, mounted } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/pecas" className="flex items-center gap-3">
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {APP_NAME}
          </span>
          <CreditBadge />
        </Link>
        <div className="flex items-center gap-1">
          {mounted && (
            <button
              type="button"
              onClick={toggle}
              className="p-2 rounded-full hover:bg-surface transition-colors"
              aria-label="Toggle dark mode"
            >
              <span className="material-icons-outlined text-xl text-foreground">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>
          )}
          <Link
            href="/meus-looks"
            className="p-2 rounded-full hover:bg-surface transition-colors"
          >
            <span className="material-icons-outlined text-xl text-foreground">
              favorite
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
