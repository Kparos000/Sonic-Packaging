import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { resolveOrOmit } from "@/lib/placeholder";
import { isProductionMode } from "@/lib/content/production-mode";

export async function FacilityListSection() {
  const [facilities, productionMode] = await Promise.all([
    prisma.facility.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    isProductionMode(),
  ]);

  if (facilities.length === 0) return null;

  return (
    <Section tone="white">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">Facilities</p>
      <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">Built in Benin City.</h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {facilities.map((facility) => {
          const description = resolveOrOmit(facility.description, productionMode);
          return (
            <div key={facility.id}>
              <MediaPlaceholder label={`${facility.name} — photo to be supplied`} />
              <h3 className="mt-4 font-bold text-sonic-charcoal">
                {facility.name}
                {facility.isHeadquarters && (
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider text-sonic-green">
                    HQ
                  </span>
                )}
              </h3>
              <p className="text-sm text-sonic-charcoal/60">{facility.location}</p>
              {description && (
                <p className="mt-2 text-sm text-sonic-charcoal/70">{description}</p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
