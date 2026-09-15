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
    "I design and build scalable, performant and thoughtful digital products.",
  location: "Based remotely",
  email: "hello@example.com",
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
    "I'm a software engineer who works across the stack, turning ambitious product ideas into fast, reliable systems. My focus is the gap between engineering rigor and product feel — the parts of an experience users notice without knowing why.",
    "I care about clean architecture, measured performance, and interfaces that respect people's time. Most of what I ship sits at the intersection of frontend craft and backend systems design.",
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
    company: "Company Name",
    role: "Senior Software Engineer",
    period: "2023 — Present",
    summary: "Leading full-stack development for a core product surface.",
    highlights: [
      "Rebuilt the primary web client, cutting median load time significantly",
      "Designed the service layer connecting three downstream teams",
      "Mentored engineers through architecture and code review",
    ],
  },
  {
    id: "exp-2",
    company: "Previous Company",
    role: "Software Engineer",
    period: "2020 — 2023",
    summary: "Owned features end-to-end across web and backend services.",
    highlights: [
      "Shipped a real-time collaboration feature used by thousands of teams",
      "Introduced automated testing that reduced regressions in production",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    number: "01",
    name: "Project One",
    description:
      "A short, concrete description of the problem this project solved and the outcome it produced.",
    technologies: ["React", "TypeScript", "Node.js"],
    role: "Lead Engineer",
    year: "2025",
    accent: "#8fb2ff",
    mock: "console",
    problem: "The product surface had grown faster than the architecture. Load time and ownership were both slipping.",
    outcome: "Rebuilt the client around a typed service layer. Median load dropped, and three teams could ship without colliding.",
  },
  {
    id: "proj-2",
    number: "02",
    name: "Project Two",
    description:
      "A short, concrete description of the problem this project solved and the outcome it produced.",
    technologies: ["Next.js", "PostgreSQL", "AWS"],
    role: "Full-Stack Developer",
    year: "2024",
    accent: "#7ee0c3",
    mock: "realtime",
    problem: "Live updates were bolted on after the fact, so the UI drifted from the source of truth.",
    outcome: "Designed a single event path from Postgres to the client. State stayed honest under concurrent edits.",
  },
  {
    id: "proj-3",
    number: "03",
    name: "Project Three",
    description:
      "A short, concrete description of the problem this project solved and the outcome it produced.",
    technologies: ["React", "Three.js", "WebSockets"],
    role: "Frontend Engineer",
    year: "2024",
    accent: "#e2a37a",
    mock: "spatial",
    problem: "The story of the product lived in slides. The product itself could not show it.",
    outcome: "A spatial interface that carries the narrative in the object, not in a deck beside it.",
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
  { label: "GitHub", url: "https://github.com" },
  { label: "LinkedIn", url: "https://linkedin.com" },
  { label: "Twitter", url: "https://twitter.com" },
];
