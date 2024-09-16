import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ItemStats, getItemsStats } from "@/db/controllers/item-controller";
import { getSchoolsOrderStats } from "@/db/controllers/school-controller";
import { getUser } from "@/lib/user-utils";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import AddItemForm from "./_components/add-item";
import DeleteItemButton from "./_components/delete-item";
import EditAllergens, {
  EditAllergensLoader,
} from "./_components/edit-allergens";
import EditIngredients, {
  EditIngredientsLoader,
} from "./_components/edit-ingredients";
import { getAllergensByStoreId } from "@/db/controllers/allergen-controller";
import { getIngredientsByStoreId } from "@/db/controllers/ingredient-controller";
import Image from "next/image";
import SchoolCard, { SchoolCardPlaceholder } from "./_components/school-card";
import { Allergen, Ingredient } from "@/db/schema";
import OrderSummary from "./_components/order-summary";
import EditStore from "./_components/edit-store";
import { getStore } from "@/db/controllers/store-controller";
import { Suspense } from "react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user || !user.isEmployee) {
    redirect("/");
  }

  const [schoolStats, itemStats, allergens, ingredients, store] =
    await Promise.all([
      getSchoolsOrderStats(user.storeId ?? 0),
      getItemsStats(user.storeId ?? 0),
      getAllergensByStoreId(user.storeId ?? 0),
      getIngredientsByStoreId(user.storeId ?? 0),
      getStore(user.storeId ?? 0),
    ]);

  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold py-2">Dashboard</h1>

      <div className="flex gap-2 flex-wrap">
        <Suspense fallback={<EditAllergensLoader />}>
          <EditAllergens
            error={
              (searchParams.allergenError ?? undefined) as string | undefined
            }
          />
        </Suspense>
        <Suspense fallback={<EditIngredientsLoader />}>
          <EditIngredients
            error={
              (searchParams.ingredientError ?? undefined) as string | undefined
            }
          />
        </Suspense>
        <OrderSummary />
        <EditStore store={store} />
      </div>

      <h2 className="text-2xl font-semibold pt-4">Školy</h2>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {schoolStats.map((schoolStat, i) => (
          <Suspense key={i} fallback={<SchoolCardPlaceholder />}>
            <SchoolCard {...schoolStat} />
          </Suspense>
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
      {item.imageUrl !== "" && item.imageUrl !== null ? (
        <Image
          src={item.imageUrl}
          width={400}
          height={400}
          alt="Obrázok produktu"
          className="rounded-md w-full rounded-b-none aspect-video object-cover object-center"
        />
      ) : null}
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
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
