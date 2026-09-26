import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { RoleKey } from "./roles";

// Read once per process. Throwing here (rather than at first login attempt)
// surfaces a missing secret immediately in dev/build instead of as a
// confusing runtime auth failure later.
const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error(
    "SESSION_SECRET is not set. Add it to your .env file (see .env.example) — generate one with `openssl rand -base64 32`."
  );
}
const encodedKey = new TextEncoder().encode(secret);

export const SESSION_COOKIE_NAME = "sonic_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours

export type SessionPayload = {
  userId: string;
  role: RoleKey;
  name: string;
  email: string;
};

/**
 * Signs a session JWT. Kept free of `cookies()`/`next/headers` so it can
 * also run inside proxy.ts, which reads the raw cookie off the request
 * instead (see src/proxy.ts).
 */
export async function encryptSession(payload: SessionPayload, expiresAt: Date) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(encodedKey);
}

export async function decryptSession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    const { userId, role, name, email } = payload as Record<string, unknown>;
    if (
      typeof userId !== "string" ||
      typeof role !== "string" ||
      typeof name !== "string" ||
      typeof email !== "string"
    ) {
      return null;
    }
    return { userId, role: role as RoleKey, name, email };
  } catch {
    // Expired, malformed, or signed with a different secret — treat all of
    // these the same: no session.
    return null;
  }
}

/** Sets the signed session cookie. Call from a Server Action only. */
export async function createSessionCookie(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encryptSession(payload, expiresAt);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/** Clears the session cookie. Call from a Server Action only (logout). */
export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

/** Reads + verifies the session from the current request's cookies. */
export async function readSessionFromCookies(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(token);
}
