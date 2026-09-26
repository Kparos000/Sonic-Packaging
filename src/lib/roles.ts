// Framework-independent role identifiers — MUST exactly match the `RoleKey`
// enum values in prisma/schema.prisma (see seed.ts, which creates one Role
// row per key). Deliberately NOT imported from the generated Prisma client:
// this file has zero dependencies so it's safe to use from proxy.ts, which
// runs before most of the app and must never import a database driver.
export const ROLE_KEYS = [
  "SUPER_ADMIN",
  "WEBSITE_ADMIN",
  "MARKETING_COMMS",
  "HR",
  "SALES",
  "OPERATIONS",
  "LEADERSHIP",
  "ANALYST",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  SUPER_ADMIN: "Super Admin",
  WEBSITE_ADMIN: "Website Admin",
  MARKETING_COMMS: "Marketing / Comms",
  HR: "HR",
  SALES: "Sales",
  OPERATIONS: "Operations",
  LEADERSHIP: "Leadership",
  ANALYST: "Analyst",
};

export const ROLE_DESCRIPTIONS: Record<RoleKey, string> = {
  SUPER_ADMIN: "Everything.",
  WEBSITE_ADMIN: "Website content and site settings.",
  MARKETING_COMMS: "Content, media, insights, testimonials.",
  HR: "Jobs and applications.",
  SALES: "Enquiries and RFQs.",
  OPERATIONS: "Factory dashboard.",
  LEADERSHIP: "Dashboard and read access.",
  ANALYST: "Analytics and reporting.",
};

export function isRoleKey(value: string): value is RoleKey {
  return (ROLE_KEYS as readonly string[]).includes(value);
}
