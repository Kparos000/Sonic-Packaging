"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { PUBLIC_NAV, REQUEST_QUOTE_HREF, REQUEST_QUOTE_LABEL } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";

/** The hamburger + full-screen nav panel for small screens. Everything
 * above (desktop nav) is plain server-rendered markup — this is the one
 * piece of the header that needs client-side state (is the panel open). */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center text-sonic-charcoal"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-sonic-white">
          <nav className="flex flex-col gap-1 px-6 py-8">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-sonic-charcoal/10 py-4 text-lg font-semibold text-sonic-charcoal"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href={REQUEST_QUOTE_HREF}
              variant="gold"
              size="lg"
              onClick={() => setOpen(false)}
              className="mt-6"
            >
              {REQUEST_QUOTE_LABEL}
            </ButtonLink>
          </nav>
        </div>
      )}
    </div>
  );
}
