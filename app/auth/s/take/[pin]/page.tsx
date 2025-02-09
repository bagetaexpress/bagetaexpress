import { getUser } from "@/lib/user-utils";
import { redirect, RedirectType } from "next/navigation";
import HandleOrder from "../../_components/handle-order";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import orderRepository from "@/repositories/order-repository";

export default async function TakePinPage(
  props: {
    params: Promise<{ pin: string }>;
  }
) {
  const params = await props.params;
  async function confirmOrder() {
    "use server";
    let success = true;
    try {
      console.info(`Confirming order with pin: ${params.pin}`);
      const currUser = await getUser();
      if (!currUser) throw new Error("User not found");

      const order = await orderRepository.getSingle({
        pin: params.pin,
        schoolId: currUser.schoolId,
        status: ["ordered"],
      });
      if (!order) throw new Error("Order not found");

      console.info(`Updating order status to pickedup`);
      await orderRepository.updateSingle({
        id: order.id,
        status: "pickedup",
      });
    } catch (error) {
      console.error(error);
      success = false;
    }
    redirect("/auth/s/take?success=" + success, RedirectType.replace);
  }

  async function cancleAction() {
    "use server";
    console.info(`Cancelling order with pin: ${params.pin}`);
    redirect("/auth/s/take", RedirectType.replace);
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
