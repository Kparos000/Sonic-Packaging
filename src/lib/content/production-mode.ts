import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS } from "@/lib/constants";

/**
 * Whether the site is in "production mode" (brief section 4). Defaults to
 * false — the safe state — if the setting row doesn't exist yet (matches
 * prisma/seed.ts, which seeds it explicitly false). cache()-wrapped so
 * every section on a page shares one query per request.
 */
export const isProductionMode = cache(async (): Promise<boolean> => {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: SITE_SETTINGS.PRODUCTION_MODE },
  });
  return setting?.value === true;
});
