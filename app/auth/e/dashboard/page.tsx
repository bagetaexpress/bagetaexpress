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
import { Loader, Plus } from "lucide-react";
import { redirect } from "next/navigation";
import AddItemForm from "./_components/add-item";
import DeleteItemButton from "./_components/delete-item";
import EditAllergens from "./_components/edit-allergens";
import EditIngredients from "./_components/edit-ingredients";
import Image from "next/image";
import SchoolCard, { SchoolCardPlaceholder } from "./_components/school-card";
import { Allergen, Ingredient, Store } from "@/db/schema";
import OrderSummary from "./_components/order-summary";
import EditStore from "./_components/edit-store";
import { Suspense } from "react";
import ReservationSummary from "./_components/reservation-summary";
import storeRepository from "@/repositories/store-repository";
import ingredientRepository from "@/repositories/ingredient-repository";
import allergenRepository from "@/repositories/allergen-repository";

export default function DashboardPage() {
  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold py-2">Dashboard</h1>

      <div className="flex gap-2 flex-wrap">
        <EditAllergens />
        <EditIngredients />
        <OrderSummary />
        <ReservationSummary />
        <EditStoreSuspense />
      </div>
      <h2 className="text-2xl font-semibold pt-4">Školy</h2>
      <Suspense
        fallback={
          <div className="flex min-h-40 justify-center items-center">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <SchoolDashboard />
      </Suspense>
      <h2 className="text-2xl font-semibold pt-4">Produkty</h2>
      <Suspense
        fallback={
          <div className="flex min-h-40 justify-center items-center">
            <Loader className="h-10 w-10 animate-spin" />
          </div>
        }
      >
        <ProductDashboard />
      </Suspense>
    </div>
  );
}

async function SchoolDashboard() {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    redirect("/");
  }

  const schoolStats = await getSchoolsOrderStats(user.storeId);

  return (
    <>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {schoolStats.map((schoolStat, i) => (
          <Suspense key={i} fallback={<SchoolCardPlaceholder />}>
            <SchoolCard {...schoolStat} />
          </Suspense>
        ))}
      </div>
    </>
  );
}

async function ProductDashboard() {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    redirect("/");
  }

  const [itemStats, allergens, ingredients] = await Promise.all([
    getItemsStats(user.storeId),
    allergenRepository.getMany({ storeId: user.storeId }),
    ingredientRepository.getMany({ storeId: user.storeId }),
  ]);

  return (
    <>
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
    </>
  );
}

async function EditStoreSuspense() {
  const user = await getUser();
  if (!user || !user.isEmployee || !user.storeId) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={
        <Button className="flex-1 sm:grow-0 opacity-50" variant="outline">
          Upraviť obchod <Loader className="h-5 w-5 animate-spin" />
        </Button>
      }
    >
      <EditStoreInner storeId={user.storeId} />
    </Suspense>
  );
}

async function EditStoreInner({ storeId }: { storeId: Store["id"] }) {
  const store = await storeRepository.getSingle({ storeId });
  return <EditStore store={store} />;
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
