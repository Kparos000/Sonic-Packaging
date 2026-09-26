import "server-only";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import type { MediaType } from "@/generated/prisma";

// Files accepted from public lead-capture forms (Contact's "Optional
// Attachment", Request a Quote's "Upload Drawing / Specification /
// Image"). Kept intentionally narrow — documents, drawings and photos,
// not arbitrary uploads.
export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ALLOWED_ATTACHMENT_TYPES: Record<string, MediaType> = {
  "application/pdf": "PDF",
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/webp": "IMAGE",
  "application/msword": "DOCUMENT",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCUMENT",
  "application/vnd.ms-excel": "DOCUMENT",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "DOCUMENT",
};

/** Returns an error message if the file can't be accepted, or null if it's fine. */
export function validateAttachment(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return "That file is larger than the 10MB limit.";
  }
  if (!ALLOWED_ATTACHMENT_TYPES[file.type]) {
    return "That file type isn't supported. Please attach a PDF, Word, Excel, JPG or PNG file.";
  }
  return null;
}

/**
 * Uploads one already-validated lead attachment to private blob storage
 * and records it in the Media table with isLeadAttachment=true, so the
 * admin Media Library (editorial assets — hero images, product photos,
 * article art) can exclude it by default while the Leads/RFQ admin views
 * still join to this same table to preview or download what a customer
 * attached. Stored as `access: "private"` (requires an authenticated
 * request to fetch) rather than public, since these can be customer
 * specification drawings.
 *
 * Returns the new Media row's id, or null if BLOB_READ_WRITE_TOKEN isn't
 * configured in this environment — callers treat that as "no attachment
 * saved" rather than failing the whole submission over it (matches the
 * brief's principle, stated for Zoho but applied the same way here, of
 * never letting an optional integration block lead capture).
 */
export async function uploadLeadAttachment(
  file: File,
  title: string
): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(
      `[media] BLOB_READ_WRITE_TOKEN not set — skipping attachment upload for "${file.name}".`
    );
    return null;
  }

  const mediaType = ALLOWED_ATTACHMENT_TYPES[file.type] ?? "DOCUMENT";
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-120);
  const pathname = `lead-attachments/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "private",
    contentType: file.type,
  });

  const media = await prisma.media.create({
    data: {
      title,
      fileType: mediaType,
      mimeType: file.type,
      fileSize: file.size,
      url: blob.url,
      storageKey: blob.pathname,
      isLeadAttachment: true,
    },
  });

  return media.id;
}
