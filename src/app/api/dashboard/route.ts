import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/lib/analytics";
import { getAllArticleFiles } from "@/lib/content";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = getStats();

    // Get all articles (published + drafts)
    let articles: {
      slug: string;
      title: string;
      category: string;
      date: string;
      published: boolean;
      readingTime: string;
      excerpt: string;
    }[] = [];

    try {
      const files = getAllArticleFiles();
      articles = files.map((f) => ({
        slug: f.frontmatter.slug,
        title: f.frontmatter.title,
        category: f.frontmatter.category,
        date: f.frontmatter.date,
        published: f.frontmatter.published !== false,
        readingTime: f.frontmatter.readingTime,
        excerpt: f.frontmatter.excerpt,
      }));
    } catch {
      // No articles yet
    }

    const published = articles.filter((a) => a.published).length;
    const drafts = articles.filter((a) => !a.published).length;

    // Content stats
    let totalWords = 0;
    const categoryCount: Record<string, number> = {};
    const readingMinutes: number[] = [];

    try {
      const files = getAllArticleFiles();
      for (const f of files) {
        // Word count from content
        const words = f.content.trim().split(/\s+/).filter(Boolean).length;
        totalWords += words;

        // Reading time in minutes
        const rtMatch = f.frontmatter.readingTime?.match(/(\d+)/);
        if (rtMatch) readingMinutes.push(parseInt(rtMatch[1], 10));

        // Category count (published only)
        if (f.frontmatter.published !== false) {
          const cat = f.frontmatter.category || "Uncategorized";
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        }
      }
    } catch {
      // No articles
    }

    const avgReadingTime = readingMinutes.length > 0
      ? Math.round(readingMinutes.reduce((a, b) => a + b, 0) / readingMinutes.length)
      : 0;

    const topCategory = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0] || null;

    const avgViewsPerArticle = published > 0
      ? Math.round(stats.overview.total / published)
      : 0;

    // Merge view counts into articles
    const articlesWithViews = articles
      .map((a) => {
        const viewData = stats.articles.find((s) => s.slug === a.slug);
        return {
          ...a,
          views: viewData?.total || 0,
          viewsToday: viewData?.today || 0,
          viewsWeek: viewData?.week || 0,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      stats: stats.overview,
      dailyViews: stats.dailyViews,
      topReferrers: stats.topReferrers,
      content: {
        total: articles.length,
        published,
        drafts,
        totalWords,
        avgReadingTime,
        avgViewsPerArticle,
        topCategory: topCategory ? { name: topCategory[0], count: topCategory[1] } : null,
        categories: categoryCount,
      },
      articles: articlesWithViews,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
