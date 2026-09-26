import { Section } from "@/components/ui/section";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import type { SectionContent } from "@/lib/content/schema";

export function FacilitiesShowcase({ content }: { content: SectionContent | null }) {
  if (!content) return null;
  return (
    <Section tone="white">
      <div className="max-w-2xl">
        {content.eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
            {content.eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">{content.heading}</h2>
        {content.body && (
          <p className="mt-5 text-base leading-relaxed text-sonic-charcoal/80">{content.body}</p>
        )}
      </div>
      {content.items?.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {content.items.map((item, i) => (
            <div key={i}>
              <MediaPlaceholder label={`${item.heading} — photo to be supplied`} />
              <h3 className="mt-3 font-bold text-sonic-charcoal">{item.heading}</h3>
              {item.body && (
                <p className="mt-1 text-sm text-sonic-charcoal/70">{item.body}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
