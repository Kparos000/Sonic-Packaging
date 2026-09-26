import { Section } from "@/components/ui/section";
import { StatusBadge, type CapabilityStatusValue } from "@/components/ui/status-badge";
import type { SectionContent } from "@/lib/content/schema";

export function CapabilitiesGrid({ content }: { content: SectionContent | null }) {
  if (!content || !content.items?.length) return null;
  return (
    <Section tone="ivory">
      <h2 className="max-w-2xl text-3xl font-extrabold lg:text-4xl">{content.heading}</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 border border-sonic-charcoal/10 bg-sonic-white p-6"
          >
            {item.status && <StatusBadge status={item.status as CapabilityStatusValue} />}
            <h3 className="text-lg font-bold text-sonic-charcoal">{item.heading}</h3>
            {item.body && (
              <p className="text-sm leading-relaxed text-sonic-charcoal/70">{item.body}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
