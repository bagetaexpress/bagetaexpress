import {
  getOrderByPin,
  updateOrderStatus,
} from "@/db/controllers/order-controller";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import HandleOrder from "../../_components/handle-order";
import { Suspense } from "react";
import { Loader } from "lucide-react";

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
        "ordered",
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
    <Suspense
      fallback={
        <div className="flex min-h-full justify-center items-center">
          <Loader className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <HandleOrder
        pin={params.pin}
        confirmText="Potvrdiť"
        confirmAction={confirmOrder}
        cancelAction={cancleAction}
      />
    </Suspense>
  );
}
