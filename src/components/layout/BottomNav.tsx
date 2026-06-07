"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/pecas", icon: "checkroom", label: "Peças" },
  { href: "/meus-looks", icon: "favorite", label: "Meus Looks" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-200
                ${isActive
                  ? "text-primary scale-105"
                  : "text-muted hover:text-foreground"
                }
              `}
            >
              <span className="material-icons-outlined text-xl">
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
