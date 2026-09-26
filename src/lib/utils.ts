import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn-style helper: lets components accept a `className` prop
// and safely override default Tailwind classes instead of just appending.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
