/**
 * All portfolio content lives here. Replace placeholders with real copy
 * before shipping. UI components should not invent content beyond this file.
 */
import type { ExperienceItem, PersonalInfo, Project, Service, SkillItem, SocialLink } from "@/types/portfolio";

export type {
  ExperienceItem,
  PersonalInfo,
  Project,
  Service,
  SkillItem,
  SocialLink,
} from "@/types/portfolio";

export const personal: PersonalInfo = {
  name: "Aman Rajput",
  role: "Software Engineer",
  eyebrow: "Full-Stack Developer",
  headline: ["Building digital", "experiences that move."],
  summary:
    "I design and build scalable, performant products — FastWhistle at 5Inch Ventures, and freelance work with Zaploom Technology.",
  location: "Based remotely",
  email: "amanrajputtripurari@gmail.com",
  available: true,
  resumeUrl: undefined,
};

export const heroChapters = {
  craft: {
    eyebrow: "The craft",
    headline: ["Code, architecture,", "performance, systems."],
    summary: "I work the gap between product feel and engineering rigor — interfaces that stay fast as they grow.",
  },
  invite: {
    eyebrow: "The work",
    headline: ["Selected work,", "shipped with intent."],
    summary: "Products and systems taken from idea to production. Scroll on to see the details.",
    cta: "Explore my work",
  },
};

export const about = {
  paragraphs: [
    "I'm a software engineer with six years at 5Inch Ventures Pvt Ltd, where I built FastWhistle — a pharma last-mile and fleet platform used by distributors, retailers, riders, and field teams.",
    "Alongside that I freelance with Zaploom Technology: design plus frontend and backend. There I shipped Yaaro Fit, a social fitness app, and contributed across Zaploom’s client products.",
  ],
  stats: [
    { label: "Years experience", value: "6+" },
    { label: "Products shipped", value: "20+" },
    { label: "Teams collaborated with", value: "12" },
  ],
};

export const skills: SkillItem[] = [
  { name: "Angular", category: "Frontend", mark: "Ng", color: "#DD0031", summary: "Component-driven UI for large product surfaces.", rating: 5 },
  { name: "React", category: "Frontend", mark: "R", color: "#61DAFB", ink: "#08202b", summary: "Interactive interfaces and design-system work.", rating: 5 },
  { name: "TypeScript", category: "Frontend", mark: "TS", color: "#3178C6", summary: "Typed application code across the stack.", rating: 5 },
  { name: "Next.js", category: "Frontend", mark: "Nx", color: "#E8EEF6", ink: "#111318", summary: "App routing, rendering, and production web delivery.", rating: 4 },
  { name: "Three.js", category: "Frontend", mark: "3", color: "#049EF4", summary: "Realtime 3D for product storytelling.", rating: 4 },
  { name: "NestJS", category: "Backend", mark: "N", color: "#E0234E", summary: "Structured Node APIs and service architecture.", rating: 5 },
  { name: "Node.js", category: "Backend", mark: "No", color: "#339933", summary: "Services, tooling, and server-side runtimes.", rating: 5 },
  { name: "PostgreSQL", category: "Backend", mark: "PG", color: "#4169E1", summary: "Relational data modeling and query design.", rating: 4 },
  { name: "REST APIs", category: "Backend", mark: "API", color: "#8FB2FF", ink: "#10141c", summary: "Clear HTTP contracts between clients and services.", rating: 5 },
  { name: "WebSockets", category: "Backend", mark: "WS", color: "#F7DF1E", ink: "#1a1600", summary: "Live updates and event-driven product features.", rating: 4 },
  { name: "AWS", category: "Cloud & Infra", mark: "AWS", color: "#FF9900", ink: "#1a1200", summary: "Cloud hosting, storage, and deployment paths.", rating: 4 },
  { name: "Docker", category: "Cloud & Infra", mark: "Dk", color: "#2496ED", summary: "Repeatable environments for build and ship.", rating: 4 },
  { name: "CI/CD", category: "Cloud & Infra", mark: "CI", color: "#7B8CDE", ink: "#10141c", summary: "Automated checks and release pipelines.", rating: 4 },
  { name: "System Design", category: "Craft", mark: "SD", color: "#8FB2FF", ink: "#10141c", summary: "Boundaries, data flow, and scale-minded structure.", rating: 4 },
  { name: "Performance", category: "Craft", mark: "Pf", color: "#F59E0B", ink: "#1a1200", summary: "Load, runtime, and perceived-speed work.", rating: 5 },
  { name: "Accessibility", category: "Craft", mark: "A11", color: "#A78BFA", ink: "#140e24", summary: "Keyboard, contrast, and inclusive interface details.", rating: 4 },
];

