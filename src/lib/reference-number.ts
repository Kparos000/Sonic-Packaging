// Human-facing reference numbers for leads (brief sections 27–28):
//   Contact Submissions -> ENQ-000001
//   Quote Requests      -> RFQ-000001
//
// The number itself comes from a DB-assigned autoincrement column
// (`sequence` on ContactSubmission / QuoteRequest) so it's race-safe under
// concurrent submissions — this function only formats it. Kept pure and
// dependency-free so it's trivially unit-testable.
export function formatReference(
  prefix: "ENQ" | "RFQ",
  sequence: number
): string {
  return `${prefix}-${String(sequence).padStart(6, "0")}`;
}
