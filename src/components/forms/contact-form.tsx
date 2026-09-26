"use client";

import { useActionState } from "react";
import { submitContactForm, initialContactFormState } from "@/lib/actions/contact";
import { ENQUIRY_TYPES, ENQUIRY_TYPE_LABELS } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { FieldLabel, FieldError, FormNotice, fieldControlClass } from "@/components/forms/field";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState
  );

  if (state.status === "success") {
    return (
      <div className="border border-sonic-green/20 bg-sonic-green/5 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
          Message sent
        </p>
        <h3 className="mt-3 text-xl font-bold text-sonic-charcoal">
          Thank you — we&rsquo;ve received your message.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-sonic-charcoal/70">
          Your reference number is{" "}
          <span className="font-mono font-bold text-sonic-charcoal">{state.reference}</span>.
          Please quote this if you contact us again about the same enquiry. A member of our team
          will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <input id="name" name="name" type="text" required className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.name} />
        </div>
        <div>
          <FieldLabel htmlFor="company">Company</FieldLabel>
          <input id="company" name="company" type="text" className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.company} />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" name="email" type="email" required className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.email} />
        </div>
        <div>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <input id="phone" name="phone" type="tel" className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.phone} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="type">What is this about?</FieldLabel>
        <select id="type" name="type" required defaultValue="" className={fieldControlClass}>
          <option value="" disabled>
            Choose one
          </option>
          {ENQUIRY_TYPES.map((value) => (
            <option key={value} value={value}>
              {ENQUIRY_TYPE_LABELS[value]}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.type} />
      </div>

      <div>
        <FieldLabel htmlFor="subject">Subject</FieldLabel>
        <input id="subject" name="subject" type="text" required className={fieldControlClass} />
        <FieldError message={state.fieldErrors?.subject} />
      </div>

      <div>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={fieldControlClass}
        />
        <FieldError message={state.fieldErrors?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="attachment">Attachment (optional)</FieldLabel>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
          className={`${fieldControlClass} py-2 file:mr-4 file:border-0 file:bg-sonic-charcoal/5 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-sonic-charcoal`}
        />
        <p className="mt-1 text-xs text-sonic-charcoal/50">PDF, Word, Excel, JPG or PNG. Up to 10MB.</p>
        <FieldError message={state.fieldErrors?.attachment} />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 border-sonic-charcoal/30 text-sonic-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sonic-green"
        />
        <label htmlFor="consent" className="text-sm text-sonic-charcoal/70">
          I agree to be contacted by Sonic Packaging about this enquiry and consent to my
          information being used for that purpose.
        </label>
      </div>
      <FieldError message={state.fieldErrors?.consent} />

      {state.status === "error" && state.message && (
        <FormNotice tone="error">{state.message}</FormNotice>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
