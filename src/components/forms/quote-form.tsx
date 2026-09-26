"use client";

import { useActionState } from "react";
import { submitQuoteRequest, initialQuoteFormState } from "@/lib/actions/quote";
import { PACKAGING_CATEGORIES } from "@/lib/validation/quote";
import { Button } from "@/components/ui/button";
import { FieldLabel, FieldError, FormNotice, fieldControlClass } from "@/components/forms/field";

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(
    submitQuoteRequest,
    initialQuoteFormState
  );

  if (state.status === "success") {
    return (
      <div className="border border-sonic-green/20 bg-sonic-green/5 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
          Request received
        </p>
        <h3 className="mt-3 text-xl font-bold text-sonic-charcoal">
          Thank you — we&rsquo;ve received your quote request.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-sonic-charcoal/70">
          Your reference number is{" "}
          <span className="font-mono font-bold text-sonic-charcoal">{state.reference}</span>.
          Please quote this if you contact us again about the same request. Our commercial team
          will review your requirements and be in touch.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="company">Company</FieldLabel>
          <input id="company" name="company" type="text" required className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.company} />
        </div>
        <div>
          <FieldLabel htmlFor="contactName">Contact Name</FieldLabel>
          <input
            id="contactName"
            name="contactName"
            type="text"
            required
            className={fieldControlClass}
          />
          <FieldError message={state.fieldErrors?.contactName} />
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
        <FieldLabel htmlFor="packagingCategory">Packaging Category</FieldLabel>
        <select
          id="packagingCategory"
          name="packagingCategory"
          required
          defaultValue=""
          className={fieldControlClass}
        >
          <option value="" disabled>
            Choose one
          </option>
          {PACKAGING_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.packagingCategory} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="product">Product / Packaging Required</FieldLabel>
          <input id="product" name="product" type="text" className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.product} />
        </div>
        <div>
          <FieldLabel htmlFor="quantity">Estimated Quantity</FieldLabel>
          <input id="quantity" name="quantity" type="text" className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.quantity} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="requiredDate">Required Date</FieldLabel>
        <input
          id="requiredDate"
          name="requiredDate"
          type="date"
          className={`${fieldControlClass} sm:w-64`}
        />
        <FieldError message={state.fieldErrors?.requiredDate} />
      </div>

      <div>
        <FieldLabel htmlFor="specifications">Description / Specifications</FieldLabel>
        <textarea
          id="specifications"
          name="specifications"
          rows={6}
          className={fieldControlClass}
        />
        <FieldError message={state.fieldErrors?.specifications} />
      </div>

      <div>
        <FieldLabel htmlFor="attachment">Upload Drawing / Specification / Image</FieldLabel>
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
          I agree to be contacted by Sonic Packaging about this request and consent to my
          information being used for that purpose.
        </label>
      </div>
      <FieldError message={state.fieldErrors?.consent} />

      {state.status === "error" && state.message && (
        <FormNotice tone="error">{state.message}</FormNotice>
      )}

      <Button type="submit" variant="gold" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Submit Request"}
      </Button>
    </form>
  );
}
