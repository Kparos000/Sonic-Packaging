import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { CEO_PLACEHOLDER } from "@/lib/placeholder";
import type { SectionContent } from "@/lib/content/schema";

/**
 * Testimonials live in their own table (Testimonial), not in the section's
 * ContentVersion JSON — reviewing/publishing individual quotes is its own
 * admin workflow (brief section 25). This section only supplies the
 * heading/intro copy; the quotes are queried fresh here. isPublished
 * defaults false on every Testimonial row (see schema comment), so nothing
 * shows here until someone deliberately approves a real quote — until
 * then, the brief's own placeholder copy is shown instead of an empty
 * carousel.
 */
export async function TestimonialSection({
  content,
}: {
  content: SectionContent | null;
}) {
  if (!content) return null;

  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: 6,
  });

  return (
    <Section tone="ivory">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold lg:text-4xl">{content.heading}</h2>
        {content.body && (
          <p className="mt-5 text-base leading-relaxed text-sonic-charcoal/80">{content.body}</p>
        )}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {testimonials.length > 0 ? (
          testimonials.map((t) => (
            <blockquote key={t.id} className="border border-sonic-charcoal/10 bg-sonic-white p-6">
              <p className="text-sm italic leading-relaxed text-sonic-charcoal/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 text-xs font-bold uppercase tracking-wider text-sonic-charcoal/50">
                {t.customerName}
                {t.customerCompany ? `, ${t.customerCompany}` : ""}
              </footer>
            </blockquote>
          ))
        ) : (
          <blockquote className="border border-dashed border-sonic-charcoal/25 bg-sonic-white p-6 text-sm italic text-sonic-charcoal/50 lg:col-span-3">
            {CEO_PLACEHOLDER} — approved customer testimonial pending.
          </blockquote>
        )}
      </div>
    </Section>
  );
}
