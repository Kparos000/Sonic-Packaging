import "server-only";

// Zoho CRM integration abstraction (brief section 29):
//
//   FORM SUBMISSION -> SAVE TO SONIC DATABASE -> ACKNOWLEDGE SUBMISSION
//   -> ATTEMPT ZOHO SYNC -> RECORD RESULT
//
// "Do not make the public website dependent on Zoho being available" — so
// every call site (see src/lib/actions/contact.ts, quote.ts) treats a sync
// failure, or Zoho simply not being configured yet, as non-fatal: the
// enquiry/quote is already saved and acknowledged before this is ever
// called.
//
// isZohoConfigured() gates everything. With no Zoho credentials in the
// environment (the default until the client supplies them — see
// .env.example), callers skip the sync entirely and leave zohoStatus at
// its default NOT_SYNCED, and no CrmSyncLog row is written, because no
// attempt was actually made — "leave sync disabled" per the env file's own
// comment.
//
// Once credentials exist, syncLeadToZoho() below is where the real OAuth
// token exchange (against ZOHO_ACCOUNTS_URL) and Zoho Leads API call
// (against ZOHO_API_DOMAIN) get implemented, alongside the admin CRM
// module and the leads/RFQ "retry sync" action. Today it fails honestly
// rather than fabricating a Zoho record id — reaching it at all means
// isZohoConfigured() returned true but the integration itself isn't built
// yet, so it fails the same way a real network/API error would: recorded
// as SYNC_FAILED, retryable by an admin once the real call exists. Nothing
// in the calling actions needs to change when this is filled in.

export function isZohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
  );
}

export type ZohoLeadPayload = {
  kind: "CONTACT_SUBMISSION" | "QUOTE_REQUEST";
  reference: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  details: Record<string, string | undefined>;
};

export type ZohoSyncOutcome =
  | { ok: true; zohoRecordId: string; responsePayload?: unknown }
  | { ok: false; error: string; responsePayload?: unknown };

export async function syncLeadToZoho(lead: ZohoLeadPayload): Promise<ZohoSyncOutcome> {
  void lead; // not yet used — see the module comment above
  return {
    ok: false,
    error: "Zoho CRM sync is not yet implemented on this deployment.",
  };
}
