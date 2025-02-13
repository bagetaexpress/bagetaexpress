import { getUser } from "@/lib/user-utils";
import orderRepository from "@/repositories/order-repository";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bageta.express | Objednávka",
};

export default async function CartLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const hasActive = await orderRepository.getSingle({
    userId: user.id,
    status: ["ordered", "unpicked"],
  });
  if (!hasActive) {
    redirect("/auth/c/store");
  }

  return (
    <>
      {children}
    </>
  );
}
