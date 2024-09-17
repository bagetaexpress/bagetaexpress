"use server";

import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "./auth-options";
import { cache } from "react";

const getUser = cache(async (): Promise<User | null> => {
  const session = await getServerSession(authOptions);
  if (session === null) {
    return null;
  }

  return session.user;
});

export { getUser };
