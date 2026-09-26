import type { RoleKey } from "./roles";

// One entry per item in the Admin navigation (brief section 24). Used to
// decide what a role can see in the sidebar and to guard each module's
// pages/Server Actions server-side.
export const ADMIN_MODULES = [
  "DASHBOARD",
  "WEBSITE_CONTENT",
  "MEDIA_LIBRARY",
  "CAPABILITIES_PRODUCTS",
  "INSIGHTS",
  "LEADERSHIP",
  "ORGANISATION_CHART",
  "FACILITIES",
  "TESTIMONIALS",
  "LEADS_CONTACT",
  "LEADS_QUOTES",
  "CAREERS_JOBS",
  "CAREERS_APPLICATIONS",
  "FACTORY_DASHBOARD",
  "ANALYTICS",
  "CRM",
  "USERS_PERMISSIONS",
  "SITE_SETTINGS",
  "AUDIT_LOG",
] as const;

export type AdminModule = (typeof ADMIN_MODULES)[number];

export const ADMIN_MODULE_LABELS: Record<AdminModule, string> = {
  DASHBOARD: "Dashboard",
  WEBSITE_CONTENT: "Website Content",
  MEDIA_LIBRARY: "Media Library",
  CAPABILITIES_PRODUCTS: "Capabilities / Products",
  INSIGHTS: "Insights",
  LEADERSHIP: "Leadership",
  ORGANISATION_CHART: "Organisation Chart",
  FACILITIES: "Facilities",
  TESTIMONIALS: "Customer Testimonials",
  LEADS_CONTACT: "Contact Submissions",
  LEADS_QUOTES: "Quote Requests",
  CAREERS_JOBS: "Job Openings",
  CAREERS_APPLICATIONS: "Applications",
  FACTORY_DASHBOARD: "Factory Dashboard",
  ANALYTICS: "Analytics",
  CRM: "CRM",
  USERS_PERMISSIONS: "Users & Permissions",
  SITE_SETTINGS: "Site Settings",
  AUDIT_LOG: "Audit Log",
};

// Role -> modules matrix, built directly from brief section 32. SUPER_ADMIN
// is expanded to every module at lookup time rather than listed by hand, so
// adding a module here automatically grants it to Super Admin too.
const ROLE_MODULE_GRANTS: Record<Exclude<RoleKey, "SUPER_ADMIN">, AdminModule[]> = {
  WEBSITE_ADMIN: [
    "DASHBOARD",
    "WEBSITE_CONTENT",
    "MEDIA_LIBRARY",
    "CAPABILITIES_PRODUCTS",
    "LEADERSHIP",
    "ORGANISATION_CHART",
    "FACILITIES",
    "SITE_SETTINGS",
  ],
  MARKETING_COMMS: [
    "DASHBOARD",
    "WEBSITE_CONTENT",
    "MEDIA_LIBRARY",
    "INSIGHTS",
    "TESTIMONIALS",
  ],
  HR: ["DASHBOARD", "CAREERS_JOBS", "CAREERS_APPLICATIONS"],
  SALES: ["DASHBOARD", "LEADS_CONTACT", "LEADS_QUOTES", "CRM"],
  OPERATIONS: ["DASHBOARD", "FACTORY_DASHBOARD"],
  LEADERSHIP: ["DASHBOARD", "ANALYTICS"],
  ANALYST: ["DASHBOARD", "ANALYTICS"],
};

export function modulesForRole(role: RoleKey): AdminModule[] {
  if (role === "SUPER_ADMIN") return [...ADMIN_MODULES];
  return ROLE_MODULE_GRANTS[role];
}

export function canAccessModule(role: RoleKey, module: AdminModule): boolean {
  if (role === "SUPER_ADMIN") return true;
  return ROLE_MODULE_GRANTS[role].includes(module);
}

// USERS_PERMISSIONS and AUDIT_LOG are system-level — Super Admin only, even
// though the loop above would already exclude every other role by omission.
// Kept as an explicit helper because "who can manage other admins" is worth
// being able to answer without reading the matrix.
export function isSuperAdminOnlyModule(module: AdminModule): boolean {
  return module === "USERS_PERMISSIONS" || module === "AUDIT_LOG";
}
