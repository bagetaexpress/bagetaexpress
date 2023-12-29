"use server"

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

type User = {
  id: number;
  name: string;
  email: string;
  schoolId?: number;
  customerId?: number;
};

async function getUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (session === null) {
    return null;
  }
  const foundUser = session.user;
  foundUser.id = parseInt(foundUser.id);

  return foundUser;
}

export { getUser };