import { acceptCookies } from "@/lib/utils/cookiesUtils";
import NextAuth from "next-auth";

interface User {
  id: string;
  isAdmin?: boolean;
}

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin?: boolean;
    user?: User;
    accessToken?: string;
    [key: string]: string;
  }
}
