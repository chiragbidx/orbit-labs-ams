// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};
// ... [Types unchanged. Content updated below]

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "Modern Email",
    badgeOuter: "InboxPilot launches your campaigns",
    titleBefore: "Supercharge your",
    titleHighlight: "Email Marketing",
    titleAfter: "with InboxPilot",
    subtitle:
      "InboxPilot makes it easy to send, manage, and optimize email campaigns — complete with state-of-the-art deliverability, intuitive contact management, beautiful templates, and actionable analytics.",
    primaryCta: { label: "Start Now with InboxPilot", href: "#pricing" },
    secondaryCta: { label: "See how it works", href: "#how-it-works" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "InboxPilot dashboard preview",
  },

  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Trusted by teams using top tools",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Puzzle", name: "Postgres" },
      { icon: "Squirrel", name: "SendGrid" },
      { icon: "Drama", name: "Sentry" },
    ],
  },

  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why InboxPilot",
    heading: "Professional email marketing for modern teams",
    description:
      "Easily launch, track, and optimize campaigns in a platform designed for results-driven marketers and growing businesses.",
    items: [
      {
        icon: "BarChart2",
        title: "Actionable Analytics",
        description: "Instant insights on opens, clicks, engagement, and deliverability.",
      },
      {
        icon: "MailCheck",
        title: "Build, Send, Succeed",
        description: "From contact import to campaign analytics, everything is covered in one intuitive dashboard.",
      },
      {
        icon: "ShieldCheck",
        title: "Compliance Assured",
        description: "GDPR and CAN-SPAM ready infrastructure with clear opt-out management and privacy settings.",
      },
      {
        icon: "UserPlus",
        title: "Grow Your Audience",
        description: "Segment contacts by tags, status, or lists for targeted, high-converting email blasts.",
      },
    ],
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "Core Features",
    heading: "Everything you need to win the inbox",
    subtitle:
      "InboxPilot combines high deliverability, smart workflows, and beautiful design for email campaigns people actually open.",
    items: [
      { icon: "Users", title: "Contact & List Management", description: "Import, segment, and manage contacts with CSV support, tags, suppression, and opt-outs." },
      { icon: "GalleryHorizontal", title: "Template Builder", description: "Beautiful drag-and-drop templates, reusable for any campaign, with merge tags." },
      { icon: "Mail", title: "Campaign Scheduling", description: "Send or schedule one-off or recurring campaigns to any segment, with status tracking." },
      { icon: "PieChart", title: "Analytics & Reporting", description: "Track open/click/bounce/unsubscribe rates per campaign and across your account." },
      { icon: "Lock", title: "Data Privacy & Compliance", description: "Easy audit trail, opt-out self-service, and compliant user consent everywhere." },
      { icon: "Settings2", title: "Multi-Tenant Workspaces", description: "Role-based access and isolated data keep your campaigns, lists, and reports safe." },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "What Makes Us Different",
    heading: "Powerful, usable and scalable",
    subtitle:
      "InboxPilot is built for ease-of-use — but scales with your team as you grow.",
    items: [
      { title: "Import & CSV Export", description: "Bulk upload or export contacts, stats, or lists at any time.", pro: false },
      { title: "Role Access Control", description: "Admin/user roles restrict campaign, list, and template actions.", pro: false },
      { title: "Segment Anywhere", description: "Filter by list, tag, opt-in status, or custom fields across all views.", pro: false },
      { title: "Analytics Export", description: "Download engagement reports to Excel or CSV for your workflow.", pro: true },
    ],
  },

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "Testimonials",
    heading: "Why marketers trust InboxPilot",
    reviews: [
      { image: "/demo-img.jpg", name: "Jessica Martin", role: "Head of Marketing, OmniBank", comment: "InboxPilot let us send our first campaign in less than a day. Loved segmenting lists and seeing results immediately.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Samuel Chen", role: "Founder, LaunchGrowth", comment: "Best deliverability we've ever seen—our open and click rates jumped by 30% after switching.", rating: 4.9 },
      { image: "/demo-img.jpg", name: "Priya Shah", role: "Campaign Strategist, Marketly", comment: "Love the analytics dashboard. The opt-out and compliance features help us stay ahead of privacy rules.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Leonardo Ortega", role: "COO, AdWise", comment: "Easy for both marketers and our sales team. All-in-one, no integrations needed.", rating: 4.8 },
      { image: "/demo-img.jpg", name: "Kelly James", role: "Growth Lead, Lumenly", comment: "No more manual CSV wrangling. InboxPilot just works—so we can focus on content and results.", rating: 5.0 },
    ],
  },

  // ── Team ─────────────────────────────────────────────────────────────────
  team: {
    eyebrow: "Team",
    heading: "Meet the InboxPilot team",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder & CEO", "Product Vision"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/chiragdodiya" },
          { name: "Github", url: "https://github.com/chiragdodiya" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Elizabeth",
        lastName: "Moore",
        positions: ["Product Designer"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/elizabethmoore" },
          { name: "X", url: "https://x.com/elizabethmoore" },
        ],
      },
      {
        imageUrl: "/team3.jpg",
        firstName: "Samir",
        lastName: "Patel",
        positions: ["Lead Engineer", "Deliverability"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/samirpatel" },
          { name: "Github", url: "https://github.com/samirpatel" },
        ],
      },
    ],
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Transparent Pricing",
    heading: "Plans for every business",
    subtitle: "Simple, honest pricing—no deliverability caps, unlimited campaigns, generous contact limits.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Free",
        popular: false,
        price: 0,
        description: "For solopreneurs and startups getting started with email marketing. No credit card required.",
        buttonText: "Start Free",
        benefits: ["Up to 500 contacts", "Unlimited campaigns", "Analytics included", "GDPR-compliant", "Email support"],
      },
      {
        title: "Growth",
        popular: true,
        price: 49,
        description: "Best for growing marketing teams and SMBs with full analytics and segmentation.",
        buttonText: "Start Trial",
        benefits: [
          "Up to 20,000 contacts",
          "Unlimited campaigns",
          "Segmented lists/tags",
          "Role-based access",
          "Deliverability AI",
        ],
      },
      {
        title: "Enterprise",
        popular: false,
        price: 199,
        description: "For large orgs needing custom compliance/audit, dedicated support, and API access.",
        buttonText: "Contact Us",
        benefits: ["Unlimited contacts", "Advanced analytics", "Custom onboarding", "Priority support", "Every compliance tool"],
      },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Contact",
    heading: "Questions? Connect with the InboxPilot team",
    description:
      "Our team is here to help you get the most out of InboxPilot — whether you're looking to migrate, integrate, or just launch your first campaign.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: { label: "Headquarters", value: "Remote, proudly global" },
      phone: { label: "Contact", value: "" },
      email: { label: "Email", value: "hi@chirag.co" },
      hours: { label: "Support Hours", value: ["Monday - Friday", "8AM - 6PM UTC"] },
    },
    formSubjects: ["Platform Demo", "Migration", "Integration", "Deliverability", "Compliance", "Other"],
    formSubmitLabel: "Send message",
  },

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "FAQ",
    heading: "InboxPilot Common Questions",
    items: [
      { question: "Is InboxPilot free to start?", answer: "Yes, you can use our Free plan to get started, no credit card needed." },
      { question: "Can I import contacts from CSV or Excel?", answer: "Absolutely. InboxPilot supports CSV import and export for contacts, lists, and analytics." },
      { question: "How does InboxPilot handle unsubscribes?", answer: "Every campaign includes a required unsubscribe link and full compliance monitoring." },
      { question: "Does InboxPilot include analytics?", answer: "Yes! Get per-campaign and account-wide reports on opens, clicks, bounces, and more." },
      { question: "Is my data safe and private?", answer: "Always. We use strong encryption, tenant isolation, and full privacy/support for compliance standards." },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "InboxPilot",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/chiragdodiya" },
          { label: "Github", href: "https://github.com/chiragdodiya" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Compliance",
        links: [
          { label: "GDPR Info", href: "#" },
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com/chiragdodiya" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/chiragdodiya" },
        ],
      },
    ],
    copyright: "\u00a9 2026 InboxPilot. All rights reserved.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "InboxPilot",
    routes: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Key Features",
    featureImage: { src: "/demo-img.jpg", alt: "InboxPilot preview" },
    features: [
      { title: "Contact Management", description: "Flexible import, tagging, segmentation, and simple opt-outs." },
      { title: "Campaign Builder", description: "Build, schedule, and optimize stunning campaigns with ease." },
      { title: "Analytics Reporting", description: "Get results in real-time for every send — no setup required." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com/chiragdodiya", ariaLabel: "View on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}