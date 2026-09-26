import Image from "next/image";
import Link from "next/link";
import { PUBLIC_NAV, REQUEST_QUOTE_HREF, REQUEST_QUOTE_LABEL } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-sonic-charcoal/10 bg-sonic-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
        <Link href="/" className="flex items-center" aria-label="Sonic Packaging — home">
          <Image
            src="/brand/logo-horizontal-green.png"
            alt="Sonic Packaging"
            width={223}
            height={100}
            priority
            className="h-8 w-auto lg:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-sonic-charcoal transition-colors hover:text-sonic-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={REQUEST_QUOTE_HREF} variant="gold" size="md">
            {REQUEST_QUOTE_LABEL}
          </ButtonLink>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
