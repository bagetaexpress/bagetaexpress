import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { getSchoolByDomain } from "@/db/controllers/schoolController";
import { createCustomer } from "@/db/controllers/userController";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...session,
          user: { ...session.user, isCustomer: true, schoolId: school.id },
        },
      }),
    });
  }

  redirect("/auth/redirect");
}
