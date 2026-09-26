"use client";

import { useActionState } from "react";
import { submitApplication, initialApplicationFormState } from "@/lib/actions/application";
import { Button } from "@/components/ui/button";
import { FieldLabel, FieldError, FormNotice, fieldControlClass } from "@/components/forms/field";

export function ApplicationForm({ jobs }: { jobs: { id: string; title: string }[] }) {
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialApplicationFormState
  );

  if (state.status === "success") {
    return (
      <div className="border border-sonic-green/20 bg-sonic-green/5 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sonic-green">
          Application received
        </p>
        <h3 className="mt-3 text-xl font-bold text-sonic-charcoal">Thank you for applying.</h3>
        <p className="mt-3 text-sm leading-relaxed text-sonic-charcoal/70">
          We&rsquo;ve received your CV and details. Our team reviews every application and will be
          in touch if there&rsquo;s a match.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <input id="fullName" name="fullName" type="text" required className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.fullName} />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" name="email" type="email" required className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <input id="phone" name="phone" type="tel" className={fieldControlClass} />
          <FieldError message={state.fieldErrors?.phone} />
        </div>
        {jobs.length > 0 && (
          <div>
            <FieldLabel htmlFor="jobId">Role</FieldLabel>
            <select id="jobId" name="jobId" defaultValue="" className={fieldControlClass}>
              <option value="">General Application</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="coverNote">Tell us why you would be a great fit</FieldLabel>
        <textarea id="coverNote" name="coverNote" rows={5} className={fieldControlClass} />
        <FieldError message={state.fieldErrors?.coverNote} />
      </div>

      <div>
        <FieldLabel htmlFor="resume">CV</FieldLabel>
        <input
          id="resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className={`${fieldControlClass} py-2 file:mr-4 file:border-0 file:bg-sonic-charcoal/5 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-sonic-charcoal`}
        />
        <p className="mt-1 text-xs text-sonic-charcoal/50">PDF, Word or image. Up to 10MB.</p>
        <FieldError message={state.fieldErrors?.resume} />
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
          I agree to be contacted by Sonic Packaging about this application and consent to my
          information, including my CV, being used for recruitment purposes.
        </label>
      </div>
      <FieldError message={state.fieldErrors?.consent} />

      {state.status === "error" && state.message && (
        <FormNotice tone="error">{state.message}</FormNotice>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Submit Application"}
      </Button>
    </form>
  );
}
