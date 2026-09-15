import { useEffect, useState } from "react";
import CustomCursor from "@/components/cursor/CustomCursor";
import BackToTop from "@/components/layout/BackToTop";
import Navigation from "@/components/layout/Navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";
import About from "@/features/about/About";
import Contact from "@/features/contact/Contact";
import Experience from "@/features/experience/Experience";
import CinematicHero from "@/features/hero/CinematicHero";
import Projects from "@/features/projects/Projects";
import Services from "@/features/services/Services";
import Skills from "@/features/skills/Skills";
import { ScrollTrigger } from "@/lib/gsap";

export default function App() {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    if (!heroReady) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(id);
  }, [heroReady]);

  return (
    <>
      <CustomCursor />
      <LoadingScreen ready={heroReady} />
      <Navigation />
      <BackToTop />
      <main>
        <CinematicHero onReady={() => setHeroReady(true)} />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Services />
        <Contact />
      </main>
    </>
  );
}
