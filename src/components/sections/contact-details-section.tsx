import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";

/**
 * Renders each published Facility's address/phone/email on the Contact
 * page. Deliberately reuses the Facility model (rather than a separate
 * hardcoded contact-details block) — these locations are the same ones
 * shown on About's facilities showcase, and CMS-editable the same way
 * once the admin Facilities module ships.
 */
export async function ContactDetailsSection() {
  const facilities = await prisma.facility.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  if (facilities.length === 0) return null;

  return (
    <Section tone="ivory">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
        Our Locations
      </p>
      <div className="mt-6 grid gap-10 sm:grid-cols-2">
        {facilities.map((facility) => (
          <div key={facility.id}>
            <h3 className="font-bold text-sonic-charcoal">
              {facility.name}
              {facility.isHeadquarters && (
                <span className="ml-2 text-xs font-bold uppercase tracking-wider text-sonic-green">
                  HQ
                </span>
              )}
            </h3>
            {facility.address && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-sonic-charcoal/70">
                {facility.address}
              </p>
            )}
            {(facility.phone || facility.email) && (
              <div className="mt-3 space-y-1 text-sm">
                {facility.phone && (
                  <p>
                    <a
                      href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`}
                      className="font-semibold text-sonic-charcoal hover:text-sonic-green"
                    >
                      {facility.phone}
                    </a>
                  </p>
                )}
                {facility.email && (
                  <p>
                    <a
                      href={`mailto:${facility.email}`}
                      className="font-semibold text-sonic-charcoal hover:text-sonic-green"
                    >
                      {facility.email}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
