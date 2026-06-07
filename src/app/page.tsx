import { Navbar }      from "@/components/landing/Navbar";
import { Hero }        from "@/components/landing/Hero";
import { Features }    from "@/components/landing/Features";
import { HowItWorks }  from "@/components/landing/HowItWorks";
import { ExampleCards } from "@/components/landing/ExampleCards";
import { CtaBanner }   from "@/components/landing/CtaBanner";
import { Footer }      from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ExampleCards />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
