import Link from "next/link";
import { requireModuleAccess } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { canAccessModule } from "@/lib/rbac";
import { ROLE_LABELS } from "@/lib/roles";

export default async function AdminDashboardPage() {
  const session = await requireModuleAccess("DASHBOARD");

  const [newContacts, newQuotes, newApplications, unconfirmedContent] = await Promise.all([
    canAccessModule(session.role, "LEADS_CONTACT")
      ? prisma.contactSubmission.count({ where: { status: "NEW" } })
      : Promise.resolve(null),
    canAccessModule(session.role, "LEADS_QUOTES")
      ? prisma.quoteRequest.count({ where: { status: "NEW" } })
      : Promise.resolve(null),
    canAccessModule(session.role, "CAREERS_APPLICATIONS")
      ? prisma.application.count({ where: { status: "NEW" } })
      : Promise.resolve(null),
    canAccessModule(session.role, "WEBSITE_CONTENT")
      ? prisma.contentVersion.count({
          where: { needsConfirmation: true, status: "PUBLISHED" },
        })
      : Promise.resolve(null),
  ]);

  const cards = (
    [
      newContacts !== null && {
        label: "New Enquiries",
        value: newContacts,
        href: "/admin/leads/contact",
      },
      newQuotes !== null && {
        label: "New Quote Requests",
        value: newQuotes,
        href: "/admin/leads/quotes",
      },
      newApplications !== null && {
        label: "New Applications",
        value: newApplications,
        href: "/admin/careers/applications",
      },
      unconfirmedContent !== null && {
        label: "Published Content Awaiting Confirmation",
        value: unconfirmedContent,
        href: "/admin/content",
      },
    ] as const
  ).filter((c): c is { label: string; value: number; href: string } => Boolean(c));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-sonic-charcoal">
        Welcome, {session.name.split(" ")[0]}.
      </h1>
      <p className="mt-1 text-sm text-sonic-charcoal/60">{ROLE_LABELS[session.role]}</p>

      {cards.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="border border-sonic-charcoal/10 bg-sonic-white p-6 transition-colors hover:border-sonic-green"
            >
              <p className="text-3xl font-extrabold text-sonic-charcoal">{card.value}</p>
              <p className="mt-1 text-sm text-sonic-charcoal/60">{card.label}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 max-w-lg text-sm text-sonic-charcoal/70">
          Your role doesn&rsquo;t have any dashboard metrics configured yet.
        </p>
      )}
    </div>
  );
}
