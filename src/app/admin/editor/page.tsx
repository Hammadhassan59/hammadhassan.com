"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center border border-border">
      <p className="font-mono text-xs text-muted">Loading editor...</p>
    </div>
  ),
});

interface ArticleMeta {
  title: string;
  excerpt: string;
  punchline: string;
  category: string;
  published: boolean;
  date?: string;
}

interface SavedArticle {
  frontmatter: {
    title: string;
    excerpt: string;
    punchline?: string;
    category: string;
    date: string;
    readingTime: string;
    slug: string;
    published: boolean;
  };
  content: string;
}

const categories = ["Business", "Marketing", "Human Behavior", "Founder Lessons"];

const DRAFT_KEY = "editor-draft";

function saveDraftToStorage(data: { meta: ArticleMeta; content: string; slug: string | null }) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

function loadDraftFromStorage(): { meta: ArticleMeta; content: string; slug: string | null } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted
  }
  return null;
}

function clearDraftFromStorage() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore
  }
}

export default function EditorPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [meta, setMeta] = useState<ArticleMeta>({
    title: "",
    excerpt: "",
    punchline: "",
    category: "Business",
    published: true,
  });
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "saving" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editingSlugRef = useRef<string | null>(null);

  editingSlugRef.current = editingSlug;

  useEffect(() => {
    fetchArticles();
  }, []);

  // Unsaved changes warning
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hasUnsavedChanges) e.preventDefault();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, []);

  // Check for recovered draft on mount
  useEffect(() => {
    const draft = loadDraftFromStorage();
    if (draft && draft.meta.title.trim()) {
      const shouldRecover = confirm(
        `Recovered unsaved draft: "${draft.meta.title}". Restore it?`
      );
      if (shouldRecover) {
        setEditingSlug(draft.slug);
        setMeta(draft.meta);
        setContent(draft.content);
        setHasUnsavedChanges(true);
        setView("editor");
      }
      clearDraftFromStorage();
    }
  }, []);

  async function fetchArticles() {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/articles");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setFetchError("Failed to load articles");
        return;
      }
      const data = await res.json();
      setArticles(data);
    } catch {
      setFetchError("Network error — check your connection");
    } finally {
      setLoading(false);
    }
  }

  function newArticle() {
    if (hasUnsavedChanges && !confirm("You have unsaved changes. Discard them?")) return;
    setEditingSlug(null);
    setMeta({ title: "", excerpt: "", punchline: "", category: "Business", published: true });
    setContent("");
    setHasUnsavedChanges(false);
    setSaveStatus("idle");
    setSaveError(null);
    clearDraftFromStorage();
    setView("editor");
  }

  function editArticle(article: SavedArticle) {
    if (hasUnsavedChanges && !confirm("You have unsaved changes. Discard them?")) return;
    setEditingSlug(article.frontmatter.slug);
    setMeta({
      title: article.frontmatter.title,
      excerpt: article.frontmatter.excerpt,
      punchline: article.frontmatter.punchline || "",
      category: article.frontmatter.category,
      published: article.frontmatter.published,
      date: article.frontmatter.date,
    });
    setContent(article.content);
    setHasUnsavedChanges(false);
    setSaveStatus("idle");
    setSaveError(null);
    clearDraftFromStorage();
    setView("editor");
  }

  const saveArticle = useCallback(async () => {
    if (!meta.title.trim()) return;
    setSaving(true);
    setSaveStatus("saving");
    setSaveError(null);

    const url = editingSlugRef.current
      ? `/api/articles/${editingSlugRef.current}`
      : "/api/articles";
    const method = editingSlugRef.current ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...meta, content }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditingSlug(data.slug);
        setSaveStatus("saved");
        setHasUnsavedChanges(false);
        clearDraftFromStorage();
        setTimeout(() => setSaveStatus("idle"), 2000);
        fetchArticles();
      } else {
        const err = await res.json().catch(() => ({ error: "Save failed" }));
        setSaveStatus("error");
        setSaveError(err.error || "Save failed");
        setTimeout(() => setSaveStatus("idle"), 4000);
      }
    } catch {
      setSaveStatus("error");
      setSaveError("Network error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }

    setSaving(false);
  }, [meta, content]);

  function triggerAutoSave() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (editingSlugRef.current && meta.title.trim()) {
      autoSaveTimer.current = setTimeout(() => saveArticle(), 5000);
    }
  }

  function handleContentChange(newContent: string) {
    setContent(newContent);
    setHasUnsavedChanges(true);
    // Save draft to localStorage for crash recovery
    saveDraftToStorage({ meta, content: newContent, slug: editingSlugRef.current });
    triggerAutoSave();
  }

  function handleMetaChange(newMeta: ArticleMeta) {
    setMeta(newMeta);
    setHasUnsavedChanges(true);
    saveDraftToStorage({ meta: newMeta, content, slug: editingSlugRef.current });
    triggerAutoSave();
  }

  async function deleteArticle(slug: string) {
    if (!confirm("Delete this article? This can't be undone.")) return;
    setDeleting(slug);

    try {
      const res = await fetch(`/api/articles/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete article");
      }
    } catch {
      alert("Network error — could not delete");
    }

    fetchArticles();
    setDeleting(null);

    if (editingSlug === slug) {
      setHasUnsavedChanges(false);
      clearDraftFromStorage();
      setView("list");
    }
  }

  function goToList() {
    if (hasUnsavedChanges && !confirm("You have unsaved changes. Discard them?")) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setHasUnsavedChanges(false);
    clearDraftFromStorage();
    setView("list");
  }

  // Filter articles for list view
  const filteredArticles = articles.filter((a) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !a.frontmatter.title.toLowerCase().includes(q) &&
        !a.frontmatter.excerpt.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (filterCategory !== "all" && a.frontmatter.category !== filterCategory) return false;
    if (filterStatus === "published" && !a.frontmatter.published) return false;
    if (filterStatus === "draft" && a.frontmatter.published) return false;
    return true;
  });

  // ==================== LIST VIEW ====================
  if (view === "list") {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
            <p className="mt-1 text-sm text-muted">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={newArticle}
            className="bg-foreground px-6 py-3 font-mono text-sm font-semibold text-background transition-colors hover:bg-foreground/80"
          >
            New Article
          </button>
        </div>

        {/* Search & Filter */}
        {articles.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 min-w-[200px] border border-border bg-card px-3 py-2 font-mono text-xs outline-none focus:border-foreground"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-border bg-card px-3 py-2 font-mono text-xs outline-none"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-border bg-card px-3 py-2 font-mono text-xs outline-none"
            >
              <option value="all">All status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        )}

        {/* Article list */}
        <div className="mt-6 divide-y divide-border border-y border-border">
          {loading && (
            <div className="py-16 text-center">
              <p className="font-mono text-xs text-muted">Loading...</p>
            </div>
          )}
          {fetchError && (
            <div className="py-16 text-center">
              <p className="font-mono text-xs text-red-500">{fetchError}</p>
              <button
                onClick={fetchArticles}
                className="mt-4 font-mono text-xs font-semibold transition-colors hover:text-muted"
              >
                Try again
              </button>
            </div>
          )}
          {!loading && !fetchError && filteredArticles.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted">
                {articles.length === 0
                  ? "No articles yet."
                  : "No articles match your filters."}
              </p>
              {articles.length === 0 && (
                <button
                  onClick={newArticle}
                  className="mt-4 font-mono text-sm font-semibold transition-colors hover:text-muted"
                >
                  Write your first article &rarr;
                </button>
              )}
            </div>
          )}
          {filteredArticles.map((article) => (
            <div
              key={article.frontmatter.slug}
              className="flex items-center justify-between gap-4 py-5"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => editArticle(article)}
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold tracking-tight">
                    {article.frontmatter.title}
                  </h3>
                  {!article.frontmatter.published && (
                    <span className="border border-border px-2 py-0.5 font-mono text-[10px] text-muted">
                      Draft
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted line-clamp-1">
                  {article.frontmatter.excerpt}
                </p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">
                    {article.frontmatter.category}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {article.frontmatter.date}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {article.frontmatter.readingTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {article.frontmatter.published && (
                  <a
                    href={`/articles/${article.frontmatter.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground hover:bg-card"
                    title="View on site"
                  >
                    View
                  </a>
                )}
                <button
                  onClick={() => editArticle(article)}
                  className="px-3 py-1.5 font-mono text-xs transition-colors hover:bg-card"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteArticle(article.frontmatter.slug)}
                  disabled={deleting === article.frontmatter.slug}
                  className="px-3 py-1.5 font-mono text-xs text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === article.frontmatter.slug ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== EDITOR VIEW ====================
  return (
    <div className="mx-auto max-w-[900px] px-6 py-12">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToList}
          className="font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          &larr; All articles
        </button>
        <div className="flex items-center gap-3">
          {/* View on site */}
          {editingSlug && meta.published && (
            <a
              href={`/articles/${editingSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              View on site &nearr;
            </a>
          )}

          {/* Save status */}
          {saveStatus === "saved" && (
            <span className="font-mono text-xs text-green-600">Saved</span>
          )}
          {saveStatus === "saving" && (
            <span className="font-mono text-xs text-muted">Saving...</span>
          )}
          {saveStatus === "error" && (
            <span className="font-mono text-xs text-red-500" title={saveError || undefined}>
              {saveError || "Error saving"}
            </span>
          )}
          {saveStatus === "idle" && hasUnsavedChanges && (
            <span className="font-mono text-xs text-amber-500">Unsaved</span>
          )}

          <button
            onClick={saveArticle}
            disabled={saving || !meta.title.trim()}
            className="bg-foreground px-6 py-2.5 font-mono text-sm font-semibold text-background transition-colors hover:bg-foreground/80 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingSlug ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-2 text-right">
        <span className="font-mono text-[10px] text-muted/50">
          Cmd+S save &middot; Cmd+K link &middot; Cmd+B bold &middot; Cmd+I italic &middot; Cmd+Z undo
        </span>
      </div>

      {/* Meta fields */}
      <div className="mt-8 space-y-5">
        <div>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => handleMetaChange({ ...meta, title: e.target.value })}
            placeholder="Article title"
            className="w-full bg-transparent text-4xl font-semibold tracking-tight outline-none placeholder:text-foreground/20 md:text-5xl"
          />
        </div>
        <div>
          <textarea
            value={meta.excerpt}
            onChange={(e) => handleMetaChange({ ...meta, excerpt: e.target.value })}
            placeholder="Write a short excerpt — this appears on cards and in search results"
            rows={2}
            className="w-full resize-none bg-transparent text-lg text-muted outline-none placeholder:text-foreground/20"
            style={{ fontFamily: "var(--font-serif)" }}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Punchline</span>
            <span className="font-mono text-[10px] text-muted/50">— closing quote at the end of the article</span>
          </div>
          <textarea
            value={meta.punchline}
            onChange={(e) => handleMetaChange({ ...meta, punchline: e.target.value })}
            placeholder="The egg isn't the obstacle. The egg is the point."
            rows={2}
            className="w-full resize-none border border-border bg-card px-4 py-3 text-lg text-foreground outline-none placeholder:text-foreground/20 focus:border-foreground"
            style={{ fontFamily: "var(--font-serif)" }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={meta.category}
            onChange={(e) => handleMetaChange({ ...meta, category: e.target.value })}
            className="border border-border bg-card px-3 py-2 font-mono text-xs outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 font-mono text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={meta.published}
              onChange={(e) =>
                handleMetaChange({ ...meta, published: e.target.checked })
              }
              className="accent-foreground"
            />
            Published
          </label>

          {/* Date editor */}
          {meta.date && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">Date:</span>
              <input
                type="text"
                value={meta.date}
                onChange={(e) => handleMetaChange({ ...meta, date: e.target.value })}
                className="border border-border bg-card px-2 py-1.5 font-mono text-xs outline-none focus:border-foreground w-32"
              />
            </div>
          )}

          {/* Slug display */}
          {editingSlug && (
            <span className="font-mono text-xs text-muted">
              /{editingSlug}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 border-t border-border" />

      {/* Editor */}
      <div className="mt-8">
        <TiptapEditor
          content={content}
          onChange={handleContentChange}
          onSave={saveArticle}
        />
      </div>
    </div>
  );
}
