"use client";

import { AboutUs } from "@/components/about-us";
import { Hero } from "@/components/hero-section";
import { Missions } from "@/components/missions";
import { NumbersSection } from "@/components/numbers-section";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutUs />
      <Missions />
      <NumbersSection />
    </div>
  );
}
