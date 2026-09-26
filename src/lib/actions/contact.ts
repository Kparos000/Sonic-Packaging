"use server";

import { prisma } from "@/lib/prisma";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation/contact";
import { formatReference } from "@/lib/reference-number";
import { validateAttachment, uploadLeadAttachment } from "@/lib/media/upload";
import { isZohoConfigured, syncLeadToZoho } from "@/lib/crm/zoho";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactFormInput | "attachment", string>>;
  reference?: string;
};

export const initialContactFormState: ContactFormState = { status: "idle" };

const GENERIC_ERROR: ContactFormState = {
  status: "error",
  message:
    "Something went wrong while sending your message. Please try again, or email us directly.",
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    company: formData.get("company")?.toString() || undefined,
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() || undefined,
    type: formData.get("type")?.toString() ?? "",
    subject: formData.get("subject")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    consent: formData.get("consent") === "on",
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please fix the fields highlighted below.",
      fieldErrors: {
        name: flat.name?.[0],
        company: flat.company?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        type: flat.type ? "Choose what this is about." : undefined,
        subject: flat.subject?.[0],
        message: flat.message?.[0],
        consent: flat.consent?.[0],
      },
    };
  }

  // Optional attachment, validated up front so a bad file produces a normal
  // field error rather than surfacing deep inside the upload step.
  const rawFile = formData.get("attachment");
  let attachmentFile: File | null = null;
  if (rawFile instanceof File && rawFile.size > 0) {
    const attachmentError = validateAttachment(rawFile);
    if (attachmentError) {
      return {
        status: "error",
        message: "Please fix the fields highlighted below.",
        fieldErrors: { attachment: attachmentError },
      };
    }
    attachmentFile = rawFile;
  }

  const data = parsed.data;

  let created: { id: string; sequence: number };
  let reference: string;
  try {
    // Interactive transaction: `reference` is derived from the DB-assigned
    // `sequence`, which isn't known until after insert, so this creates the
    // row with a unique placeholder, then updates it with the real
    // ENQ-000001-style reference — atomically, so the row is never visible
    // to an admin with a dangling placeholder.
    created = await prisma.$transaction(async (tx) => {
      const row = await tx.contactSubmission.create({
        data: {
          reference: `PENDING-${crypto.randomUUID()}`,
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          type: data.type,
          subject: data.subject,
          message: data.message,
        },
      });
      const ref = formatReference("ENQ", row.sequence);
      await tx.contactSubmission.update({
        where: { id: row.id },
        data: { reference: ref },
      });
      return { id: row.id, sequence: row.sequence };
    });
    reference = formatReference("ENQ", created.sequence);
  } catch (err) {
    console.error("[contact] failed to save submission:", err);
    return GENERIC_ERROR;
  }

  // The enquiry is saved and has its reference — everything below is
  // best-effort and must never turn an already-captured lead into an error
  // shown to the visitor.

  if (attachmentFile) {
    try {
      const mediaId = await uploadLeadAttachment(
        attachmentFile,
        `${reference} attachment — ${attachmentFile.name}`
      );
      if (mediaId) {
        await prisma.contactSubmission.update({
          where: { id: created.id },
          data: { attachmentMediaId: mediaId },
        });
      }
    } catch (err) {
      console.error(`[contact] ${reference}: attachment upload failed:`, err);
    }
  }

  if (isZohoConfigured()) {
    try {
      const outcome = await syncLeadToZoho({
        kind: "CONTACT_SUBMISSION",
        reference,
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        details: { type: data.type, subject: data.subject, message: data.message },
      });

      await prisma.$transaction([
        prisma.contactSubmission.update({
          where: { id: created.id },
          data: {
            zohoStatus: outcome.ok ? "SYNCED" : "SYNC_FAILED",
            zohoRecordId: outcome.ok ? outcome.zohoRecordId : undefined,
          },
        }),
        prisma.crmSyncLog.create({
          data: {
            targetType: "CONTACT_SUBMISSION",
            targetId: created.id,
            result: outcome.ok ? "SUCCESS" : "FAILURE",
            errorMessage: outcome.ok ? undefined : outcome.error,
          },
        }),
      ]);
    } catch (err) {
      console.error(`[contact] ${reference}: Zoho sync attempt failed:`, err);
    }
  }

  return { status: "success", reference };
}
