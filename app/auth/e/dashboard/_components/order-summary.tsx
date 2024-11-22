import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { item } from "@/db/schema";
import { getUser } from "@/lib/user-utils";
import itemRepository from "@/repositories/item-repository";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function OrderSummary() {
  return (
    <Suspense
      fallback={
        <Button
          variant="outline"
          className="flex-1 sm:grow-0 opacity-50"
          disabled
        >
          Zhrnutie objednávok <Loader className="w-5 h-5 animate-spin" />
        </Button>
      }
    >
      <OrderSummaryInner />
    </Suspense>
  );
}

async function OrderSummaryInner() {
  const user = await getUser();
  if (!user || !user.isEmployee) {
    redirect("/");
  }
  const ordersSummary = await itemRepository.getManyWithQuantity({
    storeId: user.storeId,
    orderStatus: ["ordered"],
    isReservation: false,
    groupBy: [item.id],
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 sm:grow-0" variant="outline">
          Zhrnutie objednávok
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zhrnutie aktívnych objednávok</DialogTitle>
          <DialogDescription>
            Ak objednávky nie sú uzavrené, tak zobrazené počty sa môžu zmeniť
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-fit max-w-fit">p.č.</TableHead>
              <TableHead>Názov</TableHead>
              <TableHead>Počet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersSummary.map(({ item, quantity }, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{quantity}ks</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
