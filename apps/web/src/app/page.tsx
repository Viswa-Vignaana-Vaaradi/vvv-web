"use client";

import { AboutUs } from "@/components/about-us";
import { ContactUs } from "@/components/contact-us";
import { DonationSection } from "@/components/donation-section";
import { Footer } from "@/components/footer";
import { GalleryIntro } from "@/components/gallery-intro";
import { Hero } from "@/components/hero-section";
import { Missions } from "@/components/missions";
import { NumbersSection } from "@/components/numbers-section";
import { Reason } from "@/components/reason";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="scroll-smooth">
      <Hero />
      <div id="about"><AboutUs /></div>
      <div id="missions"><Missions /></div>
      <NumbersSection />
      <div id="gallery"><GalleryIntro /></div>
      <div id="donate"><DonationSection /></div>
      <div id="contact" className="px-10 bg-white">
        <ContactUs />
        <Separator />
        <Reason />
      </div>
      <Footer />
    </div>
  );
}
