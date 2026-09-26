import { z } from "zod";

export const applicationFormSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name.").max(200),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address."),
  phone: z.string().trim().max(50).optional(),
  // "" / absent = a general application, not tied to one open role — see
  // the Application.jobId comment in prisma/schema.prisma.
  jobId: z.string().trim().optional(),
  coverNote: z.string().trim().max(5000).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, "You must consent to be contacted to submit this application."),
});

export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;
