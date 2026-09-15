export interface SectionMeta {
  id: string;
  number: string;
  label: string;
}

/**
 * Single source of truth for section numbering/labels. Navigation, the
 * scroll progress index, and each section component all read from this —
 * nothing hardcodes "03" or "PROJECTS" anywhere else.
 */
export const sections: SectionMeta[] = [
  { id: "hero", number: "01", label: "INTRO" },
  { id: "about", number: "02", label: "ABOUT" },
  { id: "skills", number: "03", label: "SKILLS" },
  { id: "experience", number: "04", label: "EXPERIENCE" },
  { id: "projects", number: "05", label: "PROJECTS" },
  { id: "services", number: "06", label: "SERVICES" },
  { id: "contact", number: "07", label: "CONTACT" },
];
