"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-sonic-ivory px-6">
      <div className="w-full max-w-sm border border-sonic-charcoal/10 bg-sonic-white p-8 shadow-sm">
        <Image
          src="/brand/logo-horizontal-green.png"
          alt="Sonic Packaging"
          width={223}
          height={100}
          className="h-8 w-auto"
        />
        <h1 className="mt-6 text-xl font-bold text-sonic-charcoal">Admin sign in</h1>
        <p className="mt-1 text-sm text-sonic-charcoal/60">
          Sonic Packaging content and operations management.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-sonic-charcoal/60"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full border border-sonic-charcoal/20 bg-sonic-white px-3 py-2.5 text-sm text-sonic-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sonic-green"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-sonic-charcoal/60"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full border border-sonic-charcoal/20 bg-sonic-white px-3 py-2.5 text-sm text-sonic-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sonic-green"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full" disabled={pending}>
            {pending ? "Signing In…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
