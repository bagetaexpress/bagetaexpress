import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSchoolByDomain } from "@/db/controllers/schoolController";
import { createCustomer } from "@/db/controllers/userController";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginBtn from "./_components/loginBtn";

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
    return (
      <div
        style={{ minHeight: "100dvh" }}
        className="flex flex-col justify-center items-center"
      >
        <div className="flex flex-col">
          <h1 className=" font-semibold text-xl">Váš účet bol vytvorený</h1>
          <h2 className=" text-lg mb-4">Môžete sa prihlásiť</h2>
          <LoginBtn />
        </div>
      </div>
    );
  }

  redirect("/auth/redirect");
}
