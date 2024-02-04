import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSchoolByDomain } from "@/db/controllers/schoolController";
import { createCustomer } from "@/db/controllers/userController";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginBtn from "./_components/loginBtn";
import { revalidatePath } from "next/cache";

export default async function NewUserPage() {
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
    redirect("/auth/c/store");
  }

  const mailDomain = session.user.email.split("@").at(-1);
  if (!mailDomain) {
    redirect("/");
  }
  const school = await getSchoolByDomain(mailDomain);
  if (school) {
    await createCustomer({
      userId: session.user.id,
      schoolId: school.id,
    });
  }

  redirect("/auth/redirect");
}
