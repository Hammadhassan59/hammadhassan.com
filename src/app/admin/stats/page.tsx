"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  overview: {
    total: number;
    today: number;
    week: number;
    month: number;
  };
  articles: {
    slug: string;
    total: number;
    today: number;
    week: number;
    month: number;
  }[];
  dailyViews: { date: string; count: number }[];
  topReferrers: { source: string; count: number }[];
  contentStats: {
    totalWords: number;
    avgReadingTime: number;
    avgViewsPerArticle: number;
    published: number;
    categories: Record<string, number>;
  };
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border border-border bg-card p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function MiniChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-[2px] h-24">
      {data.map((d) => (
        <div
          key={d.date}
          className="flex-1 bg-foreground/20 hover:bg-foreground/40 transition-colors relative group"
          style={{
            height: `${Math.max((d.count / max) * 100, 2)}%`,
          }}
          title={`${d.date}: ${d.count} views`}
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background px-2 py-1 text-[10px] font-mono whitespace-nowrap z-10">
            {d.count}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load stats");
        return res.json();
      })
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <p className="font-mono text-sm text-muted">Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-20">
        <p className="font-mono text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20">
      {/* Header */}
      <div className="pt-10 pb-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Analytics
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Stats
        </h1>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Views" value={stats.overview.total} />
        <StatCard label="Today" value={stats.overview.today} />
        <StatCard label="Last 7 Days" value={stats.overview.week} />
        <StatCard label="Last 30 Days" value={stats.overview.month} />
      </div>

      {/* Content stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Words Written
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.contentStats.totalWords.toLocaleString()}
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Avg Read Time
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.contentStats.avgReadingTime}<span className="text-lg font-normal text-muted ml-1">min</span>
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Avg Views / Article
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.contentStats.avgViewsPerArticle}
          </p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Published
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {stats.contentStats.published}
          </p>
          {Object.keys(stats.contentStats.categories).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(stats.contentStats.categories).map(([cat, count]) => (
                <span key={cat} className="font-mono text-[10px] text-muted">
                  {cat} ({count})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily views chart */}
      <div className="mt-10 border border-border bg-card p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Views — Last 30 Days
        </p>
        <div className="mt-6">
          <MiniChart data={stats.dailyViews} />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
          <span>{stats.dailyViews[0]?.date.slice(5)}</span>
          <span>{stats.dailyViews[stats.dailyViews.length - 1]?.date.slice(5)}</span>
        </div>
      </div>

      {/* Article rankings */}
      <div className="mt-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Articles by Views
        </p>
        {stats.articles.length === 0 ? (
          <div className="mt-6 border border-border bg-card p-8">
            <p className="text-sm text-muted">
              No views recorded yet. Stats will appear as readers visit your articles.
            </p>
          </div>
        ) : (
          <div className="mt-6 border-y border-border divide-y divide-border">
            {stats.articles.map((article, i) => {
              const maxViews = stats.articles[0]?.total || 1;
              return (
                <div key={article.slug} className="relative py-4 px-4">
                  {/* Background bar */}
                  <div
                    className="absolute inset-y-0 left-0 bg-foreground/[0.04]"
                    style={{
                      width: `${(article.total / maxViews) * 100}%`,
                    }}
                  />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-xs text-muted w-6 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="text-sm font-medium truncate hover:underline"
                      >
                        {article.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Link>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="hidden md:flex items-center gap-4">
                        <span className="font-mono text-[10px] text-muted">
                          today: {article.today}
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          7d: {article.week}
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          30d: {article.month}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-semibold w-12 text-right">
                        {article.total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top referrers */}
      {stats.topReferrers.length > 0 && (
        <div className="mt-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
            Top Referrers
          </p>
          <div className="mt-6 border-y border-border divide-y divide-border">
            {stats.topReferrers.map((ref) => (
              <div
                key={ref.source}
                className="flex items-center justify-between py-3 px-4"
              >
                <span className="text-sm truncate pr-4">
                  {ref.source === "Direct" ? "Direct / None" : ref.source}
                </span>
                <span className="font-mono text-xs text-muted shrink-0">
                  {ref.count} views
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
