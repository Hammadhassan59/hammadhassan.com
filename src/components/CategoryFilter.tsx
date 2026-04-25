"use client";

import { useState } from "react";
import { type Category, type Article } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function CategoryFilter({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<Category | "All">(
    "All"
  );

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  return (
    <>
      {/* Category Filter */}
      <section className="pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveCategory("All")}
            className={`border px-4 py-2 font-mono text-xs transition-colors ${
              activeCategory === "All"
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`border px-4 py-2 font-mono text-xs transition-colors ${
                activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-mono text-sm text-muted">
              No articles in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
