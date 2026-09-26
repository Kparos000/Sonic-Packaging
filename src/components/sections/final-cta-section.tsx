import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import type { SectionContent } from "@/lib/content/schema";

export function FinalCtaSection({ content }: { content: SectionContent | null }) {
  if (!content) return null;
  return (
    <Section tone="green" className="text-center">
      <h2 className="mx-auto max-w-2xl text-3xl font-extrabold lg:text-4xl">
        {content.heading}
      </h2>
      {content.body && (
        <p className="mx-auto mt-4 max-w-xl text-base opacity-90">{content.body}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {content.ctaLabel && content.ctaHref && (
          <ButtonLink href={content.ctaHref} variant="gold" size="lg">
            {content.ctaLabel}
          </ButtonLink>
        )}
        {content.secondaryCtaLabel && content.secondaryCtaHref && (
          <ButtonLink
            href={content.secondaryCtaHref}
            variant="outline"
            size="lg"
            className="border-sonic-white text-sonic-white hover:bg-sonic-white hover:text-sonic-charcoal"
          >
            {content.secondaryCtaLabel}
          </ButtonLink>
        )}
      </div>
    </Section>
  );
}
