"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/collection", label: "Collection", icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2 border-t border-white/10 bg-slate-950/90 backdrop-blur-lg pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
      <div className="flex items-stretch justify-around px-2 pt-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-colors"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                    : "text-slate-400"
                }`}
              >
                <Icon size={18} strokeWidth={2.25} />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
