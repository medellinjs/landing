import HeroSection from "../components/HeroSection";
import AboutUs from "../components/AboutUs";
import Events from "../components/Events";
import SpeakerCTA from "../components/SpeakerCTA";
// import Resources from "../components/Resources";
import Sponsors from "../components/Sponsors";
import Community from "../components/Community";
import Newsletter from "../components/Newsletter";
// import JobOffers from "../components/JobOffers";
import ActiveOrganizersSection from "../components/ActiveOrganizers";
// import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar navClass="nav-light" />
      <main>
        <HeroSection />
        <AboutUs />

        <Events />
        <SpeakerCTA />
        {/* <Resources /> */}
        <Sponsors />
        {/* <JobOffers /> */}
        <Community />
        <Newsletter />
        <ActiveOrganizersSection />
        {/* <Contact /> */}
      </main>
      <Footer />
    </>
  );
}
