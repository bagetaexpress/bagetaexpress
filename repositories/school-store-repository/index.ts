import { db } from "@/db";
import { schoolStore, SchoolStore } from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function getMany({
  schoolId,
}: {
  schoolId: SchoolStore["schoolId"];
}): Promise<SchoolStore[]> {
  const res = await db
    .select()
    .from(schoolStore)
    .where(eq(schoolStore.schoolId, schoolId));

  return res;
}

async function updateSingle(
  data: Pick<SchoolStore, "schoolId" | "storeId"> & Partial<SchoolStore>,
) {
  await db
    .update(schoolStore)
    .set(data)
    .where(
      and(
        eq(schoolStore.schoolId, data.schoolId),
        eq(schoolStore.storeId, data.storeId),
      ),
    );
}

export const schoolStoreRepository = {
  getMany,
  updateSingle,
};
