import "server-only";

// Thin server-only client for the GoHighLevel (LeadConnector) REST API.
// Never import this from a "use client" component — the `server-only`
// import makes that a build error, but it's also only ever reached via
// src/app/api/lead/route.ts, which is server-only by construction.

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export interface LeadRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interestValue: string;
  interestLabel: string;
  message: string;
}

export interface GhlSubmitResult {
  ok: boolean;
  contactId?: string;
  error?: string;
}

function ghlHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Version: GHL_API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function extractGhlError(
  body: Record<string, unknown> | null,
  fallback: string
): string {
  const message = body?.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.join(" ");
  return fallback;
}

/**
 * Upserts the lead as a GHL contact (tagged "website-lead" plus an
 * interest tag), then attaches the interest + message as a note.
 *
 * Returns ok:true only when GHL's own response confirms a contact id —
 * callers must treat anything else as a real failure, never a fake
 * success.
 */
export async function submitLeadToGhl(
  lead: LeadRecord
): Promise<GhlSubmitResult> {
  const token = process.env.GHL_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    return {
      ok: false,
      error: "GHL_TOKEN / GHL_LOCATION_ID are not configured on the server.",
    };
  }

  let upsertRes: Response;
  try {
    upsertRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders(token),
      body: JSON.stringify({
        locationId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        source: "Website — Schedule a consultation",
        tags: ["website-lead", `interest-${lead.interestValue}`],
      }),
    });
  } catch (err) {
    return {
      ok: false,
      error: `Could not reach GoHighLevel: ${(err as Error).message}`,
    };
  }

  const upsertBody = await safeJson(upsertRes);

  if (!upsertRes.ok) {
    return {
      ok: false,
      error: extractGhlError(upsertBody, `GoHighLevel returned ${upsertRes.status}.`),
    };
  }

  const contact = upsertBody?.contact as { id?: unknown } | undefined;
  const contactId =
    typeof contact?.id === "string"
      ? contact.id
      : typeof upsertBody?.id === "string"
        ? (upsertBody.id as string)
        : undefined;

  if (!contactId) {
    return { ok: false, error: "GoHighLevel did not confirm a contact id." };
  }

  // Best-effort: attach the interest + message as a note. A failure here
  // doesn't invalidate the lead — the contact already exists in GHL, and
  // this call is not what the caller's success state depends on.
  try {
    await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: ghlHeaders(token),
      body: JSON.stringify({
        body: `Interested in: ${lead.interestLabel}\n\nMessage:\n${
          lead.message || "(none provided)"
        }`,
      }),
    });
  } catch {
    // Non-fatal — see comment above.
  }

  return { ok: true, contactId };
}
