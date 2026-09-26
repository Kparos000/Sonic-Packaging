import type { AdminModule } from "./rbac";

export const SITE_NAME = "Sonic Packaging";

// Public primary navigation (brief section 12) — plus the persistent
// "Request a Quote" CTA, kept separate since it renders as a button, not a
// nav link.
export const PUBLIC_NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Operations", href: "/operations" },
  { label: "Quality & Safety", href: "/quality-safety" },
  { label: "ESG", href: "/esg" },
  { label: "Insights", href: "/insights" },
  { label: "CSR", href: "/csr" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const REQUEST_QUOTE_HREF = "/request-a-quote";
export const REQUEST_QUOTE_LABEL = "Request a Quote";

// Admin navigation (brief section 24), grouped exactly as specified, each
// item tagged with the AdminModule the sidebar uses to decide who sees it.
export type AdminNavItem = { label: string; href: string; module: AdminModule };
export type AdminNavGroup = { label: string | null; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
  { label: null, items: [{ label: "Dashboard", href: "/admin", module: "DASHBOARD" }] },
  {
    label: null,
    items: [
      { label: "Website Content", href: "/admin/content", module: "WEBSITE_CONTENT" },
      { label: "Media Library", href: "/admin/media", module: "MEDIA_LIBRARY" },
      {
        label: "Capabilities / Products",
        href: "/admin/capabilities",
        module: "CAPABILITIES_PRODUCTS",
      },
      { label: "Insights", href: "/admin/insights", module: "INSIGHTS" },
      { label: "Leadership", href: "/admin/leadership", module: "LEADERSHIP" },
      {
        label: "Organisation Chart",
        href: "/admin/org-chart",
        module: "ORGANISATION_CHART",
      },
      { label: "Facilities", href: "/admin/facilities", module: "FACILITIES" },
      {
        label: "Customer Testimonials",
        href: "/admin/testimonials",
        module: "TESTIMONIALS",
      },
    ],
  },
  {
    label: "Requests & Leads",
    items: [
      { label: "Contact Submissions", href: "/admin/leads/contact", module: "LEADS_CONTACT" },
      { label: "Quote Requests", href: "/admin/leads/quotes", module: "LEADS_QUOTES" },
    ],
  },
  {
    label: "Careers",
    items: [
      { label: "Job Openings", href: "/admin/careers/jobs", module: "CAREERS_JOBS" },
      {
        label: "Applications",
        href: "/admin/careers/applications",
        module: "CAREERS_APPLICATIONS",
      },
    ],
  },
  {
    label: null,
    items: [
      {
        label: "Factory Dashboard",
        href: "/admin/factory-dashboard",
        module: "FACTORY_DASHBOARD",
      },
      { label: "Analytics", href: "/admin/analytics", module: "ANALYTICS" },
      { label: "CRM", href: "/admin/crm", module: "CRM" },
    ],
  },
  {
    label: null,
    items: [
      { label: "Users & Permissions", href: "/admin/users", module: "USERS_PERMISSIONS" },
      { label: "Site Settings", href: "/admin/settings", module: "SITE_SETTINGS" },
      { label: "Audit Log", href: "/admin/audit-log", module: "AUDIT_LOG" },
    ],
  },
];

// SiteSetting keys (key/value table — see prisma schema). Centralised here
// so a typo in a setting key is a compile error, not a silent no-op.
export const SITE_SETTINGS = {
  PRODUCTION_MODE: "PRODUCTION_MODE",
} as const;
