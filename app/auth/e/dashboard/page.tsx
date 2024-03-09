import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ItemStats, getItemsStats } from "@/db/controllers/itemController";
import { getSchoolsOrderStats } from "@/db/controllers/schoolController";
import { getUser } from "@/lib/userUtils";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import AddItemForm from "./_components/addItem";
import DeleteItemButton from "./_components/deleteItem";
import EditAllergens from "./_components/editAllergens";
import EditIngredients from "./_components/editIngredients";
import { getAllergensByStoreId } from "@/db/controllers/allergenController";
import { getIngredientsByStoreId } from "@/db/controllers/ingredientController";
import Image from "next/image";
import SchoolCard from "./_components/schoolCard";
import { Allergen, Ingredient } from "@/db/schema";
import OrderSummary from "./_components/orderSummary";
import EditStore from "./_components/editStore";
import { getStore } from "@/db/controllers/storeController";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user || !user.isEmployee) {
    redirect("/");
  }

  const schoolStats = await getSchoolsOrderStats(user.storeId ?? 0);
  const itemStats = await getItemsStats(user.storeId ?? 0);
  const allergens = await getAllergensByStoreId(user.storeId ?? 0);
  const ingredients = await getIngredientsByStoreId(user.storeId ?? 0);
  const store = await getStore(user.storeId ?? 0);

  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold py-2">Dashboard</h1>

      <div className="flex gap-2 flex-wrap">
        <EditAllergens
          error={
            (searchParams.allergenError ?? undefined) as string | undefined
          }
        />
        <EditIngredients
          error={
            (searchParams.ingredientError ?? undefined) as string | undefined
          }
        />
        <OrderSummary />
        <EditStore store={store} />
      </div>

      <h2 className="text-2xl font-semibold pt-4">Školy</h2>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {schoolStats.map((schoolStat, i) => (
          <SchoolCard key={i} {...schoolStat} />
        ))}
      </div>

      <h2 className="text-2xl font-semibold pt-4">Produkty</h2>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {itemStats.map((itemStat, i) => (
          <ItemCard
            key={i}
            itemStats={itemStat}
            allergens={allergens}
            ingredients={ingredients}
          />
        ))}
        <Card className=" h-full w-full flex justify-center items-center p-4">
          <AddItemForm
            allergens={allergens}
            ingredients={ingredients}
            action="add"
          >
            <Button size="icon">
              <Plus />
            </Button>
          </AddItemForm>
        </Card>
      </div>
    </div>
  );
}

function ItemCard({
  itemStats: { item, ...stats },
  allergens,
  ingredients,
}: {
  itemStats: ItemStats;
  allergens: Allergen[];
  ingredients: Ingredient[];
}) {
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        {item.imageUrl != null && item.imageUrl != "" ? (
          <div className="flex justify-center mb-2">
            <Image
              src={item.imageUrl}
              width={200}
              height={200}
              alt="item image"
              className="rounded-md"
            />
          </div>
        ) : null}
        <p>Doručené: {stats.pickedup}</p>
      </CardContent>
      <CardFooter>
        <div className="w-full grid grid-cols-2 gap-1">
          <DeleteItemButton item={item} />
          <AddItemForm
            allergens={allergens}
            ingredients={ingredients}
            action="update"
            item={item}
          >
            <Button>Upraviť</Button>
          </AddItemForm>
        </div>
      </CardFooter>
    </Card>
  );
}
