import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles, categories } from "@/lib/articles";
import CategoryFilter from "@/components/CategoryFilter";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimateIn from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Essays on business, marketing, human behavior, and the lessons that come from building things.",
};

export default function ArticlesPage() {
  const allArticles = getAllArticles();
  const featured = allArticles[0];
  const rest = allArticles.slice(1);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero */}
      <section className="pt-16 pb-14 md:pt-24 md:pb-20 hero-enter">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          {allArticles.length} essays and counting
        </p>
        <h1 className="mt-4 text-6xl font-semibold leading-[1.05] tracking-tighter md:text-8xl lg:text-[9rem]">
          ARTICLES
        </h1>
        <p
          className="mt-6 max-w-lg text-xl leading-relaxed text-muted"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Everything I&apos;ve written about business, marketing, human
          behavior, and the founder journey. Start anywhere.
        </p>
      </section>

      {/* Featured / latest article — full width */}
      {featured && (
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Featured
        </h2>
        <Link
          href={`/articles/${featured.slug}`}
          className="group mt-8 block border border-border bg-card transition-all duration-200 hover:bg-foreground hover:text-background"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <div className="flex items-center gap-4">
                  <span className="border border-current px-3 py-1 font-mono text-xs group-hover:border-background/50 group-hover:text-background/50">
                    {featured.category}
                  </span>
                  <span className="font-mono text-xs text-muted group-hover:text-background/50">
                    {featured.date}
                  </span>
                </div>
                <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  {featured.title}
                </h3>
                <p
                  className="mt-4 text-lg leading-relaxed text-muted group-hover:text-background/60"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {featured.excerpt}
                </p>
              </div>
              <div className="mt-8">
                <span className="font-mono text-xs text-muted group-hover:text-background/50">
                  <span className="font-semibold">Read</span> &middot;{" "}
                  {featured.readingTime}
                </span>
              </div>
            </div>
            <div className="hidden border-l border-border bg-foreground/[0.03] p-12 group-hover:border-background/10 group-hover:bg-background/5 md:flex md:items-center md:justify-center">
              <p
                className="text-2xl font-medium leading-snug tracking-tight text-foreground/20 group-hover:text-background/20"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                &ldquo;{featured.excerpt.split(".")[0]}.&rdquo;
              </p>
            </div>
          </div>
        </Link>
      </AnimateIn>
      )}

      {/* All articles with filter */}
      <AnimateIn className="border-t border-border pt-12">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          All Articles
        </h2>
        <div className="mt-8">
          <CategoryFilter articles={rest} categories={categories} />
        </div>
      </AnimateIn>

      {/* CTA */}
      <AnimateIn className="pb-14">
        <NewsletterSignup />
      </AnimateIn>
    </div>
  );
}
