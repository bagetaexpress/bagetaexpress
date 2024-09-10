import { getOrdersByUserId } from "@/db/controllers/order-controller";
import { getUser } from "@/lib/user-utils";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }
  const foundOrder = await getOrdersByUserId(user.id, "ordered");
  if (foundOrder.length > 0) {
    redirect("/auth/c/order");
  }

  return <>{children}</>;
}
