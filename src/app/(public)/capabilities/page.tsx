import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { CapabilityDetailList } from "@/components/sections/capability-detail-list";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "One manufacturing foundation. A growing packaging platform — what Sonic Packaging manufactures today, what's in development, and what's ahead.",
};

export default async function CapabilitiesPage() {
  const sections = await getPageSections("capabilities");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" align="center" />
      <CapabilityDetailList />
    </>
  );
}
