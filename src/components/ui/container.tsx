import { cn } from "@/lib/utils";

/** Centers content and caps its width — the horizontal rhythm every
 * section shares. Generous side padding on mobile, per the brand guide's
 * "generous whitespace" direction. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}
