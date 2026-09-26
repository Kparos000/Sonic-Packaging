import { Section, type SectionTone } from "@/components/ui/section";
import type { SectionContent } from "@/lib/content/schema";

/** A numbered/lettered grid of short items with no status badge — used for
 * S.O.N.I.C. Values and the Eight Operating Tenets. Distinct from
 * CapabilitiesGrid (which always shows a Current/In Development/Future
 * badge) since these items never carry that kind of status. */
export function ItemsGridSection({
  content,
  tone = "white",
  columns = 3,
}: {
  content: SectionContent | null;
  tone?: SectionTone;
  columns?: 2 | 3 | 4;
}) {
  if (!content || !content.items?.length) return null;
  const dark = tone === "charcoal" || tone === "green";
  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Section tone={tone}>
      <div className="max-w-2xl">
        {content.eyebrow && (
          <p className={dark ? "text-xs font-bold uppercase tracking-[0.2em] text-sonic-gold" : "text-xs font-bold uppercase tracking-[0.2em] text-sonic-green"}>
            {content.eyebrow}
          </p>
        )}
        <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">{content.heading}</h2>
        {content.body && (
          <p className={dark ? "mt-5 text-base leading-relaxed opacity-90" : "mt-5 text-base leading-relaxed opacity-80"}>
            {content.body}
          </p>
        )}
      </div>
      <div className={`mt-10 grid gap-6 ${cols}`}>
        {content.items.map((item, i) => (
          <div
            key={i}
            className={
              dark
                ? "border border-sonic-white/15 p-6"
                : "border border-sonic-charcoal/10 bg-sonic-ivory p-6"
            }
          >
            <h3 className="font-bold">{item.heading}</h3>
            {item.body && (
              <p className={dark ? "mt-2 text-sm opacity-80" : "mt-2 text-sm text-sonic-charcoal/70"}>
                {item.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
