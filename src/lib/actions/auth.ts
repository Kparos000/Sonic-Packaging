"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, clearSessionCookie } from "@/lib/session";
import { loginSchema } from "@/lib/validation/auth";
import type { RoleKey } from "@/lib/roles";

export type LoginState = { error?: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { role: true },
  });

  // Same generic message whether the email is unknown, the account is
  // disabled, or the password is wrong — never reveal which one it was.
  if (!user || !user.isActive) {
    return { error: "Incorrect email or password." };
  }

  const passwordValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!passwordValid) {
    await prisma.auditLog.create({
      data: { userId: user.id, action: "LOGIN_FAILED", module: "Auth" },
    });
    return { error: "Incorrect email or password." };
  }

  await createSessionCookie({
    userId: user.id,
    role: user.role.key as RoleKey,
    name: user.name,
    email: user.email,
  });

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
    prisma.auditLog.create({
      data: { userId: user.id, action: "LOGIN", module: "Auth" },
    }),
  ]);

  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}
