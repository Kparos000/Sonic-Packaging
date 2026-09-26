import { z } from "zod";

// MUST exactly match the `EnquiryType` enum in prisma/schema.prisma, and
// maps 1:1 onto the Contact form's dropdown (brief section 22) — every
// option there needs a value here so a submission is never forced into
// "Other" or a nearby-but-wrong category.
export const ENQUIRY_TYPES = [
  "REQUEST_QUOTE",
  "EXISTING_CUSTOMER",
  "SUPPLIER",
  "PARTNERSHIP",
  "MEDIA",
  "CAREERS",
  "GENERAL",
  "OTHER",
] as const;

export type EnquiryTypeValue = (typeof ENQUIRY_TYPES)[number];

export const ENQUIRY_TYPE_LABELS: Record<EnquiryTypeValue, string> = {
  REQUEST_QUOTE: "Request a Quote",
  EXISTING_CUSTOMER: "Existing Customer",
  SUPPLIER: "Supplier/Vendor",
  PARTNERSHIP: "Partnership",
  MEDIA: "Media/Press",
  CAREERS: "Careers",
  GENERAL: "General Enquiry",
  OTHER: "Other",
};

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(200),
  company: z.string().trim().max(200).optional(),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address."),
  phone: z.string().trim().max(50).optional(),
  type: z.enum(ENQUIRY_TYPES),
  subject: z.string().trim().min(1, "Enter a subject.").max(200),
  message: z.string().trim().min(1, "Enter a message.").max(5000),
  consent: z
    .boolean()
    .refine((v) => v === true, "You must consent to be contacted to submit this form."),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
