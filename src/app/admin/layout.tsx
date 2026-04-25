"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/editor", label: "Editor" },
  { href: "/admin/stats", label: "Stats" },
];

function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-4 font-mono text-xs transition-colors ${
                  isActive
                    ? "font-semibold text-foreground border-b-2 border-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] text-muted transition-colors hover:text-foreground"
          >
            View Site &nearr;
          </Link>
          <span className="font-mono text-[10px] text-muted/40">
            hammadhassan.com
          </span>
        </div>
      </div>
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <>
      {!isLogin && <AdminNav />}
      {children}
    </>
  );
}
