export interface Newsletter {
  slug: string;
  title: string;
  date: string;
  preview: string;
}

export const newsletters: Newsletter[] = [
  {
    slug: "raw-notes-012",
    title: "The cost of saying yes to everything",
    date: "Mar 9, 2026",
    preview:
      "Every yes costs you something. Most founders don't fail because they couldn't find the right opportunity. They fail because they couldn't say no to the wrong ones.",
  },
  {
    slug: "raw-notes-011",
    title: "Why your pricing is wrong",
    date: "Feb 27, 2026",
    preview:
      "If nobody complains about your price, it's too low. Price is a signal. It tells people how seriously to take you.",
  },
  {
    slug: "raw-notes-010",
    title: "The one meeting that actually matters",
    date: "Feb 18, 2026",
    preview:
      "Most meetings are performative. There's only one type that consistently moves the needle: the one where you sit with a customer and shut up.",
  },
  {
    slug: "raw-notes-009",
    title: "What I got wrong about delegation",
    date: "Feb 10, 2026",
    preview:
      "I used to think delegation was about handing off tasks. It's not. It's about handing off decisions. Tasks without decision-making authority is just micromanagement with extra steps.",
  },
  {
    slug: "raw-notes-008",
    title: "Nobody cares about your mission statement",
    date: "Feb 1, 2026",
    preview:
      "Your team doesn't need a mission statement. They need to see you make a hard decision that proves what you actually stand for.",
  },
  {
    slug: "raw-notes-007",
    title: "The quiet power of being boring",
    date: "Jan 22, 2026",
    preview:
      "The most successful founders I know are boring. Not boring people. Boring operators. They do the same things, consistently, without drama.",
  },
  {
    slug: "raw-notes-006",
    title: "Stop building for everyone",
    date: "Jan 14, 2026",
    preview:
      "The moment you try to please everyone, you start building for no one. Pick your person. Build for them. Ignore the rest.",
  },
];
