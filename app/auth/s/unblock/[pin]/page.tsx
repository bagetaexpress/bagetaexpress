import {
  getOrderByPin,
  updateOrderStatus,
} from "@/db/controllers/orderController";
import { getUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import HandleOrder from "../../_components/handleOrder";

export default async function UnlockPinPage({
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
        "unpicked",
      );
      if (!order) throw new Error("Order not found");

      await updateOrderStatus(order.id, "cancelled");
    } catch (error) {
      console.error(error);
      success = false;
    }
    redirect("/auth/s/unblock?success=" + success);
  }

  async function cancleAction() {
    "use server";
    redirect("/auth/s/unblock");
  }

  return (
    <HandleOrder
      pin={params.pin}
      confirmText="Odblokovať"
      confirmAction={confirmOrder}
      cancelAction={cancleAction}
      orderStatus="unpicked"
    />
  );
}
