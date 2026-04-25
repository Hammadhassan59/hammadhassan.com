import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown";
import { articles, getArticleBySlug } from "@/lib/articles";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimateIn from "@/components/AnimateIn";
import ViewTracker from "@/components/ViewTracker";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

function getRelatedArticles(currentSlug: string, category: string) {
  return articles
    .filter((a) => a.slug !== currentSlug)
    .filter((a) => a.category === category)
    .slice(0, 2);
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article.slug, article.category);
  const allOther = related.length < 2
    ? [
        ...related,
        ...articles
          .filter((a) => a.slug !== article.slug && !related.find((r) => r.slug === a.slug))
          .slice(0, 2 - related.length),
      ]
    : related;

  return (
    <div>
      <ViewTracker slug={slug} />
      {/* Back navigation */}
      <div className="mx-auto max-w-[1200px] px-6 pt-10">
        <Link
          href="/articles"
          className="font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          &larr; All articles
        </Link>
      </div>

      {/* Article Header */}
      <header className="mx-auto max-w-[700px] px-6 pt-16 pb-12 md:pt-24 md:pb-16 hero-enter">
        <div className="flex items-center gap-4">
          <span className="border border-border px-3 py-1 font-mono text-xs">
            {article.category}
          </span>
          <span className="font-mono text-xs text-muted">{article.date}</span>
          <span className="font-mono text-xs text-muted">
            {article.readingTime}
          </span>
        </div>
        <h1 className="mt-8 text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted" style={{ fontFamily: "var(--font-serif)" }}>
          {article.excerpt}
        </p>
      </header>

      {/* Divider */}
      <div className="mx-auto max-w-[700px] px-6">
        <div className="border-t border-border" />
      </div>

      {/* Article Body */}
      <AnimateIn className="mx-auto max-w-[700px] px-6 pt-12 pb-16">
        <Markdown
          components={{
            h2: ({ children }) => (
              <h2 className="mb-4 mt-14 text-2xl font-semibold tracking-tight text-foreground first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-3 mt-10 text-xl font-semibold tracking-tight text-foreground">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p
                className="mb-7 text-[1.125rem] leading-[1.75] text-foreground/70"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {children}
              </p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic">{children}</em>
            ),
            ol: ({ children }) => (
              <ol
                className="mb-7 list-decimal space-y-3 pl-6 text-[1.125rem] leading-[1.75] text-foreground/70"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {children}
              </ol>
            ),
            ul: ({ children }) => (
              <ul
                className="mb-7 list-disc space-y-3 pl-6 text-[1.125rem] leading-[1.75] text-foreground/70"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {children}
              </ul>
            ),
            li: ({ children }) => <li className="pl-1">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className="my-10 border-l-[3px] border-foreground/20 py-1 pl-6 text-[1.125rem] italic leading-[1.75] text-foreground/50"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {children}
              </blockquote>
            ),
            hr: () => (
              <hr className="my-12 border-t border-border" />
            ),
          }}
        >
          {article.content}
        </Markdown>
      </AnimateIn>

      {/* Pull quote / punchline */}
      <AnimateIn className="mx-auto max-w-[700px] px-6 py-10">
        <div className="border-y border-foreground py-10 text-center">
          <p
            className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl lg:text-[2rem] lg:leading-snug"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &ldquo;{article.punchline || article.excerpt}&rdquo;
          </p>
        </div>
      </AnimateIn>

      {/* Newsletter CTA */}
      <AnimateIn className="mx-auto max-w-[700px] px-6 pt-6 pb-14">
        <NewsletterSignup />
      </AnimateIn>

      {/* Related Articles */}
      {allOther.length > 0 && (
        <AnimateIn className="border-t border-border">
          <div className="mx-auto max-w-[1200px] px-6 py-14">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Keep Reading
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {allOther.map((related) => (
                <Link
                  key={related.slug}
                  href={`/articles/${related.slug}`}
                  className="group block"
                >
                  <div className="flex h-full flex-col border border-border bg-card p-8 transition-all duration-200 hover:bg-foreground hover:text-background md:p-10">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted group-hover:text-background/50">
                        {related.date}
                      </span>
                      <span className="border border-current px-3 py-1 font-mono text-xs group-hover:border-background/50 group-hover:text-background/50">
                        {related.category}
                      </span>
                    </div>
                    <h3 className="mt-5 flex-1 text-xl font-semibold leading-tight tracking-tight md:text-2xl">
                      {related.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted group-hover:text-background/60">
                      {related.excerpt}
                    </p>
                    <div className="mt-6">
                      <span className="font-mono text-xs text-muted group-hover:text-background/50">
                        <span className="font-semibold">Read</span> &middot;{" "}
                        {related.readingTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </AnimateIn>
      )}
    </div>
  );
}
