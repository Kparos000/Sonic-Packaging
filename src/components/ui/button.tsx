import Link from "next/link";
import { cn } from "@/lib/utils";

// Shared visual language for every clickable "button-shaped" thing in the
// app — the actual <button> below, ButtonLink (an <a> styled the same way,
// for navigation), and anywhere else that needs the exact same look.
export type ButtonVariant = "primary" | "gold" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Sonic Green — the default action.
  primary: "bg-sonic-green text-sonic-white hover:bg-[#003b29]",
  // Sonic Gold — reserved for the single most important CTA on a page
  // (e.g. "Request a Quote"). Charcoal text on Gold keeps strong contrast;
  // the brand guide's "no Gold body text on light backgrounds" rule is
  // about text color, not fills like this one.
  gold: "bg-sonic-gold text-sonic-charcoal hover:bg-[#c3953f]",
  outline:
    "border border-sonic-charcoal text-sonic-charcoal hover:bg-sonic-charcoal hover:text-sonic-white",
  ghost: "text-sonic-charcoal hover:bg-sonic-charcoal/5",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-semibold uppercase tracking-wider transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** A real <button> — form submits, dialog triggers, etc. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}

type ButtonLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Same look as Button, but a real link — for navigation (use for CTAs). */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
