import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { containsPlaceholder } from "@/lib/placeholder";
import { isProductionMode } from "./production-mode";
import type { SectionContent } from "./schema";

/**
 * All published section content for one page, keyed by section key
 * (e.g. sections["hero"], sections["who-we-are"]). One query per page
 * render, not one per section — and `cache()`-wrapped so multiple
 * components reading the same page during one request share the query.
 *
 * A section comes back `null` in two cases, and pages are written to
 * handle both the same way (render nothing for that section, not a
 * crash): nobody has published it in the CMS yet, or — the brief's
 * CRITICAL TRUTHFULNESS RULE — it still contains a [CEO CONFIRMATION
 * REQUIRED] marker and the site is in production mode. Outside production
 * mode the marker is left in place and rendered as-is, deliberately: that
 * visible marker on the review/staging site *is* the "content-validation
 * mechanism for admins to identify unverified content" the brief asks
 * for — it's the punch list, shown in context.
 */
export const getPageSections = cache(
  async (pageSlug: string): Promise<Record<string, SectionContent | null>> => {
    const [page, productionMode] = await Promise.all([
      prisma.page.findUnique({
        where: { slug: pageSlug },
        include: {
          sections: {
            include: { publishedVersion: true },
            orderBy: { order: "asc" },
          },
        },
      }),
      isProductionMode(),
    ]);

    if (!page) return {};

    const result: Record<string, SectionContent | null> = {};
    for (const section of page.sections) {
      if (!section.publishedVersion) {
        result[section.key] = null;
        continue;
      }
      const data = section.publishedVersion.data as SectionContent;
      result[section.key] =
        productionMode && containsPlaceholder(data) ? null : data;
    }
    return result;
  }
);
