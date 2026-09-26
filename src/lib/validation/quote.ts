import { z } from "zod";

// Packaging categories offered on the Request a Quote form. Deliberately
// the full 5-category brand taxonomy (Brand Guidelines) rather than just
// the 3 Capabilities published so far (Plastics/Food Packaging/Cartons,
// see prisma/seed.ts) — a prospective customer's stated interest shouldn't
// be limited to whichever capability pages happen to be live yet.
export const PACKAGING_CATEGORIES = [
  "Plastics",
  "Food Packaging",
  "Cartons",
  "Chemical Packaging",
  "Industrial Packaging",
  "Other",
] as const;

export type PackagingCategoryValue = (typeof PACKAGING_CATEGORIES)[number];

export const quoteFormSchema = z.object({
  company: z.string().trim().min(1, "Enter your company name.").max(200),
  contactName: z.string().trim().min(1, "Enter your name.").max(200),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address."),
  phone: z.string().trim().max(50).optional(),
  packagingCategory: z.enum(PACKAGING_CATEGORIES, {
    error: "Choose a packaging category.",
  }),
  product: z.string().trim().max(300).optional(),
  quantity: z.string().trim().max(200).optional(),
  // From an <input type="date"> — "" means "not specified" (optional field).
  requiredDate: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date."),
  specifications: z.string().trim().max(5000).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, "You must consent to be contacted to submit this request."),
});

export type QuoteFormInput = z.infer<typeof quoteFormSchema>;
