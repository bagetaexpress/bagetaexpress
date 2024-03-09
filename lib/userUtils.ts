"use server";

import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "./authOptions";

async function getUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (session === null) {
    return null;
  }

  return session.user;
}

export { getUser };
