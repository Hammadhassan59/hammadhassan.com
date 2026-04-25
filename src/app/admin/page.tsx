"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardData {
  stats: {
    total: number;
    today: number;
    week: number;
    month: number;
  };
  dailyViews: { date: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  content: {
    total: number;
    published: number;
    drafts: number;
    totalWords: number;
    avgReadingTime: number;
    avgViewsPerArticle: number;
    topCategory: { name: string; count: number } | null;
    categories: Record<string, number>;
  };
  articles: {
    slug: string;
    title: string;
    category: string;
    date: string;
    published: boolean;
    readingTime: string;
    excerpt: string;
    views: number;
    viewsToday: number;
    viewsWeek: number;
  }[];
}

function MiniChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-[2px] h-20">
      {data.map((d) => (
        <div
          key={d.date}
          className="flex-1 bg-foreground/15 hover:bg-foreground/30 transition-colors relative group"
          style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
        >
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background px-2 py-0.5 text-[10px] font-mono whitespace-nowrap z-10">
            {d.date.slice(5)}: {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((d) => { if (d) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <p className="font-mono text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (!data) return null;

  const topArticles = [...data.articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  const recentArticles = data.articles.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20">
      {/* Header */}
      <div className="pt-10 pb-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Creator Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Welcome back, Hammad.
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Link
          href="/admin/editor"
          className="group border border-border bg-card p-6 transition-all hover:bg-foreground hover:text-background"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-background/50">
              Write
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></svg>
          </div>
          <p className="mt-3 text-lg font-semibold tracking-tight">
            New Article
          </p>
        </Link>

        <Link
          href="/admin/editor"
          className="group border border-border bg-card p-6 transition-all hover:bg-foreground hover:text-background"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-background/50">
              Manage
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
          </div>
          <p className="mt-3 text-lg font-semibold tracking-tight">
            All Articles
          </p>
        </Link>

        <Link
          href="/admin/stats"
          className="group border border-border bg-card p-6 transition-all hover:bg-foreground hover:text-background"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-background/50">
              Analytics
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
          </div>
          <p className="mt-3 text-lg font-semibold tracking-tight">
            Full Stats
          </p>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="group border border-border bg-card p-6 transition-all hover:bg-foreground hover:text-background"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-background/50">
              Preview
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 group-hover:opacity-60"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </div>
          <p className="mt-3 text-lg font-semibold tracking-tight">
            View Site
          </p>
        </Link>
      </div>

      {/* Stats + Content Overview */}
      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Traffic Overview */}
        <div className="border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Traffic — Last 30 Days
            </p>
            <Link
              href="/admin/stats"
              className="font-mono text-[10px] text-muted transition-colors hover:text-foreground"
            >
              Details
            </Link>
          </div>

          {/* Stat numbers */}
          <div className="mt-5 grid grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {data.stats.total.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-muted">Total</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {data.stats.today.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-muted">Today</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {data.stats.week.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-muted">7 days</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {data.stats.month.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-muted">30 days</p>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6">
            <MiniChart data={data.dailyViews} />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted/50">
            <span>{data.dailyViews[0]?.date.slice(5)}</span>
            <span>{data.dailyViews[data.dailyViews.length - 1]?.date.slice(5)}</span>
          </div>
        </div>

        {/* Content Status */}
        <div className="border border-border bg-card p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Content
          </p>
          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {data.content.total}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted">
                  Articles
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight">
                  {data.content.totalWords.toLocaleString()}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted">
                  Words Written
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {data.content.avgReadingTime}<span className="text-sm font-normal text-muted ml-1">min</span>
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted">
                  Avg Read Time
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {data.content.avgViewsPerArticle}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted">
                  Avg Views / Article
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Published</span>
                <span className="font-mono text-sm font-semibold">
                  {data.content.published}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm">Drafts</span>
                <span className="font-mono text-sm font-semibold">
                  {data.content.drafts}
                </span>
              </div>
            </div>

            {/* Visual bar */}
            {data.content.total > 0 && (
              <div className="flex h-2 overflow-hidden bg-foreground/5">
                <div
                  className="bg-foreground transition-all"
                  style={{
                    width: `${(data.content.published / data.content.total) * 100}%`,
                  }}
                />
                <div
                  className="bg-foreground/20 transition-all"
                  style={{
                    width: `${(data.content.drafts / data.content.total) * 100}%`,
                  }}
                />
              </div>
            )}
            <div className="flex items-center gap-4 font-mono text-[10px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 bg-foreground" /> Published
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 bg-foreground/20" /> Drafts
              </span>
            </div>

            {/* Top category */}
            {data.content.topCategory && (
              <div className="border-t border-border pt-4">
                <p className="font-mono text-[10px] text-muted mb-2">Top Category</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.content.topCategory.name}</span>
                  <span className="font-mono text-xs text-muted">
                    {data.content.topCategory.count} article{data.content.topCategory.count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two columns: Top Performing + Recent */}
      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Top Performing Articles */}
        <div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Top Performing
            </p>
            <Link
              href="/admin/stats"
              className="font-mono text-[10px] text-muted transition-colors hover:text-foreground"
            >
              All stats
            </Link>
          </div>
          {topArticles.length === 0 ? (
            <div className="mt-4 border border-border bg-card p-6">
              <p className="text-sm text-muted">No views yet.</p>
            </div>
          ) : (
            <div className="mt-4 border-y border-border divide-y divide-border">
              {topArticles.map((article, i) => {
                const maxViews = topArticles[0]?.views || 1;
                return (
                  <div key={article.slug} className="relative py-3.5 px-4">
                    <div
                      className="absolute inset-y-0 left-0 bg-foreground/[0.03]"
                      style={{ width: `${(article.views / maxViews) * 100}%` }}
                    />
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-[10px] text-muted w-4 shrink-0">
                          {i + 1}
                        </span>
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="text-sm font-medium truncate hover:underline"
                        >
                          {article.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {article.viewsToday > 0 && (
                          <span className="font-mono text-[10px] text-muted">
                            +{article.viewsToday} today
                          </span>
                        )}
                        <span className="font-mono text-xs font-semibold w-8 text-right">
                          {article.views}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Articles */}
        <div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Recent Articles
            </p>
            <Link
              href="/admin/editor"
              className="font-mono text-[10px] text-muted transition-colors hover:text-foreground"
            >
              Manage
            </Link>
          </div>
          {recentArticles.length === 0 ? (
            <div className="mt-4 border border-border bg-card p-6">
              <p className="text-sm text-muted">No articles yet.</p>
              <Link
                href="/admin/editor"
                className="mt-2 inline-block font-mono text-xs font-semibold transition-colors hover:text-muted"
              >
                Write your first article
              </Link>
            </div>
          ) : (
            <div className="mt-4 border-y border-border divide-y divide-border">
              {recentArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/admin/editor`}
                  className="flex items-center justify-between gap-3 py-3.5 px-4 transition-colors hover:bg-card"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {article.title}
                      </span>
                      {!article.published && (
                        <span className="shrink-0 border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted">
                        {article.category}
                      </span>
                      <span className="font-mono text-[10px] text-muted">
                        {article.date}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted">
                    {article.views} views
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Referrers */}
      {data.topReferrers.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Where Readers Come From
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data.topReferrers.slice(0, 6).map((ref) => (
              <div
                key={ref.source}
                className="flex items-center justify-between border border-border bg-card px-4 py-3"
              >
                <span className="text-sm truncate pr-3">
                  {ref.source === "Direct" ? "Direct / Bookmarks" : ref.source}
                </span>
                <span className="font-mono text-xs font-semibold shrink-0">
                  {ref.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
