import { Button } from "@/components/ui/button";
import { getItemsFromOrder } from "@/db/controllers/itemController";
import {
  getOrderByPin,
  updateOrderStatus,
} from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import HandleOrder from "../../_components/handleOrder";

export default async function TakePinPage({
  params,
}: {
  params: { pin: string };
}) {
  async function confirmOrder() {
    "use server";
    const currUser = await getUser();
    if (!currUser) return null;

    const order = await getOrderByPin(params.pin, currUser.schoolId, "ordered");
    if (!order) return null;

    await updateOrderStatus(order.id, "pickedup");
    redirect("/auth/s/take?success=true");
  }

  async function cancleAction() {
    "use server";
    redirect("/auth/s/take");
  }

  return (
    <HandleOrder
      pin={params.pin}
      confirmText="Confirm"
      confirmAction={confirmOrder}
      cancelAction={cancleAction}
    />
  );
}
