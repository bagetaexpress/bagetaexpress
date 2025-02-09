import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import HandleOrder from "../../_components/handle-order";
import orderRepository from "@/repositories/order-repository";

export default async function UnlockPinPage(
  props: {
    params: Promise<{ pin: string }>;
  }
) {
  const params = await props.params;
  async function confirmOrder() {
    "use server";
    let success = true;
    try {
      const currUser = await getUser();
      if (!currUser) throw new Error("User not found");

      const order = await orderRepository.getSingle({
        pin: params.pin,
        schoolId: currUser.schoolId,
        status: ["unpicked"],
      });
      if (!order) throw new Error("Order not found");

      await orderRepository.updateSingle({
        id: order.id,
        status: "cancelled",
      });
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
