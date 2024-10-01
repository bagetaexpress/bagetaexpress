import { School, Seller, User, school, seller, user } from "@/db/schema";
import { db } from "@/db/index";
import { InferInsertModel, eq } from "drizzle-orm";

async function getMultiple({
  storeId,
}: {
  storeId: Seller["storeId"];
}): Promise<
  {
    user: User;
    seller: Seller;
    school: School;
  }[]
> {
  const found = await db
    .select()
    .from(seller)
    .innerJoin(user, eq(seller.userId, user.id))
    .innerJoin(school, eq(seller.schoolId, school.id))
    .where(eq(seller.storeId, storeId));
  return found;
}

async function createSingle(
  data: InferInsertModel<typeof seller>,
): Promise<Seller> {
  const res = await db
    .insert(seller)
    .values({
      userId: data.userId,
      storeId: data.storeId,
      schoolId: data.schoolId,
    })
    .returning();
  return res[0];
}

async function deleteSingle({
  userId,
}: {
  userId: Seller["userId"];
}): Promise<void> {
  await db.delete(seller).where(eq(seller.userId, userId));
}

async function getSingle({
  userId,
}: {
  userId: Seller["userId"];
}): Promise<Seller | null> {
  const [found] = await db
    .select()
    .from(seller)
    .where(eq(seller.userId, userId));
  return found ?? null;
}

export const sellerRepository = {
  getMultiple,
  createSingle,
  deleteSingle,
  getSingle,
};

export default sellerRepository;
