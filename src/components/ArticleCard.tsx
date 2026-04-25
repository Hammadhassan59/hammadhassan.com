import Link from "next/link";
import type { Article } from "@/lib/articles";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <article className="flex h-full flex-col border border-border bg-card p-6 transition-all duration-200 hover:bg-foreground hover:text-background md:p-10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted group-hover:text-background/50">
            {article.date}
          </span>
          <span className="border border-current px-3 py-1 font-mono text-xs group-hover:border-background/50 group-hover:text-background/50">
            {article.category}
          </span>
        </div>
        <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {article.title}
        </h3>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted group-hover:text-background/60">
          {article.excerpt}
        </p>
        <div className="mt-8">
          <span className="font-mono text-xs text-muted group-hover:text-background/50">
            <span className="font-semibold">Read</span> &middot; {article.readingTime}
          </span>
        </div>
      </article>
    </Link>
  );
}
