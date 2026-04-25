"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/articles", label: "Articles" },
  { href: "/books", label: "Books" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-border animate-fade-in">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
        >
          Hammad Hassan
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-sm transition-colors hover:text-muted"
              >
                <span className={isActive ? "font-medium" : ""}>
                  {item.label}
                </span>
                {/* Active underline indicator */}
                <span
                  className={`absolute -bottom-[21px] left-0 h-px bg-foreground transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 bg-foreground transition-all duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-foreground transition-all duration-300 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu with slide animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-border px-6 py-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm transition-all duration-200 hover:text-muted ${
                    isActive ? "text-foreground font-medium" : "text-foreground"
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${i * 50}ms` : "0ms",
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? "translateX(0)" : "translateX(-8px)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
