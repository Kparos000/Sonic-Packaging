// ============================================================================
// The [CEO CONFIRMATION REQUIRED] placeholder system.
// ============================================================================
// Brief section 4 (CRITICAL TRUTHFULNESS RULE): unconfirmed facts must use
// this visible internal placeholder, it must be editable through the CMS,
// and it must NEVER reach a normal visitor once production mode is on.
//
// This file is the one place that string lives — everything else (seed
// data, CMS field defaults, the admin "needs confirmation" list, the public
// renderer) imports it from here rather than retyping it.
// ============================================================================

export const CEO_PLACEHOLDER = "[CEO CONFIRMATION REQUIRED]";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Deep-scans any JSON-ish value for the placeholder marker. */
export function containsPlaceholder(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.includes(CEO_PLACEHOLDER);
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(containsPlaceholder);
  }
  return false;
}

/**
 * Resolves a single text field for the audience that's about to see it.
 *
 * - Internal/staging view (productionMode = false): returned unchanged, so
 *   editors can see exactly where the gaps are.
 * - Public production view (productionMode = true): the placeholder token
 *   (and the whitespace it was sitting in) is stripped out gracefully
 *   instead of leaking an internal marker to a real visitor.
 */
export function resolvePlaceholderText(
  value: string,
  productionMode: boolean
): string {
  if (!value.includes(CEO_PLACEHOLDER)) return value;
  if (!productionMode) return value;
  const pattern = new RegExp(`\\s*${escapeRegExp(CEO_PLACEHOLDER)}\\s*`, "g");
  return value.replace(pattern, " ").replace(/\s+/g, " ").trim();
}

/**
 * Same idea, but for an entire sentence/stat that only makes sense with the
 * real number in it — e.g. "Sonic operates [CEO CONFIRMATION REQUIRED]
 * production lines." In production mode there's no safe partial version of
 * that sentence, so the whole field resolves to `null` and the caller
 * should omit the block rather than render a half-sentence.
 */
export function resolveOrOmit(
  value: string | null | undefined,
  productionMode: boolean
): string | null {
  if (!value) return null;
  if (!value.includes(CEO_PLACEHOLDER)) return value;
  return productionMode ? null : value;
}
