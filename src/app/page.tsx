import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { FeaturedListings } from "@/components/sections/featured-listings";
import { Services } from "@/components/sections/services";
import { About } from "@/components/sections/about";
import { Testimonials } from "@/components/sections/testimonials";
import { ContactFooter } from "@/components/sections/contact-footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeaturedListings />
        <Services />
        <About />
        <Testimonials />
      </main>
      <ContactFooter />
    </>
  );
}
