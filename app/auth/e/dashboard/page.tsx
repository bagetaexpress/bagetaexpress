import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getUser } from "@/lib/user-utils";
import { ImageIcon, Loader, MoreHorizontal, Pencil, Plus } from "lucide-react";
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
import schoolRepository from "@/repositories/school-repository";
import itemRepository, { ItemStats } from "@/repositories/item-repository";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold py-2">Dashboard</h1>

        <div className="flex gap-2 flex-wrap">
          <OrderSummary />
          <ReservationSummary />
          <div className="hidden sm:flex items-center">
            <EditAllergens />
            <span className="w-[2px] h-7 rounded-full bg-muted"/>
            <EditIngredients />
            <span className="w-[2px] h-7 rounded-full bg-muted"/>
            <EditStoreSuspense />
          </div>
      </div>
      <div className="sm:hidden w-full pt-2">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" className="w-full">Zobraziť viac akcií</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Ďalšie akcie</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col gap-3">
              <EditAllergens />
              <div className="h-[2px] w-full rounded-full bg-muted" />
              <EditIngredients />
              <div className="h-[2px] w-full rounded-full bg-muted" />
              <EditStoreSuspense />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="secondary">Zavrieť</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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

  const schoolStatsMany = await schoolRepository.getSchoolStatsMany({
    storeId: user.storeId,
  });

  return (
    <>
      <div className="grid gap-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
        {schoolStatsMany.map((schoolStat, i) => (
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
    itemRepository.getStats({ storeId: user.storeId }),
    allergenRepository.getMany({ storeId: user.storeId }),
    ingredientRepository.getMany({ storeId: user.storeId }),
  ]);

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {itemStats.length} {itemStats.length === 1 ? "produkt" : itemStats.length >= 2 && itemStats.length <= 4 ? "produkty" : "produktov"}
          </span>
        </div>
        <AddItemForm
          allergens={allergens}
          ingredients={ingredients}
          action="add"
        >
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Pridať produkt
          </Button>
        </AddItemForm>
      </div>
      
      {/* Desktop table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Obrázok</TableHead>
              <TableHead>Názov</TableHead>
              <TableHead className="hidden lg:table-cell">Popis</TableHead>
              <TableHead className="text-right w-[100px]">Cena</TableHead>
              <TableHead className="text-right w-[100px]">Doručené</TableHead>
              <TableHead className="w-[100px] text-right">Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemStats.map((itemStat, i) => (
              <ItemRow
                key={i}
                itemStats={itemStat}
                allergens={allergens}
                ingredients={ingredients}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden divide-y">
        {itemStats.map((itemStat, i) => (
          <ItemRowMobile
            key={i}
            itemStats={itemStat}
            allergens={allergens}
            ingredients={ingredients}
          />
        ))}
      </div>
    </div>
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
        <Button className="flex-1 sm:grow-0 opacity-50" variant="ghost">
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

async function ItemRow({
  itemStats: { item, ...stats },
  allergens,
  ingredients,
}: {
  itemStats: ItemStats;
  allergens: Allergen[];
  ingredients: Ingredient[];
}) {
  const itemAllergens = await allergenRepository.getMany({
    itemId: item.id,
  });
  const itemIngredients = await ingredientRepository.getMany({
    itemId: item.id,
  });

  return (
    <TableRow className="group">
      <TableCell className="p-2">
        {item.imageUrl !== "" && item.imageUrl !== null ? (
          <Image
            src={item.imageUrl}
            width={64}
            height={64}
            alt={item.name}
            className="rounded-md w-16 h-12 object-cover"
          />
        ) : (
          <div className="w-16 h-12 rounded-md bg-muted flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="font-semibold text-base">{item.name}</div>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <span className="text-muted-foreground text-sm line-clamp-2">
          {item.description || "—"}
        </span>
      </TableCell>
      <TableCell className="text-right font-medium">
        {item.price.toFixed(2)} €
      </TableCell>
      <TableCell className="text-right">
        <Badge variant="secondary">{stats.pickedup ?? 0}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <AddItemForm
            allergens={allergens}
            ingredients={ingredients}
            action="update"
            item={{
              ...item,
              allergens: itemAllergens,
              ingredients: itemIngredients,
            }}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </AddItemForm>
          <DeleteItemButton item={item} variant="icon" />
        </div>
      </TableCell>
    </TableRow>
  );
}

async function ItemRowMobile({
  itemStats: { item, ...stats },
  allergens,
  ingredients,
}: {
  itemStats: ItemStats;
  allergens: Allergen[];
  ingredients: Ingredient[];
}) {
  const itemAllergens = await allergenRepository.getMany({
    itemId: item.id,
  });
  const itemIngredients = await ingredientRepository.getMany({
    itemId: item.id,
  });

  return (
    <div className="flex items-center gap-3 p-3">
      {item.imageUrl !== "" && item.imageUrl !== null ? (
        <Image
          src={item.imageUrl}
          width={56}
          height={56}
          alt={item.name}
          className="rounded-md w-14 h-14 object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-base truncate">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} €</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {stats.pickedup ?? 0} doručených
            </Badge>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <AddItemForm
            allergens={allergens}
            ingredients={ingredients}
            action="update"
            item={{
              ...item,
              allergens: itemAllergens,
              ingredients: itemIngredients,
            }}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="h-4 w-4 mr-2" />
              Upraviť
            </DropdownMenuItem>
          </AddItemForm>
          <DeleteItemButton item={item} variant="dropdown" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
