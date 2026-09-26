import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // This version of prisma.config.ts's datasource only accepts `url` and
    // `shadowDatabaseUrl` (checked directly against the installed
    // @prisma/config types) — there is no `directUrl` field here. Neon's
    // pooled connection string works for both the app and `prisma migrate`
    // in the normal case; see README.md for what to do if a migration hits
    // a prepared-statement error under PgBouncer.
    url: env('DATABASE_URL'),
  },
});
