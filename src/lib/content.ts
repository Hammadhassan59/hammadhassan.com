import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/articles");

export interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  punchline?: string;
  category: string;
  date: string;
  readingTime: string;
  slug: string;
  published: boolean;
}

export interface ArticleFile {
  frontmatter: ArticleFrontmatter;
  content: string;
}

function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

export function getAllArticleFiles(): ArticleFile[] {
  ensureContentDir();
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        frontmatter: data as ArticleFrontmatter,
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getArticleFile(slug: string): ArticleFile | null {
  ensureContentDir();
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

export function articleFileExists(slug: string): boolean {
  ensureContentDir();
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.mdx`));
}

export function saveArticleFile(
  slug: string,
  frontmatter: ArticleFrontmatter,
  content: string
) {
  ensureContentDir();
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf-8");
}

export function deleteArticleFile(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function estimateReadingTime(content: string): string {
  // Strip markdown syntax before counting words
  const stripped = content
    .replace(/^#{1,6}\s/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s/gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^>\s/gm, "");

  const words = stripped.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 230));
  return `${minutes} min`;
}
