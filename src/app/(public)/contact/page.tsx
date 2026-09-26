import type { Metadata } from "next";
import { getPageSections } from "@/lib/content/get-page-content";
import { ContentSection } from "@/components/sections/content-section";
import { ContactDetailsSection } from "@/components/sections/contact-details-section";
import { ContactForm } from "@/components/forms/contact-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sonic Packaging — discuss a packaging requirement, request a quote, explore a supplier relationship, or reach our corporate team.",
};

export default async function ContactPage() {
  const sections = await getPageSections("contact");

  return (
    <>
      <ContentSection content={sections["hero"]} tone="ivory" />
      <Section tone="white">
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </Section>
      <ContactDetailsSection />
    </>
  );
}
