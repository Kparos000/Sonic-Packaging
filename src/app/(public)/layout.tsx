import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

// Every public page under this layout reads CMS content straight from
// Postgres (getPageSections -> prisma) with no dynamic API (cookies,
// headers, etc.) to signal it. Left alone, Next.js treats that as static
// and tries to run those queries once, at `next build` time — which is
// exactly what broke the Vercel build ("Can't reach database server at
// 127.0.0.1:5432": no DATABASE_URL is wired into the build step, only
// runtime). Forcing dynamic rendering here means every page under
// (public) is fetched fresh per-request instead, at runtime, which also
// happens to be what a CMS needs anyway — a page publish should show up
// immediately, not after the next deploy. React's cache() in dal/prisma
// call sites still dedupes repeat queries within one request.
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
