import { MySql2Database, drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";
import { tables } from "./schema";
import config from "@/drizzle.config";

type Database = MySql2Database<Record<string, never>>;

async function main() {
  if (!config.dbCredentials.uri) {
    throw new Error("DATABASE_URL is not set");
  }

  const connection = createConnection(config.dbCredentials.uri);
  const db = drizzle(connection);

  if (process.argv.includes("--clear")) {
    console.log("Clearing database");
    await clearDatabase(db);
    console.log("Database cleared");
  }

  console.log("Migrating database");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Database migrated");

  if (process.argv.includes("--populate")) {
    console.log("Populating database");
    await populate(db);
    console.log("Database populated");
  }

  connection.end();
}

async function clearDatabase(db: Database) {
  for (const schema of Object.values(tables)) {
    await db.delete(schema);
  }
}

async function populate(db: Database) {
  // Adding schools
  await db.insert(tables.school).values([
    {
      id: 1,
      name: "SPST",
      websiteUrl: "https://spst.edu.sk",
      emailDomain: "spstsnv.sk",
    },
    {
      id: 2,
      name: "Gymnázium",
      websiteUrl: "https://gymnazium.edu.sk",
      emailDomain: "gmail.com",
    },
  ]);

  // Adding stores
  await db.insert(tables.store).values({
    id: 1,
    name: "Školský obchod",
    imageUrl: "",
    adress: "adresa 1",
    websiteUrl: "https://skolskyobchod.sk",
    description: "Školský obchod popis",
  });
  // Adding items
  await db.insert(tables.item).values([
    {
      id: 1,
      name: "bageta",
      description: "bageta popis",
      price: "3.99",
      imageUrl: "",
      storeId: 1,
    },
    {
      id: 2,
      name: "test bageta",
      description: "najelpsia omega top bageta",
      price: "3.99",
      imageUrl: "",
      storeId: 1,
    },
  ]);
  await db.insert(tables.allergen).values([
    {
      id: 1,
      number: 1,
      name: "gluten",
      storeId: 1,
    },
    {
      id: 2,
      number: 2,
      name: "milk",
      storeId: 1,
    },
  ]);
  await db.insert(tables.ingredient).values([
    {
      id: 1,
      number: 1,
      name: "tomato",
      storeId: 1,
    },
    {
      id: 2,
      number: 2,
      name: "cheese",
      storeId: 1,
    },
  ]);
  await db.insert(tables.itemAllergen).values([
    {
      itemId: 1,
      allergenId: 1,
    },
    {
      itemId: 1,
      allergenId: 2,
    },
    {
      itemId: 2,
      allergenId: 1,
    },
  ]);
  await db.insert(tables.itemIngredient).values([
    {
      itemId: 1,
      ingredientId: 1,
    },
    {
      itemId: 1,
      ingredientId: 2,
    },
    {
      itemId: 2,
      ingredientId: 1,
    },
  ]);

  await db.insert(tables.schoolStore).values([
    {
      schoolId: 1,
      storeId: 1,
    },
    {
      schoolId: 2,
      storeId: 1,
    },
  ]);
}

main()
  .then(() => {
    console.log("Migration complete");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
