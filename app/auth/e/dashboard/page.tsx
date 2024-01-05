import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getItemsStats } from "@/db/controllers/itemController";
import { getSchoolsOrderStats } from "@/db/controllers/schoolController";
import { getUser } from "@/lib/userUtils";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import AddItemForm from "./_components/addItem";
import DeleteItemButton from "./_components/deleteItem";
import EditAllergens from "./_components/editAllergens";
import EditIngredients from "./_components/editIngredients";

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

  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold py-2">Dashboard</h1>
      <div className="flex gap-2">
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
      </div>
      <h2 className="text-2xl font-semibold pt-4">Schools</h2>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {schoolStats.map(({ school, ...stats }, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{school.name}</CardTitle>
              {/* <CardDescription></CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className=" grid grid-cols-2">
                <p>Ordered:</p>
                <p>{stats.ordered}</p>
                <p>Delivered:</p>
                <p>{stats.pickedup}</p>
                <p>Blocked:</p>
                <p>{stats.unpicked}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-2xl font-semibold pt-4">Items</h2>
      <div className="grid gap-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {itemStats.map(({ item, ...stats }, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className=" grid grid-cols-2">
                <p>Ordered:</p>
                <p>{stats.ordered}</p>
                <p>Delivered:</p>
                <p>{stats.pickedup}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full grid grid-cols-2 gap-1">
                <DeleteItemButton item={item} />
                <AddItemForm action="update" item={item}>
                  <Button>Update</Button>
                </AddItemForm>
              </div>
            </CardFooter>
          </Card>
        ))}
        <Card className=" h-full w-full flex justify-center items-center p-4">
          <AddItemForm action="add">
            <Button size="icon">
              <Plus />
            </Button>
          </AddItemForm>
        </Card>
      </div>
    </div>
  );
}
