import type { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimateIn from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books that changed how I think about business, marketing, human behavior, and building. Curated by Hammad Hassan.",
};

const books = [
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    topic: "Human Behavior",
    note: "The foundation for understanding how people actually make decisions. If you read one book on human behavior, make it this one. Every chapter rewired something in my head.",
    takeaway:
      "People don't make rational decisions. They make fast, emotional ones and then rationalize them after the fact.",
  },
  {
    title: "Influence",
    author: "Robert Cialdini",
    topic: "Marketing",
    note: "The six principles of persuasion. Every marketer and founder needs this mental framework. I've used it in every business I've built.",
    takeaway:
      "Reciprocity, commitment, social proof, authority, liking, scarcity. That's the entire playbook.",
  },
  {
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    topic: "Founder Lessons",
    note: "The most honest book about what it actually feels like to run a company. No sugarcoating. No motivational fluff. Just the truth.",
    takeaway:
      "There's no formula for the hard parts. You just have to survive them and not lose your mind in the process.",
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    topic: "Business",
    note: "How to think about building something genuinely new. Changed how I think about competition. Specifically, why you should avoid it.",
    takeaway:
      "Competition is for losers. The best businesses create something so different that there's no one to compete with.",
  },
  {
    title: "Poor Charlie's Almanack",
    author: "Charlie Munger",
    topic: "Human Behavior",
    note: "Mental models for thinking clearly about business, life, and everything in between. Dense, brilliant, and worth re-reading every year.",
    takeaway:
      "Invert, always invert. Instead of asking how to succeed, ask how to fail, then avoid those things.",
  },
  {
    title: "Obviously Awesome",
    author: "April Dunford",
    topic: "Marketing",
    note: "The best book on positioning. Short, practical, and immediately applicable to any product. I wish I'd read it five years earlier.",
    takeaway:
      "Your product isn't what you built. It's what your customer believes it is relative to the alternatives.",
  },
  {
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    topic: "Business",
    note: "Wealth, leverage, and clear thinking distilled into something you can re-read every year. Free to read online, but worth owning.",
    takeaway:
      "Seek wealth, not money. Build something that earns while you sleep. Leverage code, media, and capital.",
  },
  {
    title: "Shoe Dog",
    author: "Phil Knight",
    topic: "Founder Lessons",
    note: "The Nike origin story. Raw, emotional, and a reminder that every great company almost died ten times before anyone noticed it existed.",
    takeaway:
      "Every overnight success took years of near-death experiences that nobody talks about afterward.",
  },
];

const topics = ["All", "Business", "Marketing", "Human Behavior", "Founder Lessons"] as const;

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero */}
      <section className="pt-16 pb-14 md:pt-24 md:pb-20 hero-enter">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          {books.length} books that mattered
        </p>
        <h1 className="mt-4 text-6xl font-semibold leading-[1.05] tracking-tighter md:text-8xl lg:text-[9rem]">
          BOOKS
        </h1>
        <p
          className="mt-6 max-w-lg text-xl leading-relaxed text-muted"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Not a long list. Just the ones that actually changed how I think,
          build, and make decisions. Each one earned its place.
        </p>
      </section>

      {/* How to read this list */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <div className="mx-auto max-w-[700px]">
          <p
            className="text-[1.125rem] leading-[1.75] text-foreground/70"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            I read a lot. Most books give you one or two good ideas buried in
            300 pages of filler. These are the ones where I stopped
            highlighting because I&apos;d be highlighting the whole thing.
            Each book below includes my one-line takeaway. The idea that
            stuck with me longest.
          </p>
        </div>
      </AnimateIn>

      {/* Book List */}
      <section className="pb-14">
        {books.map((book, i) => (
          <AnimateIn
            key={book.title}
            className="border-t border-border"
          >
            <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[280px_1fr] md:gap-12">
              {/* Left: book info */}
              <div>
                <span className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight">
                  {book.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{book.author}</p>
                <span className="mt-4 inline-block border border-border px-3 py-1 font-mono text-xs">
                  {book.topic}
                </span>
              </div>

              {/* Right: why it matters */}
              <div className="flex flex-col justify-center">
                <p
                  className="text-[1.125rem] leading-[1.75] text-foreground/70"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {book.note}
                </p>
                {/* Takeaway */}
                <div className="mt-6 border-l-[3px] border-foreground/20 pl-5">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                    Key takeaway
                  </p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                    {book.takeaway}
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>
        ))}
        <div className="border-t border-border" />
      </section>

      {/* Reading philosophy */}
      <AnimateIn className="pb-14">
        <div className="border border-border bg-card p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                How I read.
              </h2>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                I don&apos;t read to finish books. I read to find ideas I can
                use. If a book gives me one idea that changes how I operate,
                it was worth the entire cover price. If it doesn&apos;t, I
                put it down. No guilt.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Why this list is short.
              </h2>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                I could list fifty books. But that wouldn&apos;t help you.
                A long list is just a way of not choosing. These eight
                books had the most impact on how I think and build. That&apos;s
                the only criteria that matters.
              </p>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* CTA */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <NewsletterSignup />
      </AnimateIn>
    </div>
  );
}
