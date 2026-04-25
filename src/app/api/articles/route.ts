import { NextRequest, NextResponse } from "next/server";
import {
  getAllArticleFiles,
  saveArticleFile,
  articleFileExists,
  estimateReadingTime,
  type ArticleFrontmatter,
} from "@/lib/content";

function isAuthed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = getAllArticleFiles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, excerpt, punchline, category, content, published } = body;

  // Validation
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (title.length > 300) {
    return NextResponse.json({ error: "Title too long" }, { status: 400 });
  }

  // Generate slug with collision protection
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    slug = `article-${Date.now()}`;
  }

  // If slug exists, append a suffix
  let finalSlug = slug;
  let counter = 2;
  while (articleFileExists(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const frontmatter: ArticleFrontmatter = {
    title: title.trim(),
    excerpt: (excerpt || "").trim(),
    ...(punchline?.trim() ? { punchline: punchline.trim() } : {}),
    category: category || "Business",
    date,
    readingTime: estimateReadingTime(content || ""),
    slug: finalSlug,
    published: published ?? true,
  };

  saveArticleFile(finalSlug, frontmatter, content || "");

  return NextResponse.json({ success: true, slug: finalSlug });
}
