import { getAllArticleFiles, getArticleFile } from "./content";

export type Category = "Business" | "Marketing" | "Human Behavior" | "Founder Lessons";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  punchline?: string;
  category: Category;
  date: string;
  readingTime: string;
  content: string;
  published?: boolean;
}

// Hardcoded sample articles (fallback / seed data)
const sampleArticles: Article[] = [
  {
    slug: "the-real-reason-people-buy",
    title: "The Real Reason People Buy",
    excerpt:
      "People don't buy products. They buy a version of themselves they haven't become yet. Once you understand this, everything about marketing changes.",
    category: "Marketing",
    date: "Mar 10, 2026",
    readingTime: "4 min",
    content: `People don't buy products. They buy better versions of themselves. Every purchase is an identity decision disguised as a practical one.

When someone buys a Tesla, they're not buying a car. They're buying the story they get to tell about themselves — that they're forward-thinking, that they care about the planet, that they can afford to care about the planet.

When someone buys a Moleskine notebook instead of a $2 one from the dollar store, they're not paying for paper quality. They're paying for the feeling that they're the type of person who has important things to write down.

This is the fundamental mistake most founders make with marketing. They talk about features. They talk about specs. They talk about what the product does.

Nobody cares what the product does. They care what the product makes them.

## The Identity Gap

There's always a gap between who your customer is and who they want to be. Your product lives in that gap. Your marketing should speak to that gap.

Apple understood this before anyone else. "Think Different" wasn't about computers. It was about identity. Buy this, and you're the kind of person who thinks different.

Nike didn't sell shoes. They sold the identity of an athlete. "Just Do It" is an identity statement, not a product description.

## How to Apply This

Next time you write copy, don't ask "what does this product do?" Ask "who does this product help my customer become?"

The answer to that question is your entire marketing strategy.`,
  },
  {
    slug: "why-most-startups-fail-silently",
    title: "Why Most Startups Fail Silently",
    excerpt:
      "Nobody writes about the startups that just slowly stopped. No dramatic crash. No public failure. Just a founder who ran out of conviction one Tuesday afternoon.",
    category: "Business",
    date: "Mar 5, 2026",
    readingTime: "5 min",
    content: `The loud failures make headlines. But most startups die quietly — not from a dramatic crash, but from a slow leak of conviction.

I've watched it happen. A founder starts with fire. They have the idea, the energy, the late nights. Six months in, the fire is still there but the fuel is running low. Twelve months in, they're not failing — they're just not winning fast enough.

And that's when the silent death begins.

## The Slow Leak

It starts with small compromises. You stop talking to customers as often. You start copying what competitors are doing instead of trusting your instinct. You hire someone because they're available, not because they're right.

None of these kill you immediately. They just let the air out, slowly.

## The Conviction Problem

The startups that survive aren't the ones with the best ideas. They're the ones where the founder's conviction outlasts the uncertainty.

This is what people get wrong about product-market fit. They think it's something you find. It's not. It's something you build, and you can only build it if you stay in the game long enough.

## What I've Learned

The only competitive advantage that matters in the early days is the ability to keep going when there's no external validation telling you to keep going.

That's it. That's the whole game.

Everything else — the strategy, the growth hacks, the fundraising — is secondary to the simple question: can you keep going when nobody is clapping?`,
  },
  {
    slug: "people-dont-resist-change",
    title: "People Don't Resist Change. They Resist Loss.",
    excerpt:
      "You're not asking people to try something new. You're asking them to let go of something familiar. That's a completely different conversation.",
    category: "Human Behavior",
    date: "Feb 28, 2026",
    readingTime: "4 min",
    content: `Every time you ask someone to change, you're asking them to give something up. Understanding what they're afraid to lose is the key to everything.

We talk about "resistance to change" like it's a character flaw. It's not. It's a survival mechanism.

When your team pushes back on a new process, they're not being difficult. They're protecting something — their competence, their status, their comfort, their identity.

When a customer won't switch from a competitor to you, they're not loyal to the competitor. They're afraid of what they might lose in the transition.

## Loss Aversion Is Real

Daniel Kahneman proved it decades ago. The pain of losing something is roughly twice as powerful as the pleasure of gaining something equivalent.

This means every change you propose — in your company, in your product, in your marketing — has to overcome a 2x emotional deficit.

## The Practical Implications

**For founders:** When you're changing company direction, don't just sell the vision of where you're going. Acknowledge what people are giving up. Name it. Respect it. Then show them why the trade is worth it.

**For marketers:** Don't just highlight what your product adds to someone's life. Show them what they're currently losing by NOT using it. Frame the status quo as the loss.

**For leaders:** When someone resists your idea, don't push harder. Ask: "What are you afraid of losing?" The answer will tell you everything you need to know.

## The Bottom Line

Change management isn't about motivation. It's about safety. Make people feel safe, and they'll change on their own.`,
  },
  {
    slug: "your-first-hire-will-define-your-culture",
    title: "Your First Hire Will Define Your Culture",
    excerpt:
      "Culture isn't what you write on the wall. It's what your first five employees do when you're not in the room.",
    category: "Founder Lessons",
    date: "Feb 20, 2026",
    readingTime: "3 min",
    content: `Culture isn't what you write on the wall. It's what your first five employees do when you're not in the room.

I learned this the hard way. Your first hire doesn't just fill a role. They set a standard. They become the reference point for everyone who comes after them.

If your first hire cuts corners, cutting corners becomes normal. If your first hire stays late because they genuinely care, caring becomes the expectation.

## The Multiplication Effect

Every early employee multiplies. Not their output — their behavior. They create the unwritten rules that no handbook will ever capture.

How they handle conflict. How they talk about customers when customers aren't listening. Whether they ask for permission or forgiveness. How they react when something breaks.

These micro-behaviors compound into what you'll eventually call "culture."

## What to Optimize For

Don't hire for skills first. Skills can be taught. Hire for the behaviors you want to see multiplied.

Ask yourself: if this person's way of working became the default for the entire company, would I be proud of that company?

If the answer is anything less than yes, keep looking.

## The Hard Truth

You can't fix culture later. You can only dilute a bad one very slowly and painfully. The cost of getting your first few hires wrong isn't the salary you paid them. It's the invisible tax on every hire that comes after.

Get it right early. Everything else gets easier.`,
  },
  {
    slug: "the-marketing-lesson-nobody-teaches",
    title: "The Marketing Lesson Nobody Teaches",
    excerpt:
      "The best marketing doesn't feel like marketing. It feels like a favor. The brands that win are the ones that give before they ask.",
    category: "Marketing",
    date: "Feb 14, 2026",
    readingTime: "4 min",
    content: `The best marketing doesn't feel like marketing. It feels like a favor. The brands that win are the ones that give before they ask.

Think about the last time someone sold you something and you didn't feel sold to. What happened? They probably gave you something valuable first — an insight, a tool, a genuine recommendation — with no strings attached.

That's the whole playbook.

## The Reciprocity Engine

Robert Cialdini called it reciprocity. When someone gives you something, you feel an almost biological urge to give back. It's hardwired.

The best marketers exploit this — not manipulatively, but generously. They create so much free value that when they finally ask for money, it feels like a fair trade. Almost overdue.

## Examples That Work

James Clear wrote free articles for years before asking anyone to buy Atomic Habits. By the time the book launched, millions of people felt like they owed him.

HubSpot gave away marketing tools for free. The tools were genuinely useful. When businesses needed a paid solution, HubSpot was already in the building.

## The Mistake Most Founders Make

They ask too early. They create a landing page before they've created any value. They run ads before they've earned attention.

Attention isn't something you buy. It's something you earn. And you earn it by being useful first.

## The Simple Framework

1. Give something genuinely valuable for free
2. Do it consistently enough that people start to trust you
3. When you finally offer something paid, make it feel like a natural extension of the free value

That's it. That's marketing.`,
  },
  {
    slug: "the-lie-of-work-life-balance",
    title: "The Lie of Work-Life Balance",
    excerpt:
      "Balance implies equal distribution. But building something meaningful was never about equal distribution. It's about intentional imbalance.",
    category: "Founder Lessons",
    date: "Feb 7, 2026",
    readingTime: "5 min",
    content: `Balance implies equal distribution. But building something meaningful was never about equal distribution. It's about intentional imbalance.

The phrase "work-life balance" was invented by people who don't love their work. When you're building something that matters to you, the lines blur — and that's not a bug, it's a feature.

I'm not saying burn yourself out. I'm saying the goal isn't balance. The goal is alignment.

## Balance vs. Alignment

Balance says: work 8 hours, live 8 hours, sleep 8 hours. Nice and neat.

Alignment says: pour your energy into what matters most right now, and adjust as the season changes.

Some seasons are all-in on the business. Some seasons are all-in on family. Some seasons are recovery. None of them are "balanced," and that's fine.

## The Guilt Trap

The work-life balance narrative creates guilt on both sides. When you're working, you feel guilty about not being present with family. When you're with family, you feel guilty about not working.

This guilt isn't helpful. It's just friction.

## What Works Instead

Be fully where you are. When you're working, work. When you're with people, be with them. The problem isn't imbalance — it's half-presence.

The founder who works 12 hours fully focused and then spends 3 hours fully present with their family is living a better life than the one who spends 15 hours half-distracted in both directions.

## The Real Question

Don't ask "am I balanced?" Ask "am I spending my energy on things that matter to me?"

If the answer is yes, you don't need balance. You need rest. Those are different things.`,
  },
];

