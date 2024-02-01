"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

async function getUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (session === null) {
    return null;
  }

  return session.user;
}

export { getUser };
