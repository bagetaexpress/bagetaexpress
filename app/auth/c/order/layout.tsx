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

  const [foundOrder, foundUnpicked] = await Promise.all([
    getOrdersByUserId(user.id, "ordered"),
    getOrdersByUserId(user.id, "unpicked"),
  ]);
  if (foundOrder.length === 0 && foundUnpicked.length === 0) {
    redirect("/auth/c/store");
  }

  return <>{children}</>;
}