export const categories: Category[] = [
  "Business",
  "Marketing",
  "Human Behavior",
  "Founder Lessons",
];

/**
 * Get all articles — merges MDX files from editor + hardcoded samples.
 * Called fresh each time (not cached at module level) so new articles show up.
 */
export function getAllArticles(): Article[] {
  let mdxArticles: Article[] = [];
  try {
    const files = getAllArticleFiles();
    mdxArticles = files
      .filter((f) => f.frontmatter.published !== false)
      .map((f) => ({
        slug: f.frontmatter.slug,
        title: f.frontmatter.title,
        excerpt: f.frontmatter.excerpt,
        punchline: f.frontmatter.punchline,
        category: f.frontmatter.category as Category,
        date: f.frontmatter.date,
        readingTime: f.frontmatter.readingTime,
        content: f.content,
        published: f.frontmatter.published,
      }));
  } catch {
    // File system unavailable during static build
  }

  // MDX articles override sample articles with the same slug
  const mdxSlugs = new Set(mdxArticles.map((a) => a.slug));
  const combined = [
    ...mdxArticles,
    ...sampleArticles.filter((a) => !mdxSlugs.has(a.slug)),
  ];

  return combined.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Dynamic getter — always fresh
export const articles = getAllArticles();

export function getArticlesByCategory(category: Category): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getArticleBySlug(slug: string): Article | undefined {
  // Check MDX files first (fresh read)
  try {
    const file = getArticleFile(slug);
    if (file && file.frontmatter.published !== false) {
      return {
        slug: file.frontmatter.slug,
        title: file.frontmatter.title,
        excerpt: file.frontmatter.excerpt,
        punchline: file.frontmatter.punchline,
        category: file.frontmatter.category as Category,
        date: file.frontmatter.date,
        readingTime: file.frontmatter.readingTime,
        content: file.content,
        published: file.frontmatter.published,
      };
    }
  } catch {
    // Fall through
  }

  return sampleArticles.find((a) => a.slug === slug);
}
