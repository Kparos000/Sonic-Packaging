import { ButtonLink } from "@/components/ui/button";
import { Section, type SectionTone } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { SectionContent } from "@/lib/content/schema";

/**
 * The generic "eyebrow / heading / body / CTA" band — reused across most
 * of Home plus About, Operations, Quality & Safety, ESG and CSR. Renders
 * nothing if the section hasn't been published yet in the CMS, so a page
 * degrades gracefully instead of showing an empty gap with a heading.
 */
export function ContentSection({
  content,
  tone = "white",
  align = "left",
}: {
  content: SectionContent | null;
  tone?: SectionTone;
  align?: "left" | "center";
}) {
  if (!content) return null;
  const dark = tone === "charcoal" || tone === "green";

  return (
    <Section tone={tone}>
      <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
        {content.eyebrow && (
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-[0.2em]",
              dark ? "text-sonic-gold" : "text-sonic-green"
            )}
          >
            {content.eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">{content.heading}</h2>
        {content.body && (
          <p className={cn("mt-5 whitespace-pre-line text-base leading-relaxed", dark ? "opacity-90" : "opacity-80")}>
            {content.body}
          </p>
        )}
        {content.ctaLabel && content.ctaHref && (
          <div className="mt-8">
            <ButtonLink href={content.ctaHref} variant={dark ? "gold" : "outline"} size="md">
              {content.ctaLabel}
            </ButtonLink>
          </div>
        )}
      </div>
    </Section>
  );
}
