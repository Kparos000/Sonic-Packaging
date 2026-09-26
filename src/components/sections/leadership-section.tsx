import { prisma } from "@/lib/prisma";
import { Section } from "@/components/ui/section";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";

/**
 * Leadership records "must come from database... Do not invent
 * executives" (brief section 14). Until Admin has published any, this
 * renders an honest empty state rather than placeholder people.
 */
export async function LeadershipSection() {
  const executives = await prisma.executive.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <Section tone="white">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">Leadership</p>
      <h2 className="mt-3 text-3xl font-extrabold lg:text-4xl">
        The people leading the transformation.
      </h2>

      {executives.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {executives.map((exec) => (
            <div key={exec.id}>
              <MediaPlaceholder label={`${exec.name} — photo to be supplied`} aspect="aspect-square" />
              <h3 className="mt-4 font-bold text-sonic-charcoal">{exec.name}</h3>
              <p className="text-sm text-sonic-charcoal/60">{exec.title}</p>
              {exec.bio && <p className="mt-2 text-sm text-sonic-charcoal/70">{exec.bio}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 max-w-lg border border-dashed border-sonic-charcoal/25 bg-sonic-ivory p-6 text-sm text-sonic-charcoal/60">
          Leadership profiles will appear here once published from Admin.
        </p>
      )}
    </Section>
  );
}
