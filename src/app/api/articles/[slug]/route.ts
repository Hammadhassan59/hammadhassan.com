import { NextRequest, NextResponse } from "next/server";
import {
  getArticleFile,
  saveArticleFile,
  deleteArticleFile,
  estimateReadingTime,
  type ArticleFrontmatter,
} from "@/lib/content";

function isAuthed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_TOKEN;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const article = getArticleFile(slug);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();
  const { title, excerpt, punchline, category, content, published, date } = body;

  // Validation
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Get existing article to preserve date if not provided
  const existing = getArticleFile(slug);
  const existingDate = existing?.frontmatter.date;

  const frontmatter: ArticleFrontmatter = {
    title: title.trim(),
    excerpt: (excerpt || "").trim(),
    ...(punchline?.trim() ? { punchline: punchline.trim() } : {}),
    category: category || "Business",
    date: date || existingDate || new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readingTime: estimateReadingTime(content || ""),
    slug,
    published: published ?? true,
  };

  saveArticleFile(slug, frontmatter, content || "");

  return NextResponse.json({ success: true, slug });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  deleteArticleFile(slug);

  return NextResponse.json({ success: true });
}
