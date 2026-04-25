"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";
import {
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

// --- Turndown instance for HTML → Markdown ---
function createTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });

  // Preserve underline as <u> tags in markdown (Turndown strips them by default)
  td.addRule("underline", {
    filter: ["u"],
    replacement: (content) => `<u>${content}</u>`,
  });

  return td;
}

// --- Simple Markdown → HTML for loading content into editor ---
function markdownToHtml(md: string): string {
  if (!md) return "<p></p>";

  let html = md;

  // Code blocks first (before inline processing)
  html = html.replace(/```[\s\S]*?\n([\s\S]*?)```/g, (_, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<s>$1</s>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^---$/gm, "<hr>");

  html = html.replace(/(^> .+$\n?)+/gm, (match) => {
    const inner = match
      .split("\n")
      .filter(Boolean)
      .map((l) => l.replace(/^> /, ""))
      .join("<br>");
    return `<blockquote><p>${inner}</p></blockquote>`;
  });

  html = html.replace(/(^- .+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^- /, "")}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  html = html.replace(/(^\d+\. .+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((l) => `<li>${l.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });

  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (/^<(h[23]|ul|ol|blockquote|hr|pre)/.test(block)) return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return html || "<p></p>";
}

// --- MenuButton ---
function MenuButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-foreground/70 hover:bg-foreground/10"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-4 w-px bg-border" />;
}

// --- Main Editor ---
export default function TiptapEditor({
  content,
  onChange,
  onSave,
}: {
  content: string;
  onChange: (markdown: string) => void;
  onSave?: () => void;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [bubbleLinkUrl, setBubbleLinkUrl] = useState("");
  const [showBubbleLink, setShowBubbleLink] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const bubbleLinkRef = useRef<HTMLInputElement>(null);
  const turndown = useMemo(() => createTurndown(), []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        strike: {},
        code: {},
        codeBlock: {},
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "font-semibold text-foreground underline decoration-foreground/30 underline-offset-[3px]",
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading...";
          }
          return "Start writing...";
        },
      }),
    ],
    content: markdownToHtml(content),
    editorProps: {
      attributes: {
        class: "outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const md = turndown.turndown(html);
      onChange(md);
    },
  });

  // Keyboard shortcuts: Cmd+S to save, Cmd+K for link
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && editor) {
        e.preventDefault();
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
        } else {
          setShowLinkInput(true);
          setTimeout(() => linkInputRef.current?.focus(), 50);
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSave, editor]);

  const addLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const addBubbleLink = useCallback(() => {
    if (!editor || !bubbleLinkUrl) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: bubbleLinkUrl })
      .run();
    setBubbleLinkUrl("");
    setShowBubbleLink(false);
  }, [editor, bubbleLinkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setShowBubbleLink(false);
  }, [editor]);

  // Word count
  const wordCount = editor
    ? editor.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 230));

  if (!editor) return null;

  return (
    <div>
      {/* Fixed toolbar */}
      <div className="sticky top-0 z-10 mb-8 flex flex-wrap items-center gap-1 border border-border bg-card p-2">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Cmd+B)"
        >
          B
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Cmd+I)"
        >
          I
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Cmd+U)"
        >
          U
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          S̶
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          {"<>"}
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          List
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          1. List
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          Quote
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          {"{ }"}
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          onClick={() => {
            if (editor.isActive("link")) {
              removeLink();
            } else {
              setShowLinkInput(!showLinkInput);
              setTimeout(() => linkInputRef.current?.focus(), 50);
            }
          }}
          active={editor.isActive("link")}
          title="Link (Cmd+K)"
        >
          Link
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          ---
        </MenuButton>

        <ToolbarDivider />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Cmd+Z)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Cmd+Shift+Z)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" /></svg>
        </MenuButton>

        {/* Link input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 ml-2">
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
                if (e.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkUrl("");
                  editor.chain().focus().run();
                }
              }}
              className="border border-border bg-transparent px-2 py-1 font-mono text-xs outline-none focus:border-foreground w-48"
            />
            <button
              type="button"
              onClick={addLink}
              className="px-2 py-1 text-xs font-medium bg-foreground text-background"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              className="px-2 py-1 text-xs text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Word count — right side */}
        <div className="ml-auto flex items-center gap-3 font-mono text-[10px] text-muted">
          <span>{wordCount} words</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Bubble menu — appears on text selection */}
      <BubbleMenu
        editor={editor}
        options={{
          placement: "bottom",
        }}
        className="flex items-center gap-0.5 rounded border border-border bg-card p-1 shadow-lg"
      >
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          B
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          I
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          U
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          S̶
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        >
          {"<>"}
        </MenuButton>
        <div className="mx-0.5 h-4 w-px bg-border" />
        {showBubbleLink ? (
          <div className="flex items-center gap-1">
            <input
              ref={bubbleLinkRef}
              type="url"
              value={bubbleLinkUrl}
              onChange={(e) => setBubbleLinkUrl(e.target.value)}
              placeholder="https://..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addBubbleLink();
                }
                if (e.key === "Escape") {
                  setShowBubbleLink(false);
                  setBubbleLinkUrl("");
                  editor.chain().focus().run();
                }
              }}
              className="border border-border bg-transparent px-1.5 py-0.5 font-mono text-[10px] outline-none focus:border-foreground w-36"
              autoFocus
            />
            <button
              type="button"
              onClick={addBubbleLink}
              className="px-1.5 py-0.5 text-[10px] font-medium bg-foreground text-background"
            >
              Go
            </button>
          </div>
        ) : (
          <MenuButton
            onClick={() => {
              if (editor.isActive("link")) {
                removeLink();
              } else {
                setShowBubbleLink(true);
                setBubbleLinkUrl("");
              }
            }}
            active={editor.isActive("link")}
          >
            Link
          </MenuButton>
        )}
      </BubbleMenu>

      {/* Editor content */}
      <EditorContent editor={editor} className="prose-editor" />
    </div>
  );
}
