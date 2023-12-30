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
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user || !user.isEmployee) {
    redirect("/");
  }

  const schoolStats = await getSchoolsOrderStats(user.storeId ?? 0);
  const itemStats = await getItemsStats(user.storeId ?? 0);

  return (
    <div className=" relative min-h-full">
      <h1 className="text-3xl font-semibold pt-2">Dashboard</h1>
      <h1 className="text-2xl font-semibold pt-4">Schools</h1>
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
      <h1 className="text-2xl font-semibold pt-4">Items</h1>
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
          </Card>
        ))}
      </div>
    </div>
  );
}