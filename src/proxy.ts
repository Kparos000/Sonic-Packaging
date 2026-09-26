import { NextResponse, type NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE_NAME } from "@/lib/session";

// ============================================================================
// Proxy (Next.js 16's successor to Middleware — same job, new name).
// ============================================================================
// Two responsibilities, both "optimistic" (cookie-signature checks only,
// no database round-trip — see Next.js's authentication guide):
//
// 1. Host routing: admin.sonicpackaging.com and sonicpackaging.com are one
//    Next.js deployment. On the admin host, "/leads/contact" is rewritten
//    to "/admin/leads/contact" so the admin app's own URLs don't have to
//    repeat "/admin" — that path lives under src/app/admin/. On the main
//    host, nothing is rewritten. Locally there's no "admin." host, so
//    nothing is rewritten either — just visit /admin directly.
//
// 2. Auth gate: redirects signed-out visitors away from the admin area to
//    the login screen, and signed-in admins away from the login screen to
//    the dashboard. This is a fast first pass, not the real security
//    boundary — every admin Server Action and data read independently
//    re-verifies the session via src/lib/dal.ts, because Proxy runs on
//    prefetches too and must never be trusted on its own.
// ============================================================================

export default async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") ?? "";
  const isAdminHost = hostname.startsWith("admin.");

  let effectivePath = url.pathname;
  if (isAdminHost && !effectivePath.startsWith("/admin")) {
    effectivePath = effectivePath === "/" ? "/admin" : `/admin${effectivePath}`;
  }

  const isAdminArea = effectivePath.startsWith("/admin");
  const isLoginPath = effectivePath === "/admin/login";
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (isAdminArea && !isLoginPath) {
    const session = await decryptSession(token);
    if (!session) {
      const loginUrl = new URL(isAdminHost ? "/login" : "/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminHost && isLoginPath) {
    const session = await decryptSession(token);
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isAdminHost && url.pathname !== effectivePath) {
    const rewriteUrl = new URL(effectivePath, req.url);
    rewriteUrl.search = url.search;
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
