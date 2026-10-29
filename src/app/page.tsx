import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { About } from "@/components/sections/about";
import { MortgageCalculator } from "@/components/sections/mortgage-calculator";
import { ContactFooter } from "@/components/sections/contact-footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <About />
        <MortgageCalculator />
      </main>
      <ContactFooter />
    </>
  );
}
