import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <section className="py-32 md:py-48 hero-enter">
        <h1 className="text-6xl font-semibold leading-[1.05] tracking-tighter md:text-8xl">
          404
        </h1>
        <p className="mt-6 text-lg text-muted">
          This page doesn&apos;t exist. Maybe it never did.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="font-mono text-sm font-semibold transition-colors hover:text-muted"
          >
            &larr; Back home
          </Link>
        </div>
      </section>
    </div>
  );
}
