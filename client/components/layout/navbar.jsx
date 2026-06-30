"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Clock3, Bookmark, Plus } from "lucide-react";

const navItems = [
  { label: "Explore", href: "/explore", icon: Home },
  { label: "History", href: "/history", icon: Clock3 },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Create", href: "/create", icon: Plus, highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/" || pathname === "/landing") {
    return null;
  }

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] px-5 sm:px-8 py-5 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between">
          <Link href="/explore" className="text-white text-lg font-semibold tracking-tight">
            TechReel
          </Link>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-[100] px-5 sm:px-8 pb-5 pointer-events-none">
        <div className="pointer-events-auto mx-auto flex w-full max-w-md items-center justify-between rounded-full border border-white/12 bg-white/10 backdrop-blur-3xl px-3 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95 ${item.highlight ? "bg-white text-black" : active ? "bg-white/20 text-white" : "text-white/70 hover:text-white"}`}
                aria-label={item.label}
              >
                <Icon size={18} />
              </Link>
            );
          })}

        </div>
      </nav>
    </>
  );
}
