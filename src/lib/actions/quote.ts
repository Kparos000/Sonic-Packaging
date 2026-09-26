"use server";

import { prisma } from "@/lib/prisma";
import { quoteFormSchema, type QuoteFormInput } from "@/lib/validation/quote";
import { formatReference } from "@/lib/reference-number";
import { validateAttachment, uploadLeadAttachment } from "@/lib/media/upload";
import { isZohoConfigured, syncLeadToZoho } from "@/lib/crm/zoho";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof QuoteFormInput | "attachment", string>>;
  reference?: string;
};

export const initialQuoteFormState: QuoteFormState = { status: "idle" };

const GENERIC_ERROR: QuoteFormState = {
  status: "error",
  message:
    "Something went wrong while sending your request. Please try again, or email us directly.",
};

export async function submitQuoteRequest(
  _prevState: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const raw = {
    company: formData.get("company")?.toString() ?? "",
    contactName: formData.get("contactName")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() || undefined,
    packagingCategory: formData.get("packagingCategory")?.toString() ?? "",
    product: formData.get("product")?.toString() || undefined,
    quantity: formData.get("quantity")?.toString() || undefined,
    requiredDate: formData.get("requiredDate")?.toString() || undefined,
    specifications: formData.get("specifications")?.toString() || undefined,
    consent: formData.get("consent") === "on",
  };

  const parsed = quoteFormSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please fix the fields highlighted below.",
      fieldErrors: {
        company: flat.company?.[0],
        contactName: flat.contactName?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        packagingCategory: flat.packagingCategory ? "Choose a packaging category." : undefined,
        product: flat.product?.[0],
        quantity: flat.quantity?.[0],
        requiredDate: flat.requiredDate?.[0],
        specifications: flat.specifications?.[0],
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
  const requiredDate = data.requiredDate ? new Date(data.requiredDate) : undefined;

  let created: { id: string; sequence: number };
  let reference: string;
  try {
    // Interactive transaction — see src/lib/actions/contact.ts for why the
    // reference is set in a follow-up update rather than at creation.
    created = await prisma.$transaction(async (tx) => {
      const row = await tx.quoteRequest.create({
        data: {
          reference: `PENDING-${crypto.randomUUID()}`,
          company: data.company,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          packagingCategory: data.packagingCategory,
          product: data.product,
          quantity: data.quantity,
          requiredDate,
          specifications: data.specifications,
        },
      });
      const ref = formatReference("RFQ", row.sequence);
      await tx.quoteRequest.update({
        where: { id: row.id },
        data: { reference: ref },
      });
      return { id: row.id, sequence: row.sequence };
    });
    reference = formatReference("RFQ", created.sequence);
  } catch (err) {
    console.error("[quote] failed to save request:", err);
    return GENERIC_ERROR;
  }

  // The request is saved and has its reference — everything below is
  // best-effort and must never turn an already-captured lead into an error
  // shown to the visitor.

  if (attachmentFile) {
    try {
      const mediaId = await uploadLeadAttachment(
        attachmentFile,
        `${reference} attachment — ${attachmentFile.name}`
      );
      if (mediaId) {
        await prisma.quoteRequest.update({
          where: { id: created.id },
          data: { attachmentMediaId: mediaId },
        });
      }
    } catch (err) {
      console.error(`[quote] ${reference}: attachment upload failed:`, err);
    }
  }

  if (isZohoConfigured()) {
    try {
      const outcome = await syncLeadToZoho({
        kind: "QUOTE_REQUEST",
        reference,
        name: data.contactName,
        company: data.company,
        email: data.email,
        phone: data.phone,
        details: {
          packagingCategory: data.packagingCategory,
          product: data.product,
          quantity: data.quantity,
          requiredDate: data.requiredDate,
          specifications: data.specifications,
        },
      });

      await prisma.$transaction([
        prisma.quoteRequest.update({
          where: { id: created.id },
          data: {
            zohoStatus: outcome.ok ? "SYNCED" : "SYNC_FAILED",
            zohoCrmId: outcome.ok ? outcome.zohoRecordId : undefined,
          },
        }),
        prisma.crmSyncLog.create({
          data: {
            targetType: "QUOTE_REQUEST",
            targetId: created.id,
            result: outcome.ok ? "SUCCESS" : "FAILURE",
            errorMessage: outcome.ok ? undefined : outcome.error,
          },
        }),
      ]);
    } catch (err) {
      console.error(`[quote] ${reference}: Zoho sync attempt failed:`, err);
    }
  }

  return { status: "success", reference };
}
