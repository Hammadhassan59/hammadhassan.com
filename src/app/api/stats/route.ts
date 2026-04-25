import { NextRequest, NextResponse } from "next/server";
import { getStats } from "@/lib/analytics";
import { getAllArticleFiles } from "@/lib/content";

export async function GET(req: NextRequest) {
  // Auth check
  const token = req.cookies.get("admin_token")?.value;
  if (token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = getStats();

    // Content stats
    let totalWords = 0;
    let published = 0;
    const readingMinutes: number[] = [];
    const categoryCount: Record<string, number> = {};

    try {
      const files = getAllArticleFiles();
      for (const f of files) {
        const words = f.content.trim().split(/\s+/).filter(Boolean).length;
        totalWords += words;

        const rtMatch = f.frontmatter.readingTime?.match(/(\d+)/);
        if (rtMatch) readingMinutes.push(parseInt(rtMatch[1], 10));

        if (f.frontmatter.published !== false) {
          published++;
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

    const avgViewsPerArticle = published > 0
      ? Math.round(stats.overview.total / published)
      : 0;

    return NextResponse.json({
      ...stats,
      contentStats: {
        totalWords,
        avgReadingTime,
        avgViewsPerArticle,
        published,
        categories: categoryCount,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
