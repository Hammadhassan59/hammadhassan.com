import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <p className="font-mono text-sm font-semibold tracking-tight">
              HAMMAD HASSAN
            </p>
            <p className="mt-4 text-sm text-background/60">
              I start businesses and write about what I learn.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-background/40">
              Navigate
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/articles" className="text-sm text-background/60 transition-colors hover:text-background">
                Articles
              </Link>
              <Link href="/newsletter" className="text-sm text-background/60 transition-colors hover:text-background">
                Newsletter
              </Link>
              <Link href="/about" className="text-sm text-background/60 transition-colors hover:text-background">
                About
              </Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-background/40">
              Connect
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href="https://x.com/hammadhassanx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-background/60 transition-colors hover:text-background"
              >
                Twitter / X
              </a>
              <a
                href="https://linkedin.com/in/hammadhassan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-background/60 transition-colors hover:text-background"
              >
                LinkedIn
              </a>
              <a
                href="mailto:hello@hammadhassan.com"
                className="text-sm text-background/60 transition-colors hover:text-background"
              >
                Email
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-background/10 pt-8">
          <p className="font-mono text-xs text-background/30">
            &copy; 2026 Hammad Hassan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
