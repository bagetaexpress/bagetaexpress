import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SchoolStats } from "@/db/controllers/schoolController";
import EditOrderClose from "./editOrderClose";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import PrintOrderLabels from "./printOrderLabels";

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
        <div className="flex w-full gap-1">
          <EditOrderClose orderClose={orderClose} schoolId={school.id} />
          <PrintOrderLabels schoolId={school.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
