import type { Metadata } from "next";
import { newsletters } from "@/lib/newsletters";
import AnimateIn from "@/components/AnimateIn";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Raw Notes | Newsletter",
  description:
    "Unfiltered thinking on business, marketing, and human nature. Subscribe to Raw Notes by Hammad Hassan.",
};

export default function NewsletterPage() {
  const latestIssue = newsletters[0];
  const archive = newsletters.slice(1);

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      {/* Hero: conversion focused */}
      <section className="pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
          {/* Left: pitch */}
          <div className="hero-enter">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              A newsletter for founders
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
              I&apos;ve been starting businesses for over seven years. These are
              the notes I took along the way: on marketing, human behavior, and
              what it actually takes to build something that works.
            </p>
          </div>

          {/* Right: signup */}
          <div className="lg:pl-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="border border-border bg-card p-8 md:p-10">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Get Raw Notes in your inbox.
              </h2>
              <p className="mt-3 text-sm text-muted">
                Join the founders and thinkers who read Raw Notes.
              </p>
              <div className="mt-6">
                <SubscribeForm
                  buttonText="Get Raw Notes"
                  placeholder="Your email address"
                />
              </div>
              <p className="mt-3 font-mono text-xs text-muted/50">
                No spam. No schedule. Just signal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll get */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          What you&apos;ll get
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Honest thinking",
              description:
                "Not recycled advice or motivational fluff. Real observations from someone who's still in the arena, still building, still figuring things out.",
            },
            {
              title: "Useful patterns",
              description:
                "Patterns I've noticed about marketing, decision-making, people, and business. The kind of stuff that changes how you see things.",
            },
            {
              title: "No filler",
              description:
                "I only write when I have something worth saying. You won't get weekly emails for the sake of consistency. You'll get signal.",
            },
          ].map((item, i) => (
            <AnimateIn key={item.title} delay={i * 100}>
              <div className="border border-border bg-card p-8">
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </AnimateIn>

      {/* Latest Issue: full readable sample */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Latest Issue. Read it now.
        </h2>
        <div className="mt-8 border border-border bg-card p-8 md:p-12">
          <div className="mx-auto max-w-[700px]">
            <span className="font-mono text-xs text-muted">
              {latestIssue.date}
            </span>
            <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {latestIssue.title}
            </h3>
            <div
              className="mt-8 space-y-6 text-[1.05rem] leading-[1.8] text-foreground/70"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <p>
                Every yes costs you something. Most founders don&apos;t fail
                because they couldn&apos;t find the right opportunity. They fail
                because they couldn&apos;t say no to the wrong ones.
              </p>
              <p>
                I spent the first two years of building saying yes to everything.
                Every client request, every partnership pitch, every &ldquo;quick
                call.&rdquo; I thought I was being smart. Keeping options open,
                staying flexible, never missing a shot.
              </p>
              <p>
                What I was actually doing was spreading myself so thin that
                nothing I touched got the attention it deserved. Every yes was a
                silent no to the thing that actually mattered.
              </p>
              <p className="font-semibold text-foreground">
                The real cost of yes isn&apos;t time. It&apos;s focus.
              </p>
              <p>
                When you say yes to a project that&apos;s &ldquo;pretty good,&rdquo;
                you&apos;re saying no to the one that could be great. When you say
                yes to a client who drains you, you&apos;re saying no to the energy
                you need for the clients who fuel you.
              </p>
              <p>
                The founders I respect most aren&apos;t the ones who found the
                best opportunities. They&apos;re the ones who had the discipline
                to say no to everything that wasn&apos;t the best opportunity.
              </p>
            </div>
            <div className="mt-10 border-t border-border pt-6">
              <p className="text-sm text-muted">
                Like this? Every issue of Raw Notes is like this. Subscribe to get the next one.
              </p>
              <div className="mt-4 sm:max-w-md">
                <SubscribeForm placeholder="Your email" />
              </div>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Archive */}
      <AnimateIn className="border-t border-border pt-12 pb-14">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
          Archive
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {archive.map((issue, i) => (
            <div
              key={issue.slug}
              className="group grid grid-cols-1 gap-2 py-6 transition-colors hover:bg-card md:grid-cols-[120px_1fr] md:gap-8 md:px-6"
            >
              <span className="shrink-0 font-mono text-xs text-muted pt-1">
                {issue.date}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {issue.title}
                </h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {issue.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* Final CTA: minimal */}
      <AnimateIn className="pb-14">
        <div className="border-t border-border pt-10 text-center">
          <p className="text-sm text-muted">
            That&apos;s Raw Notes. Real thinking from someone still building.{" "}
            <a href="#top" className="font-semibold text-foreground underline underline-offset-4 hover:text-muted">
              Subscribe above
            </a>{" "}
            to get the next one.
          </p>
        </div>
      </AnimateIn>
    </div>
  );
}
