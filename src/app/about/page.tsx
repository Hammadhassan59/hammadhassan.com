import type { Metadata } from "next";
import NewsletterSignup from "@/components/NewsletterSignup";
import AnimateIn from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hammad Hassan — builder, founder, and writer sharing raw notes on business, marketing, and human behavior.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero with photo */}
      <section className="pt-16 pb-14 md:pt-24 md:pb-20 hero-enter">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_300px]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              About
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
              I&apos;m Hammad.
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-muted" style={{ fontFamily: "var(--font-serif)" }}>
              Builder. Founder. Writer. I&apos;ve spent 7+ years starting
              businesses and writing about what I learn — while I&apos;m still
              in it.
            </p>
          </div>
          {/* Photo placeholder — replace src with your real headshot */}
          <div className="hidden md:block">
            <div className="aspect-[3/4] w-full border border-border bg-foreground/5 flex items-end justify-center overflow-hidden">
              <div className="flex flex-col items-center justify-center h-full w-full">
                <span className="font-mono text-xs text-muted/40 uppercase tracking-wider">Your photo here</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility — what I've built */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          What I&apos;ve built
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              metric: "7+",
              label: "Years building businesses",
              detail: "Started my first company at 18. Haven't stopped since.",
            },
            {
              metric: "Multiple",
              label: "Businesses launched",
              detail: "From service businesses to digital products. Some failed. Some scaled.",
            },
            {
              metric: "Raw Notes",
              label: "Newsletter for founders",
              detail: "Where I share the patterns, mistakes, and lessons while they're still fresh.",
            },
          ].map((item) => (
            <div key={item.label} className="border border-border bg-card p-8">
              <p className="text-3xl font-semibold tracking-tight">{item.metric}</p>
              <p className="mt-2 text-sm font-medium">{item.label}</p>
              <p className="mt-3 text-sm text-muted leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          I&apos;ll share specific names and numbers as I publish more here. For now, the writing speaks for itself.
        </p>
      </AnimateIn>

      {/* Story */}
      <AnimateIn className="border-t border-border pt-12 pb-16">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          The story
        </h2>
        <div className="mt-8 mx-auto max-w-[700px]">
          <div
            className="space-y-7 text-[1.125rem] leading-[1.75] text-foreground/70"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <p>
              I&apos;ve been starting businesses for over seven years. Some
              worked. Some didn&apos;t. All of them taught me something I
              couldn&apos;t have learned any other way.
            </p>
            <p>
              Along the way I became obsessed with three things:{" "}
              <strong className="font-semibold text-foreground">
                how businesses actually work
              </strong>
              ,{" "}
              <strong className="font-semibold text-foreground">
                why people make the decisions they make
              </strong>
              , and{" "}
              <strong className="font-semibold text-foreground">
                what separates marketing that works from marketing that
                doesn&apos;t
              </strong>
              .
            </p>
            <p>
              I started writing because I needed a place to think out loud.
              Not for an audience. Not to build a following. Just to organize
              the things I was learning while I was still learning them.
            </p>
            <p>
              That became{" "}
              <strong className="font-semibold text-foreground">Raw Notes</strong>{" "}
              — a newsletter where I share the real stuff. The patterns, the
              mistakes, the human side of making something from nothing.
            </p>
            <p>
              I don&apos;t write on a schedule. I write when something clicks —
              a pattern I noticed, a mistake I made, a truth about human
              behavior that I can&apos;t stop thinking about. Then I send it to
              whoever is listening.
            </p>
            <p>
              If you&apos;re building something, trying to understand people,
              or just trying to figure out how the world actually works — you
              might find something useful here.
            </p>
          </div>
        </div>
      </AnimateIn>

      {/* Beliefs / principles */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          What I believe
        </h2>
        <div className="mt-10 mx-auto max-w-[700px]">
          <div className="divide-y divide-border">
            {[
              {
                belief: "The best marketing doesn't feel like marketing.",
                note: "It feels like someone doing you a favor. Give first, ask later.",
              },
              {
                belief: "Most businesses fail from a slow leak, not an explosion.",
                note: "It's not one bad decision. It's a hundred small compromises that nobody notices until it's too late.",
              },
              {
                belief: "People don't resist change. They resist loss.",
                note: "Every time you ask someone to do something different, you're asking them to let go of something familiar.",
              },
              {
                belief: "Culture is what happens when you're not in the room.",
                note: "You can't write it on a wall. You can only hire it, one person at a time.",
              },
              {
                belief: "The best founders are the most honest ones.",
                note: "Not the ones with the best pitch. The ones who see things clearly and don't flinch.",
              },
            ].map((item, i) => (
              <div key={i} className="py-8">
                <p className="text-lg font-semibold leading-snug tracking-tight md:text-xl">
                  {item.belief}
                </p>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {item.note}
                </p>
              </div>
            ))}
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
