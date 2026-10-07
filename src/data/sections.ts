export interface SectionMeta {
  id: string;
  number: string;
  label: string;
}

/**
 * Single source of truth for section numbering/labels. Navigation, the
 * scroll progress index, and each section component all read from this —
 * nothing hardcodes "03" or "Work" anywhere else.
 */
export const sections: SectionMeta[] = [
  { id: "hero", number: "01", label: "Intro" },
  { id: "about", number: "02", label: "About" },
  { id: "skills", number: "03", label: "Skills" },
  { id: "experience", number: "04", label: "Experience" },
  { id: "projects", number: "05", label: "Work" },
  { id: "services", number: "06", label: "Services" },
  { id: "contact", number: "07", label: "Contact" },
];
