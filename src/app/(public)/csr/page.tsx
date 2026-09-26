import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { ItemsGridSection } from "@/components/sections/items-grid-section";

export const metadata: Metadata = {
  title: "CSR",
  description:
    "Sonic Packaging's corporate social responsibility pillars — skills, community and environment.",
};

export default async function CsrPage() {
  const sections = await getPageSections("csr");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <ItemsGridSection content={sections["pillars"]} tone="white" columns={3} />
      <ContentSection content={sections["programme-notes"]} tone="ivory" />
    </>
  );
}
