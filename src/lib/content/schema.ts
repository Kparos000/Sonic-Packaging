import { z } from "zod";

// The shape stored in ContentVersion.data for most page sections (hero,
// "who we are", manufacturing, technology, quality & safety, facilities,
// responsibility, people, final CTA, and the capabilities teaser). One
// flexible shape rather than one bespoke schema per section — every one of
// these sections is fundamentally "eyebrow + heading + body + CTA(s), plus
// an optional list of sub-items" per the content brief. A section that
// genuinely needs something different (e.g. a stats grid) gets its own
// schema alongside this one, not a bolt-on to it.
export const sectionContentSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().min(1, "Heading is required"),
  body: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  items: z
    .array(
      z.object({
        status: z.enum(["CURRENT", "IN_DEVELOPMENT", "FUTURE"]).optional(),
        heading: z.string(),
        body: z.string().optional(),
      })
    )
    .optional(),
});

export type SectionContent = z.infer<typeof sectionContentSchema>;
