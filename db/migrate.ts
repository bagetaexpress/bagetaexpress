import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";
import { tables } from "./schema";
import config from "@/drizzle.config"

type Database = MySql2Database<Record<string, never>>;

async function main () {
  if (!config.dbCredentials.uri) {
    throw new Error("DATABASE_URL is not set");
  }

  const connection = createConnection(config.dbCredentials.uri)
  const db = drizzle(connection);

  if (process.argv.includes("--clear")) {
    console.log("Clearing database");
    await clearDatabase(db);
    console.log("Database cleared");
  }

  console.log("Migrating database");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Database migrated");

  console.log("Populating database");
  await populate(db)
  console.log("Database populated");

  connection.end();
}

async function clearDatabase(db: Database) {
  for (const schema of Object.values(tables)) {
    await db.delete(schema)
  }
}

async function populate(db: Database) {
  await db.insert(tables.user).values({
    id: 1,
    email: "tomas.zifcak197@gmail.com",
    password: "$2b$10$cysmMHO5aW.IwZQf.V66r.Z.rImdbF/gviKq9NZk5ybivcOcyS2Vq",
    isAdmin: true,
  })
  await db.insert(tables.school).values({
    id: 1,
    name: "SPST",
    websiteUrl: "https://spst.edu.sk",
    emailRegex: ".*@spstsnv.sk",
  })
  await db.insert(tables.store).values({
    id: 1,
    name: "Školský obchod",
    websiteUrl: "https://skolskyobchod.sk",
    desctiption: "Školský obchod popis",
  })
  await db.insert(tables.item).values({
    id: 1,
    name: "bageta",
    description: "bageta popis",
    price: "3.99",
    storeId: 1,
  })
  await db.insert(tables.item).values({
    id: 2,
    name: "test bageta",
    description: "najelpsia omega top bageta",
    price: "3.99",
    storeId: 1,
  })

  await db.insert(tables.customer).values({
    userId: 1,
    schoolId: 1,
  })
  await db.insert(tables.employee).values({
    userId: 1,
    storeId: 1,
  })

  await db.insert(tables.schoolStore).values({
    schoolId: 1,
    storeId: 1,
  })
}

main()
.then(() => {
  console.log("Migration complete");
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});