export const experience: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "5Inch Ventures Pvt Ltd",
    url: "https://fastwhistle.com",
    role: "Software Engineer",
    period: "2020 — Present",
    summary:
      "Six years building FastWhistle, a pharma logistics and fleet platform for distributors across India.",
    highlights: [
      "Built FastWhistle end-to-end: last-mile medicine delivery plus Fleet SaaS for field teams",
      "Same-day delivery operations in Ahmedabad, Surat, Pune, and Mumbai, with live rider tracking",
      "Shipped distributor, retailer, rider, and fleet apps — orders, tasks, attendance, collections, and proof of delivery",
    ],
  },
  {
    id: "exp-2",
    company: "Zaploom Technology",
    url: "https://zaploom.in",
    role: "Freelance Full-Stack Engineer",
    period: "2023 — Present",
    summary:
      "Design, frontend, and backend for Zaploom products — including Yaaro Fit and client platforms.",
    highlights: [
      "Designed and built Yaaro Fit: GPS activity tracking, social feed, clubs, challenges, and rewards",
      "Contributed frontend and backend across Zaploom client work — web, mobile, and APIs",
      "Helped take products from concept through launch with Zaploom’s studio team",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "fastwhistle",
    number: "01",
    name: "FastWhistle",
    description:
      "Pharma distribution, two ways: FastWhistle riders for same-day logistics in Ahmedabad, Surat, Pune, and Mumbai — or Fleet SaaS to run your own field team anywhere in India.",
    role: "Full-Stack Engineer · 5Inch Ventures",
    year: "2020",
    accent: "#2563eb",
    mock: "realtime",
    problem:
      "Pharma distributors had to choose between hiring a courier and running their own riders and salesmen. Delivery, attendance, collections, and proof of delivery lived in different tools, so last-mile was slow and hard to see.",
    approach:
      "FastWhistle is one product with two operating models. Logistics uses FastWhistle riders in four cities with a 4-hour SLA and dedicated ops. Fleet SaaS lets a distributor run their own team pan-India — tasks, GPS, attendance, and collections — at ₹499 per user per month.",
    features: [
      "Logistics: FastWhistle riders, 4-hour delivery, Ahmedabad / Surat / Pune / Mumbai, ops included",
      "Fleet SaaS: your riders and salesmen, you set the SLA, all-India coverage, in-app support",
      "Live GPS, task assignment, attendance, collections, and proof of delivery on one platform",
    ],
    outcome:
      "Distributors pick how to run pharma distribution without stitching vendors together. Same-day logistics in four metros, or software for a nationwide field force — both ship from FastWhistle.",
    image: "/images/projects/fastwhistle.jpg",
    imageFull: "/images/projects/fastwhistle-full.jpg",
    imageAlt: "FastWhistle landing page: Pharma Distribution, Two Ways to Run It — Logistics versus Fleet SaaS",
    liveUrl: "https://fastwhistle.com",
  },
  {
    id: "yaaro-fit",
    number: "02",
    name: "Yaaro Fit",
    description:
      "Track. Share. Earn. Repeat. A social fitness app from Zaploom — GPS runs, walks, and rides, gym logging, a kudos feed, clubs, challenges, and points you can redeem for real rewards.",
    role: "Design, Frontend & Backend · Zaploom Technology",
    year: "2026",
    accent: "#d0ea59",
    mock: "spatial",
    problem:
      "Most fitness apps stop at a private log. Without friends, clubs, or a reason to come back tomorrow, streaks die and the tracker becomes a graveyard of half-finished weeks.",
    approach:
      "Yaaro is built as a loop, not a spreadsheet: Track. Share. Earn. Repeat. I designed and contributed frontend and backend so activity, social, and rewards sit in one product — live on iOS, Android, and yaaro.fit.",
    features: [
      "Record: GPS running, walking, and cycling plus gym sets/reps/weight, dance, and yoga",
      "Share: activity feed with photos, milestones, and kudos from friends",
      "Earn: points, streaks, and challenges redeemable for fitness gear and vouchers",
      "Repeat: clubs, weekly and monthly leaderboards, and habit loops to stay consistent",
    ],
    outcome:
      "Yaaro Fit launched on the App Store and Google Play. The marketing site at yaaro.fit carries the same story: track the work, share it with people, earn something real, then do it again.",
    image: "/images/projects/yaaro-fit.jpg",
    imageFull: "/images/projects/yaaro-fit-full.jpg",
    imageAlt: "Yaaro Fit — Track. Share. Earn. Repeat. Social fitness app for runs, workouts, clubs, and rewards",
    liveUrl: "https://yaaro.fit",
  },
  {
    id: "bingo",
    number: "03",
    name: "BINGO",
    description:
      "Real-time multiplayer Bingo: create or join a room, share a 6-character code or invite link, play turns on a 15-second timer, and keep going until everyone is ranked.",
    technologies: ["React", "TypeScript", "Socket.IO", "Node.js", "Express", "Vite"],
    role: "Full-Stack · Personal project",
    year: "2026",
    accent: "#f97316",
    mock: "realtime",
    problem:
      "Casual multiplayer games usually break when someone refreshes, when two people pick the same number, or when the host’s laptop is the only source of truth. Bingo needs one shared board, one clock, and a fair ranking if more than two people play.",
    approach:
      "A React client and an Express + Socket.IO server with in-memory room state. The server owns the board, the turn, and the timer. Clients only send intent — create room, join, start, pick a number — and receive the same events everyone else does.",
    features: [
      "Rooms via 6-character code or invite link; host starts when at least two players have joined",
      "Global number pool: each number can be picked once, with a 15-second turn timer",
      "Automatic line detection and B-I-N-G-O progress; tournament mode ranks every player before the game ends",
      "Reconnection with a 60-second grace period so a refresh does not dump you from the room",
      "Responsive UI for desktop, tablet, and mobile",
    ],
    outcome:
      "A public, MIT-licensed full-stack game you can clone and run. Frontend and backend share one production process (Vite + Express + Socket.IO) with PM2 notes for a single in-memory instance.",
    image: "/images/projects/bingo.jpg",
    imageAlt: "BINGO on GitHub — real-time multiplayer Bingo with React and Socket.IO",
    sourceUrl: "https://github.com/Amanrajputtripurari/BINGO",
  },
];

export const services: Service[] = [
  {
    id: "svc-1",
    title: "Product Engineering",
    description: "End-to-end build of web products, from architecture to shipping.",
  },
  {
    id: "svc-2",
    title: "Frontend Systems",
    description: "Design systems and interfaces engineered for performance and scale.",
  },
  {
    id: "svc-3",
    title: "Technical Consulting",
    description: "Architecture review, performance audits, and technical strategy.",
  },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/Amanrajputtripurari" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/aman-rajput-tripurari/" },
];
