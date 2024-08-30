import type { Config } from "drizzle-kit";
import "dotenv/config";

<<<<<<< Updated upstream
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
=======
if (!process.env.DATABASE_URL) {
>>>>>>> Stashed changes
  throw new Error("DATABASE_URL is missing");
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
<<<<<<< Updated upstream
  driver: "turso",
=======
  driver: "mysql2",
>>>>>>> Stashed changes
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
