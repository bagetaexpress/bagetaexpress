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
import { getOrderItemsByStore } from "@/db/controllers/itemController";
import { getUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";

export default async function OrderSummary() {
  const user = await getUser();
  if (!user || !user.isEmployee) {
    redirect("/");
  }
  const ordersSummary = await getOrderItemsByStore(user.storeId ?? 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Zhrnutie objednávok</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zhrnutie aktívnych objednávok</DialogTitle>
          <DialogDescription>
            Ak objednávky nie sú ozavrené, tak zobrazené počty sa môžu zmeniť
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
