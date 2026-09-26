import { logout } from "@/lib/actions/auth";
import { ROLE_LABELS } from "@/lib/roles";
import type { SessionPayload } from "@/lib/session";

export function AdminTopbar({ session }: { session: SessionPayload }) {
  return (
    <header className="flex items-center justify-between border-b border-sonic-charcoal/10 bg-sonic-white px-6 py-4 lg:px-10">
      <div>
        <p className="text-sm font-bold text-sonic-charcoal">{session.name}</p>
        <p className="text-xs text-sonic-charcoal/50">{ROLE_LABELS[session.role]}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="text-xs font-semibold uppercase tracking-wider text-sonic-charcoal/60 transition-colors hover:text-sonic-green"
        >
          Sign Out
        </button>
      </form>
    </header>
  );
}
