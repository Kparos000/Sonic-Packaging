import Image from "next/image";
import Link from "next/link";
import { PUBLIC_NAV, REQUEST_QUOTE_HREF, REQUEST_QUOTE_LABEL } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { CEO_PLACEHOLDER } from "@/lib/placeholder";

// NOTE: contact details below are marked with the CEO-confirmation
// placeholder rather than invented — see src/lib/placeholder.ts. Once the
// Website Content CMS module (task #109) is built, this block becomes
// editable there instead of hard-coded here.
const REGISTERED_OFFICE = CEO_PLACEHOLDER;
const GENERAL_PHONE = CEO_PLACEHOLDER;
const GENERAL_EMAIL = CEO_PLACEHOLDER;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sonic-charcoal text-sonic-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-horizontal-white.png"
              alt="Sonic Packaging"
              width={223}
              height={100}
              className="h-9 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm text-sonic-white/70">
              Engineering the packaging that moves African industry.
            </p>
            <ButtonLink href={REQUEST_QUOTE_HREF} variant="gold" size="md" className="mt-6">
              {REQUEST_QUOTE_LABEL}
            </ButtonLink>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sonic-white/50">
              Navigate
            </h3>
            <ul className="mt-4 space-y-3">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-sonic-white/80 transition-colors hover:text-sonic-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sonic-white/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-sonic-white/80">
              <li>{REGISTERED_OFFICE}</li>
              <li>{GENERAL_PHONE}</li>
              <li>{GENERAL_EMAIL}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sonic-white/50">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/careers" className="text-sm text-sonic-white/80 hover:text-sonic-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/esg" className="text-sm text-sonic-white/80 hover:text-sonic-white">
                  ESG
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-sm text-sonic-white/80 hover:text-sonic-white">
                  Insights
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-sonic-white/10 pt-8 text-xs text-sonic-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Sonic Packaging Industries Limited. All rights reserved.</p>
          <p>Benin City, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
