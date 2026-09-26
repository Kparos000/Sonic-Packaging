import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import type { SectionContent } from "@/lib/content/schema";

export function HeroSection({ content }: { content: SectionContent | null }) {
  if (!content) return null;
  return (
    <section className="bg-sonic-ivory">
      <Container className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          {content.eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
              {content.eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-sonic-charcoal lg:text-6xl">
            {content.heading}
          </h1>
          {content.body && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sonic-charcoal/80">
              {content.body}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {content.ctaLabel && content.ctaHref && (
              <ButtonLink href={content.ctaHref} variant="primary" size="lg">
                {content.ctaLabel}
              </ButtonLink>
            )}
            {content.secondaryCtaLabel && content.secondaryCtaHref && (
              <ButtonLink href={content.secondaryCtaHref} variant="outline" size="lg">
                {content.secondaryCtaLabel}
              </ButtonLink>
            )}
          </div>
        </div>
        <MediaPlaceholder
          label="Sonic Packaging hero video — to be supplied"
          kind="video"
          aspect="aspect-[4/3]"
        />
      </Container>
    </section>
  );
}
