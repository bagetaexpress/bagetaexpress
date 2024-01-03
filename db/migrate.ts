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
  // Adding users
  await db.insert(tables.user).values([
    {
      id: 1,
      email: "admin@bageta.express",
      password: "$2b$10$3Pl5KENBH5ISt7WIPef/KuRJyRIKBsgW0OjXXKUhpJkyP7c1XRAQu",
      isAdmin: true,
    },
    {
      id: 2,
      email: "seller@bageta.express",
      password: "$2b$10$3Pl5KENBH5ISt7WIPef/KuRJyRIKBsgW0OjXXKUhpJkyP7c1XRAQu",
    },
    {
      id: 3,
      email: "employee@bageta.express",
      password: "$2b$10$3Pl5KENBH5ISt7WIPef/KuRJyRIKBsgW0OjXXKUhpJkyP7c1XRAQu",
    },
    {
      id: 4,
      email: "customer@bageta.express",
      password: "$2b$10$3Pl5KENBH5ISt7WIPef/KuRJyRIKBsgW0OjXXKUhpJkyP7c1XRAQu",
    },
    {
      id: 5,
      email: "gymn@bageta.express",
      password: "$2b$10$3Pl5KENBH5ISt7WIPef/KuRJyRIKBsgW0OjXXKUhpJkyP7c1XRAQu",
    },
  ]);

  // Adding schools
  await db.insert(tables.school).values([
    {
      id: 1,
      name: "SPST",
      websiteUrl: "https://spst.edu.sk",
      emailRegex: ".*@spstsnv.sk",
    },
    {
      id: 2,
      name: "Gymnázium",
      websiteUrl: "https://gymnazium.edu.sk",
      emailRegex: ".*@gymnazium.edu.sk",
    },
  ]);

  // Adding stores
  await db.insert(tables.store).values({
    id: 1,
    name: "Školský obchod",
    websiteUrl: "https://skolskyobchod.sk",
    desctiption: "Školský obchod popis",
  });
  // Adding items
  await db.insert(tables.item).values([
    {
      id: 1,
      name: "bageta",
      description: "bageta popis",
      price: "3.99",
      storeId: 1,
    },
    {
      id: 2,
      name: "test bageta",
      description: "najelpsia omega top bageta",
      price: "3.99",
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
      name: "maslo",
      storeId: 1,
    },
    {
      id: 2,
      number: 2,
      name: "muka",
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

  // Adding relations
  await db.insert(tables.customer).values([
    {
      userId: 1,
      schoolId: 1,
    },
    {
      userId: 4,
      schoolId: 1,
    },
    {
      userId: 5,
      schoolId: 2,
    },
  ]);
  await db.insert(tables.employee).values([
    {
      userId: 1,
      storeId: 1,
    },
    {
      userId: 3,
      storeId: 1,
    },
  ]);
  await db.insert(tables.seller).values([
    {
      userId: 1,
      storeId: 1,
      schoolId: 1,
    },
    {
      userId: 2,
      storeId: 1,
      schoolId: 1,
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

  // Adding orders
  await db.insert(tables.order).values([
    {
      id: 1,
      userId: 1,
      pin: "1234",
      status: "ordered",
    },
    {
      id: 2,
      userId: 4,
      pin: "4321",
      status: "ordered",
    },
    {
      id: 3,
      userId: 5,
      pin: "1111",
      status: "ordered",
    },
    {
      id: 4,
      userId: 5,
      pin: "2222",
      status: "pickedup",
    },
  ]);

  await db.insert(tables.orderItem).values([
    {
      orderId: 1,
      itemId: 1,
      quantity: 1,
    },
    {
      orderId: 1,
      itemId: 2,
      quantity: 2,
    },
    {
      orderId: 2,
      itemId: 1,
      quantity: 2,
    },
    {
      orderId: 3,
      itemId: 2,
      quantity: 1,
    },
    {
      orderId: 4,
      itemId: 1,
      quantity: 1,
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
