import fs from "fs";
import path from "path";

const VIEWS_FILE = path.join(process.cwd(), "data", "views.json");

export interface PageView {
  slug: string;
  path: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
}

export interface ViewsData {
  [slug: string]: PageView[];
}

function ensureFile() {
  const dir = path.dirname(VIEWS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VIEWS_FILE)) fs.writeFileSync(VIEWS_FILE, "{}");
}

export function readViews(): ViewsData {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(VIEWS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function recordView(view: PageView) {
  const data = readViews();
  if (!data[view.slug]) data[view.slug] = [];
  data[view.slug].push(view);
  fs.writeFileSync(VIEWS_FILE, JSON.stringify(data));
}

export function getStats() {
  const data = readViews();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let totalViews = 0;
  let todayViews = 0;
  let weekViews = 0;
  let monthViews = 0;

  const articleStats: {
    slug: string;
    total: number;
    today: number;
    week: number;
    month: number;
  }[] = [];

  // Daily views for chart (last 30 days)
  const dailyMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }

  // Top referrers
  const referrerMap: Record<string, number> = {};

  for (const [slug, views] of Object.entries(data)) {
    let slugToday = 0;
    let slugWeek = 0;
    let slugMonth = 0;

    for (const view of views) {
      const viewDate = new Date(view.timestamp);
      const dateStr = view.timestamp.split("T")[0];

      totalViews++;

      if (dateStr === today) {
        todayViews++;
        slugToday++;
      }
      if (viewDate >= sevenDaysAgo) {
        weekViews++;
        slugWeek++;
      }
      if (viewDate >= thirtyDaysAgo) {
        monthViews++;
        slugMonth++;
        if (dailyMap[dateStr] !== undefined) {
          dailyMap[dateStr]++;
        }
      }

      // Referrers
      const ref = view.referrer || "Direct";
      referrerMap[ref] = (referrerMap[ref] || 0) + 1;
    }

    articleStats.push({
      slug,
      total: views.length,
      today: slugToday,
      week: slugWeek,
      month: slugMonth,
    });
  }

  // Sort articles by total views
  articleStats.sort((a, b) => b.total - a.total);

  // Top referrers
  const topReferrers = Object.entries(referrerMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));

  // Daily chart data
  const dailyViews = Object.entries(dailyMap).map(([date, count]) => ({
    date,
    count,
  }));

  return {
    overview: {
      total: totalViews,
      today: todayViews,
      week: weekViews,
      month: monthViews,
    },
    articles: articleStats,
    dailyViews,
    topReferrers,
  };
}
