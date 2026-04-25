import Link from "next/link";
import { newsletters } from "@/lib/newsletters";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimateIn from "@/components/AnimateIn";
import SubscribeForm from "@/components/SubscribeForm";

export default function Home() {
  const latestIssue = newsletters[0];

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
          {/* Left */}
          <div className="hero-enter">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              Hammad Hassan. Founder &amp; Writer
            </p>
            <h1 className="mt-4 text-6xl font-semibold leading-[1.05] tracking-tighter md:text-8xl">
              RAW
              <br />
              NOTES
            </h1>
            <p
              className="mt-6 text-xl leading-relaxed text-muted"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Essays on marketing, human behavior, and the messy truth
              about building businesses. Written by a founder who&apos;s
              still in the arena, not commentating from the sidelines.
            </p>

            <p className="mt-8 font-mono text-xs text-muted">
              Join founders who read Raw Notes.
            </p>
            <div className="mt-4">
              <SubscribeForm
                buttonText="Get Raw Notes"
                placeholder="Your email address"
              />
            </div>
            <p className="mt-3 font-mono text-xs text-muted/50">
              No spam. No schedule. Just signal.
            </p>
          </div>

          {/* Right: latest issue preview */}
          <div className="lg:pl-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="border border-border bg-card p-8 md:p-10">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                Latest Issue
              </p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">
                {latestIssue.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Every yes costs you something. Most founders don&apos;t fail
                because they couldn&apos;t find the right opportunity. They fail
                because they couldn&apos;t say no to the wrong ones.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-mono text-xs text-muted">
                  {latestIssue.date}
                </span>
                <Link
                  href="/newsletter"
                  className="font-mono text-xs font-semibold transition-colors hover:text-muted"
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>

            <div className="mt-4 divide-y divide-border border border-border bg-card">
              {newsletters.slice(1, 4).map((issue) => (
                <Link
                  key={issue.slug}
                  href="/newsletter"
                  className="flex items-center justify-between px-8 py-4 transition-colors hover:bg-foreground hover:text-background"
                >
                  <span className="text-sm font-medium truncate pr-4">
                    {issue.title}
                  </span>
                  <span className="shrink-0 font-mono text-xs opacity-50">
                    {issue.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What I Write About */}
      <AnimateIn className="border-t border-border pt-10 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          What I Write About
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Business",
              description:
                "How businesses actually work when nobody's watching. Not the pitch deck version. The real one.",
            },
            {
              title: "Marketing",
              description:
                "Why people pay attention. Why they buy. Why most marketing fails and the people doing it can't figure out why.",
            },
            {
              title: "Human Behavior",
              description:
                "How people think, decide, and act. Especially when they're under pressure, scared, or don't realize they're being irrational.",
            },
            {
              title: "Founder Lessons",
              description:
                "The stuff you only learn by doing it. Hiring the wrong person. Burning out quietly. Killing something you loved because the numbers said so.",
            },
          ].map((topic, i) => (
            <AnimateIn key={topic.title} delay={i * 100}>
              <div className="h-full border border-border bg-card p-8">
                <h3 className="text-lg font-semibold tracking-tight">
                  {topic.title}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {topic.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </AnimateIn>

      {/* About Teaser */}
      <section className="border-t border-border py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
              I make things.
              <br />
              Then I write about it.
            </h2>
          </div>
          <div>
            <p className="text-muted leading-relaxed">
              I start businesses and write about what I learn while I&apos;m
              still in it. Not after the fact with a clean narrative. While
              it&apos;s messy. While I&apos;m still figuring it out.
            </p>
            <div className="mt-6">
              <Link
                href="/about"
                className="font-mono text-sm font-semibold transition-colors hover:text-muted"
              >
                More about me &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <AnimateIn className="pb-14">
        <NewsletterSignup />
      </AnimateIn>
    </div>
  );
}
