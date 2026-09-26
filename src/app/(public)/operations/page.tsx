import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { ItemsGridSection } from "@/components/sections/items-grid-section";
import { FacilityListSection } from "@/components/sections/facility-list-section";

export const metadata: Metadata = {
  title: "Operations",
  description:
    "How Sonic Packaging manufactures — production, technology, supply chain and facilities.",
};

export default async function OperationsPage() {
  const sections = await getPageSections("operations");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <ItemsGridSection content={sections["technology"]} tone="white" columns={3} />
      <ContentSection content={sections["technology-principle"]} tone="charcoal" align="center" />
      <ContentSection content={sections["supply-chain"]} tone="ivory" />
      <ContentSection content={sections["supply-chain-notes"]} tone="white" />
      <FacilityListSection />
      <ContentSection content={sections["facilities-notes"]} tone="ivory" />
    </>
  );
}
