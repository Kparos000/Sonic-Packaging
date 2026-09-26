import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSessionFromCookies, type SessionPayload } from "./session";
import { canAccessModule, type AdminModule } from "./rbac";

// Data Access Layer — the single place admin pages, Server Actions and
// Route Handlers go to find out who's asking. Session reads are wrapped in
// React's `cache()` so multiple calls during one render pass hit the cookie
// jar once, not once per component.
//
// Proxy (src/proxy.ts) only does an *optimistic* redirect based on the
// cookie being present and well-formed — every function below is the real
// checkpoint and must be called independently by anything that touches
// admin data, per Next.js's own guidance: Proxy is not a substitute for
// checks close to the data.

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  return readSessionFromCookies();
});

/** Redirects to the login screen if there is no valid session. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Redirects to the login screen if unauthenticated, or to the dashboard if
 * authenticated but not permitted to see this module. The dashboard itself
 * is granted to every role, so this never loops.
 */
export async function requireModuleAccess(
  module: AdminModule
): Promise<SessionPayload> {
  const session = await requireSession();
  if (!canAccessModule(session.role, module)) {
    redirect("/admin");
  }
  return session;
}
