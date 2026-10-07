# Aman Rajput — Portfolio

Cinematic personal site built with React 19, TypeScript, Vite, GSAP, and Three.js.

**Live:** https://amanrajputtripurari.github.io/portfolio/

Deployed free via GitHub Pages (Actions builds `main` on every push).

## Scripts

```bash
npm run dev      # local server
npm run build    # typecheck + production bundle
npm run lint     # oxlint
npm run preview  # serve the production build
```

Imports use the `@/` alias (maps to `src/`). Example: `@/features/hero/CinematicHero`.

## Source layout

```
src/
  main.tsx                 # app bootstrap
  app/App.tsx              # page composition
  providers/               # React context (theme)
  components/              # shared UI, not page-specific
    layout/                # Navigation, BackToTop
    ui/                    # loaders, section heading
    cursor/                # custom cursor
    theme/                 # theme toggle
  features/                # one folder per page section
    hero/ about/ skills/ experience/ projects/ services/ contact/
  lib/                     # framework-agnostic helpers
    three/                 # WebGL scenes and graph
  hooks/                   # shared React hooks
  data/                    # copy and content
  types/                   # shared TypeScript types
  styles/                  # tokens + global CSS
public/                    # static assets (favicon, portrait)
```

Same-folder CSS modules stay relative (`./Foo.module.css`). Everything else is imported with `@/`.
