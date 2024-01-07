import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SchoolStats } from "@/db/controllers/schoolController";

export default function SchoolCard({
  school,
  orderClose,
  ...stats
}: SchoolStats) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{school.name}</CardTitle>
        <CardDescription>
          Ukončenie objednávok:{" "}
          <span className="font-semibold">{orderClose.toLocaleString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className=" grid grid-cols-2">
          <p>Objednávky:</p>
          <p>{stats.ordered}</p>
          <p>Doručené:</p>
          <p>{stats.pickedup}</p>
          <p>Zablokované:</p>
          <p>{stats.unpicked}</p>
        </div>
      </CardContent>
      <CardFooter>
        {/* <div className="w-full grid grid-cols-2 gap-1">
          <Input
            type="date"
            name="orderClose"
            value={orderClose.toISOString().substring(0, 10)}
            className="col-span-2"
            required
          />
        </div> */}
      </CardFooter>
    </Card>
  );
}
