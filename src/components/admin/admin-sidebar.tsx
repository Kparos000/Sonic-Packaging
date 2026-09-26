import Link from "next/link";
import Image from "next/image";
import { ADMIN_NAV } from "@/lib/constants";
import { canAccessModule } from "@/lib/rbac";
import type { RoleKey } from "@/lib/roles";

export function AdminSidebar({ role }: { role: RoleKey }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sonic-charcoal/10 bg-sonic-white lg:block">
      <div className="border-b border-sonic-charcoal/10 p-6">
        <Link href="/admin">
          <Image
            src="/brand/logo-horizontal-green.png"
            alt="Sonic Packaging"
            width={223}
            height={100}
            className="h-8 w-auto"
          />
        </Link>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-sonic-charcoal/40">
          Admin
        </p>
      </div>
      <nav className="space-y-6 px-4 py-6">
        {ADMIN_NAV.map((group, i) => {
          const items = group.items.filter((item) => canAccessModule(role, item.module));
          if (items.length === 0) return null;
          return (
            <div key={i}>
              {group.label && (
                <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-sonic-charcoal/40">
                  {group.label}
                </p>
              )}
              <ul className="mt-2 space-y-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-sm px-2 py-2 text-sm font-medium text-sonic-charcoal/80 transition-colors hover:bg-sonic-ivory hover:text-sonic-charcoal"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
