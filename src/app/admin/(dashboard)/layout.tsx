import { requireSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

// Everything under this route group requires a valid session — proxy.ts
// already redirects signed-out visitors before they get here, but this is
// the real checkpoint (see src/lib/dal.ts's comment on why both exist).
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen bg-sonic-ivory">
      <AdminSidebar role={session.role} />
      <div className="flex-1">
        <AdminTopbar session={session} />
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
