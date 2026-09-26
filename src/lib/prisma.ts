import "server-only";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 has no Rust query engine — every database needs a driver
// adapter. @prisma/adapter-pg wraps `pg` (plain Postgres wire protocol),
// which works against Neon's pooled connection string exactly like any
// other Postgres provider — no vendor-specific driver required.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// The standard Next.js dev-mode singleton: without this, every hot-reload
// would construct a new PrismaClient (and a new connection pool) on top of
// the last one until the dev server runs out of connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
