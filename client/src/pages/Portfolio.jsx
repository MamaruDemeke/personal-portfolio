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
import { SiteContentProvider } from "../hooks/useSiteContent.jsx";

export default function Portfolio() {
  return (
    <SiteContentProvider>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Certificates />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </SiteContentProvider>
  );
}
