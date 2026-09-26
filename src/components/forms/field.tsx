import { cn } from "@/lib/utils";

// Shared visual language for every text input, select and textarea on the
// public lead-capture forms — mirrors the styling already established on
// the admin login form (src/app/admin/login/page.tsx) rather than
// inventing a second style.
export const fieldLabelClass =
  "text-xs font-semibold uppercase tracking-wider text-sonic-charcoal/60";

export const fieldControlClass =
  "mt-1 w-full border border-sonic-charcoal/20 bg-sonic-white px-3 py-2.5 text-sm text-sonic-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sonic-green disabled:cursor-not-allowed disabled:opacity-50";

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={fieldLabelClass}>
      {children}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs font-medium text-red-700">
      {message}
    </p>
  );
}

/** A page-level success or error banner, above the form. */
export function FormNotice({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <p
      role="alert"
      className={cn(
        "border px-4 py-3 text-sm font-medium",
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-sonic-green/20 bg-sonic-green/5 text-sonic-green"
      )}
    >
      {children}
    </p>
  );
}
