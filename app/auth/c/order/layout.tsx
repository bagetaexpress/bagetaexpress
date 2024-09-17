import { getActiveOrder } from "@/db/controllers/order-controller";
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

  const hasActive = await getActiveOrder(user.id);
  if (!hasActive) {
    redirect("/auth/c/store");
  }

  return <>{children}</>;
}
