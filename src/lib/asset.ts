/** Prefix a public/ path with Vite's base (needed for GitHub Pages project sites). */
export function asset(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
