import { cn } from "@/lib/utils";

// Mirrors the CapabilityStatus enum in prisma/schema.prisma (kept as a
// plain union here rather than imported from the generated client, so
// presentational components never depend on the database layer).
export type CapabilityStatusValue = "CURRENT" | "IN_DEVELOPMENT" | "FUTURE";

const STATUS_LABEL: Record<CapabilityStatusValue, string> = {
  CURRENT: "Current",
  IN_DEVELOPMENT: "In Development",
  FUTURE: "Future",
};

const STATUS_CLASSES: Record<CapabilityStatusValue, string> = {
  CURRENT: "bg-sonic-green text-sonic-white",
  IN_DEVELOPMENT: "bg-sonic-gold text-sonic-charcoal",
  FUTURE: "border border-sonic-charcoal/30 text-sonic-charcoal/70",
};

/**
 * The single visual source of truth for "is this real today, or is Sonic
 * building toward it" — used on every Capability/Product card. Never
 * hard-code this distinction elsewhere; it comes from the database
 * (Capability.status / Product.status) so it stays accurate as the
 * business actually changes.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: CapabilityStatusValue;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        STATUS_CLASSES[status],
        className
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
