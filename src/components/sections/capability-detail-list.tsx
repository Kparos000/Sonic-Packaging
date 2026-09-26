import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { StatusBadge, type CapabilityStatusValue } from "@/components/ui/status-badge";
import { resolveOrOmit } from "@/lib/placeholder";
import { isProductionMode } from "@/lib/content/production-mode";

/**
 * The full Capabilities page body — one band per Capability, alternating
 * tone, each listing its published Products. Pulls straight from the
 * Capability/Product tables (not generic section JSON), since that's
 * where this content already lives as structured, admin-managed records —
 * which is also why, unlike the generic CMS sections (see
 * src/lib/content/get-page-content.ts), this component resolves the
 * [CEO CONFIRMATION REQUIRED] marker itself rather than getting
 * pre-resolved content: any free-text field an admin fills in here
 * (summary, description) can carry the marker just as easily as page-
 * builder copy can, and needs the same production-mode gating.
 */
export async function CapabilityDetailList() {
  const [capabilities, productionMode] = await Promise.all([
    prisma.capability.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        products: { where: { isPublished: true }, orderBy: { order: "asc" } },
      },
    }),
    isProductionMode(),
  ]);

  if (capabilities.length === 0) {
    return (
      <Section tone="white">
        <p className="max-w-lg border border-dashed border-sonic-charcoal/25 bg-sonic-ivory p-6 text-sm text-sonic-charcoal/60">
          Capabilities will appear here once published from Admin.
        </p>
      </Section>
    );
  }

  return (
    <>
      {capabilities.map((cap, i) => {
        const summary = resolveOrOmit(cap.summary, productionMode);
        const description = resolveOrOmit(cap.description, productionMode);
        return (
          <Section key={cap.id} tone={i % 2 === 0 ? "white" : "ivory"}>
            <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-start">
              <div>
                <StatusBadge status={cap.status as CapabilityStatusValue} />
                <h2 className="mt-4 text-2xl font-extrabold text-sonic-charcoal lg:text-3xl">
                  {cap.name}
                </h2>
              </div>
              <div>
                {summary && (
                  <p className="text-base leading-relaxed text-sonic-charcoal/80">{summary}</p>
                )}
                {description && (
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-sonic-charcoal/70">
                    {description}
                  </p>
                )}
                {cap.products.length > 0 && (
                  <ul className="mt-6 space-y-4">
                    {cap.products.map((p) => {
                      const productSummary = resolveOrOmit(p.summary, productionMode);
                      return (
                        <li key={p.id} className="border-l-2 border-sonic-green/30 pl-4">
                          <p className="font-bold text-sonic-charcoal">{p.name}</p>
                          {productSummary && (
                            <p className="text-sm text-sonic-charcoal/70">{productSummary}</p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </Section>
        );
      })}
    </>
  );
}
