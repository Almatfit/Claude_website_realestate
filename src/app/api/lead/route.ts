import { NextRequest, NextResponse } from "next/server";
import { submitLeadToGhl } from "@/lib/ghl";
import { INTEREST_OPTIONS, interestLabel } from "@/lib/lead";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTEREST_VALUES: string[] = INTEREST_OPTIONS.map((option) => option.value);

interface LeadRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  interest?: unknown;
  message?: unknown;
  consent?: unknown;
  company?: unknown; // honeypot — real visitors never see or fill this field
}

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: NextRequest) {
  let body: LeadRequestBody;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request body.");
  }

  // Honeypot: bots that fill the hidden field get a fake success (so they
  // learn nothing from the response) while we skip GHL entirely.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const interest = typeof body.interest === "string" ? body.interest : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const consent = body.consent === true;

  if (name.length < 2) return fail("Please enter your full name.");
  if (name.length > 120) return fail("That name looks too long.");
  if (!EMAIL_RE.test(email) || email.length > 254)
    return fail("Please enter a valid email address.");
  if (phone.replace(/\D/g, "").length < 10)
    return fail("Please enter a valid phone number.");
  if (!INTEREST_VALUES.includes(interest))
    return fail("Please select what you're interested in.");
  if (!consent)
    return fail("Please agree to be contacted before submitting.");
  if (message.length > 2000) return fail("Message is too long.");

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");

  const result = await submitLeadToGhl({
    firstName,
    lastName,
    email,
    phone,
    interestValue: interest,
    interestLabel: interestLabel(interest),
    message,
  });

  if (!result.ok) {
    console.error("[api/lead] GHL submission failed:", result.error);
    return fail(
      "We couldn't submit your request right now. Please call or email us directly.",
      502
    );
  }

  return NextResponse.json({ ok: true });
}
