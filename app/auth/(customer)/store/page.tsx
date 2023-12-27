import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ItemCard from "@/components/itemCard";
import { getItemsBySchool } from "@/db/controllers/itemController";
import { getServerSession } from "next-auth";

export default async function Store() {
  const sesstion = await getServerSession(authOptions);
  if (!sesstion || !sesstion.user) {
    return null;
  }
  const items = await getItemsBySchool(sesstion.user.schoolId);
  return (
    <div>
      <h1 className="text-2xl font-semibold pt-2">Store</h1>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
