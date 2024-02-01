import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  if (session.user.isAdmin || session.user.isEmployee) {
    redirect("/auth/e/dashboard");
  }
  if (session.user.isSeller) {
    redirect("/auth/s/summary");
  }
  if (session.user.isCustomer) {
    redirect("/auth/c/shop");
  }

  // redirect("/");

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}
