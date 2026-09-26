import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { ItemsGridSection } from "@/components/sections/items-grid-section";
import { LeadershipSection } from "@/components/sections/leadership-section";
import { OrganisationChartSection } from "@/components/sections/organisation-chart-section";
import { FacilityListSection } from "@/components/sections/facility-list-section";

export const metadata: Metadata = {
  title: "About Sonic Packaging",
  description:
    "From a plastics manufacturer to a packaging platform — Sonic Packaging's foundation, mission, values and leadership.",
};

export default async function AboutPage() {
  const sections = await getPageSections("about");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <ContentSection content={sections["our-company"]} tone="white" />
      <ContentSection content={sections["our-story"]} tone="charcoal" />
      <ItemsGridSection content={sections["mission"]} tone="white" columns={2} />
      <ItemsGridSection content={sections["values"]} tone="ivory" columns={3} />
      <ItemsGridSection content={sections["tenets"]} tone="charcoal" columns={4} />
      <LeadershipSection />
      <OrganisationChartSection />
      <FacilityListSection />
    </>
  );
}
