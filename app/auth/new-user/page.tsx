import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  console.log(session.user);

  return (
    <div>
      <h1>welcome new user</h1>
    </div>
  );
}
