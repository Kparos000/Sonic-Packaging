import { cn } from "@/lib/utils";
import { Container } from "./container";

export type SectionTone = "white" | "ivory" | "charcoal" | "green";

const TONE_CLASSES: Record<SectionTone, string> = {
  white: "bg-sonic-white text-sonic-charcoal",
  ivory: "bg-sonic-ivory text-sonic-charcoal",
  charcoal: "bg-sonic-charcoal text-sonic-white",
  green: "bg-sonic-green text-sonic-white",
};

/** The vertical rhythm every page section shares — a toned band, full
 * width, with a centered max-width Container inside it. */
export function Section({
  tone = "white",
  className,
  containerClassName,
  children,
  id,
}: {
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 lg:py-24", TONE_CLASSES[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
