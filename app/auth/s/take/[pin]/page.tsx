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
    let success = true;
    try {
      const currUser = await getUser();
      if (!currUser) throw new Error("User not found");

      const order = await getOrderByPin(
        params.pin,
        currUser.schoolId,
        "ordered"
      );
      if (!order) throw new Error("Order not found");

      await updateOrderStatus(order.id, "pickedup");
    } catch (error) {
      console.error(error);
      success = false;
    }
    redirect("/auth/s/take?success=" + success);
  }

  async function cancleAction() {
    "use server";
    redirect("/auth/s/take");
  }

  return (
    <HandleOrder
      pin={params.pin}
      confirmText="Potvrdiť"
      confirmAction={confirmOrder}
      cancelAction={cancleAction}
    />
  );
}
