import { ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A clearly-labeled stand-in for real Sonic photography/video that hasn't
 * been supplied yet. Brief section 5/13: never substitute unrelated
 * factory stock imagery and imply it's Sonic's own — an honest placeholder
 * beats a dishonest photo. Swapped for a real <Image>/<video> once Media
 * Library has the real asset (see MediaType in prisma/schema.prisma).
 */
export function MediaPlaceholder({
  label,
  kind = "image",
  className,
  aspect = "aspect-video",
}: {
  label: string;
  kind?: "image" | "video";
  className?: string;
  aspect?: string;
}) {
  const Icon = kind === "video" ? Video : ImageIcon;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 border border-dashed border-sonic-charcoal/25 bg-sonic-charcoal/[0.03] text-center",
        aspect,
        className
      )}
    >
      <Icon className="text-sonic-charcoal/30" size={28} aria-hidden />
      <p className="max-w-xs px-4 text-xs font-semibold uppercase tracking-wider text-sonic-charcoal/40">
        {label}
      </p>
    </div>
  );
}
