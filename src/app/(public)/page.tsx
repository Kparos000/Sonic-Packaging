import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { HeroSection } from "@/components/sections/hero-section";
import { ContentSection } from "@/components/sections/content-section";
import { CapabilitiesGrid } from "@/components/sections/capabilities-grid";
import { FacilitiesShowcase } from "@/components/sections/facilities-showcase";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

export const metadata: Metadata = {
  title: "Sonic Packaging — Engineering the packaging that moves African industry",
};

export default async function HomePage() {
  const sections = await getPageSections("home");

  return (
    <>
      <HeroSection content={sections["hero"]} />
      <ContentSection content={sections["who-we-are"]} tone="white" />
      <CapabilitiesGrid content={sections["capabilities-teaser"]} />
      <ContentSection content={sections["manufacturing"]} tone="white" />
      <ContentSection content={sections["technology"]} tone="ivory" />
      <ContentSection content={sections["quality-safety"]} tone="white" />
      <FacilitiesShowcase content={sections["facilities"]} />
      <TestimonialSection content={sections["customers"]} />
      <ContentSection content={sections["responsibility"]} tone="white" />
      <ContentSection content={sections["people"]} tone="ivory" />
      <FinalCtaSection content={sections["final-cta"]} />
    </>
  );
}
