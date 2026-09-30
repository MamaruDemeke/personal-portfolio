import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Marquee from "../components/Marquee.jsx";
import About from "../components/About.jsx";
import Skills from "../components/Skills.jsx";
import Experience from "../components/Experience.jsx";
import Certificates from "../components/Certificates.jsx";
import Projects from "../components/Projects.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import {
  SiteContentProvider,
  useSiteContent,
} from "../hooks/useSiteContent.jsx";

/** Keeps the browser tab icon in sync with the admin-managed favicon. */
function Favicon() {
  const { profile } = useSiteContent();
  useEffect(() => {
    if (!profile?.faviconUrl) return undefined;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    const prev = link.href;
    link.href = profile.faviconUrl;
    return () => {
      link.href = prev;
    };
  }, [profile?.faviconUrl]);
  return null;
}

function Sections() {
  const { sections } = useSiteContent();
  const show = (id) => sections?.[id]?.visible !== false;

  return (
    <>
      <Favicon />
      <Navbar />
      <main>
        <Hero />
        {show("marquee") && <Marquee />}
        <About />
        <Skills />
        <Experience />
        <Certificates />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function Portfolio() {
  return (
    <SiteContentProvider>
      <Sections />
    </SiteContentProvider>
  );
}