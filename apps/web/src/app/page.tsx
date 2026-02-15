"use client";

import { AboutUs } from "@/components/about-us";
import { ContactUs } from "@/components/contact-us";
import { GalleryIntro } from "@/components/gallery-intro";
import { Hero } from "@/components/hero-section";
import { Missions } from "@/components/missions";
import { NumbersSection } from "@/components/numbers-section";
import { Reason } from "@/components/reason";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutUs />
      <Missions />
      <NumbersSection />
      <GalleryIntro />
      <div className="px-10 bg-white">
        <ContactUs />
        <Separator />
        <Reason />
      </div>

    </div>
  );
}
