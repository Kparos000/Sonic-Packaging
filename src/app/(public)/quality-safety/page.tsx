import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { ItemsGridSection } from "@/components/sections/items-grid-section";

export const metadata: Metadata = {
  title: "Quality & Safety",
  description:
    "Quality at source. Safety before output. How Sonic Packaging approaches quality assurance, manufacturing standards, testing and safety.",
};

export default async function QualitySafetyPage() {
  const sections = await getPageSections("quality-safety");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <ItemsGridSection content={sections["pillars"]} tone="white" columns={4} />
      <ContentSection content={sections["certifications-notes"]} tone="ivory" />
    </>
  );
}
