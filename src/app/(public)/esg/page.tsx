import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { ItemsGridSection } from "@/components/sections/items-grid-section";

export const metadata: Metadata = {
  title: "ESG",
  description: "Sonic Packaging's approach to Environment, Sustainability & Governance.",
};

export default async function EsgPage() {
  const sections = await getPageSections("esg");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <ItemsGridSection content={sections["environment"]} tone="white" columns={3} />
      <ItemsGridSection content={sections["social"]} tone="ivory" columns={4} />
      <ItemsGridSection content={sections["governance"]} tone="charcoal" columns={4} />
    </>
  );
}
