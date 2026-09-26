import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { QuoteForm } from "@/components/forms/quote-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us about your packaging requirement and Sonic Packaging's commercial team will follow up with a quote.",
};

export default async function RequestAQuotePage() {
  const sections = await getPageSections("request-a-quote");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <Section tone="white">
        <div className="mx-auto max-w-2xl">
          <QuoteForm />
        </div>
      </Section>
    </>
  );
}
