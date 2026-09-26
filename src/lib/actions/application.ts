"use server";

import { prisma } from "@/lib/prisma";
import { applicationFormSchema, type ApplicationFormInput } from "@/lib/validation/application";
import { validateAttachment, uploadLeadAttachment } from "@/lib/media/upload";

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ApplicationFormInput | "resume", string>>;
};

export const initialApplicationFormState: ApplicationFormState = { status: "idle" };

const GENERIC_ERROR: ApplicationFormState = {
  status: "error",
  message:
    "Something went wrong while sending your application. Please try again, or email us directly.",
};

export async function submitApplication(
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const raw = {
    fullName: formData.get("fullName")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() || undefined,
    jobId: formData.get("jobId")?.toString() || undefined,
    coverNote: formData.get("coverNote")?.toString() || undefined,
    consent: formData.get("consent") === "on",
  };

  const parsed = applicationFormSchema.safeParse(raw);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please fix the fields highlighted below.",
      fieldErrors: {
        fullName: flat.fullName?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        coverNote: flat.coverNote?.[0],
        consent: flat.consent?.[0],
      },
    };
  }

  // A CV is required to apply — unlike the optional attachments on
  // Contact/Request a Quote, an application without one isn't useful.
  const rawFile = formData.get("resume");
  if (!(rawFile instanceof File) || rawFile.size === 0) {
    return {
      status: "error",
      message: "Please fix the fields highlighted below.",
      fieldErrors: { resume: "Please attach your CV." },
    };
  }
  const attachmentError = validateAttachment(rawFile);
  if (attachmentError) {
    return {
      status: "error",
      message: "Please fix the fields highlighted below.",
      fieldErrors: { resume: attachmentError },
    };
  }

  const data = parsed.data;

  // Never trust a client-submitted job id at face value — only attach to a
  // job that's real and currently open; otherwise it's a general application.
  let jobId: string | null = null;
  if (data.jobId) {
    const job = await prisma.job.findFirst({
      where: { id: data.jobId, status: "OPEN" },
      select: { id: true },
    });
    jobId = job?.id ?? null;
  }

  try {
    const resumeMediaId = await uploadLeadAttachment(rawFile, `CV — ${data.fullName}`);
    if (!resumeMediaId) {
      // Storage isn't configured in this environment. Unlike a Contact/RFQ
      // attachment (where the enquiry is still useful without it), an
      // application with no CV attached isn't, so this is a real failure
      // here rather than a silent degrade.
      console.error(
        "[application] resume upload unavailable — BLOB_READ_WRITE_TOKEN not set."
      );
      return GENERIC_ERROR;
    }

    await prisma.application.create({
      data: {
        jobId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        coverNote: data.coverNote,
        resumeMediaId,
      },
    });
  } catch (err) {
    console.error("[application] failed to save:", err);
    return GENERIC_ERROR;
  }

  return { status: "success" };
}
