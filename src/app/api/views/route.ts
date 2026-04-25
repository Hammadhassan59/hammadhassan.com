import { NextRequest, NextResponse } from "next/server";
import { recordView } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const { slug, path: pagePath } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    recordView({
      slug,
      path: pagePath || `/articles/${slug}`,
      timestamp: new Date().toISOString(),
      referrer: req.headers.get("referer") || "",
      userAgent: req.headers.get("user-agent") || "",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
