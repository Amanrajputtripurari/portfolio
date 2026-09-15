import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Navigation from "./components/navigation/Navigation";
import CinematicHero from "./components/hero/CinematicHero";
import CustomCursor from "./components/cursor/CustomCursor";
import About from "./components/sections/About";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Services from "./components/sections/Services";
import Contact from "./components/sections/Contact";
import BackToTop from "./components/BackToTop";
import { ScrollTrigger } from "./utils/gsapSetup";

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
