import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/db/controllers/userController";

export type BeUser = {
  id: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  isEmployee: boolean;
  isCustomer: boolean;
  schoolId?: number;
  storeId?: number;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const found = await getUserByEmail(credentials.email);
        if (!found) {
          return null;
        }

        if (!found.user.password) {
          return null;
        }

        if (
          !(await bcrypt.compare(credentials.password, found.user.password))
        ) {
          return null;
        }

        const user: BeUser = {
          id: found.user.id.toString(),
          email: found.user.email,
          isAdmin: found.user.isAdmin,
          isSeller: found.seller != null,
          isCustomer: found.customer != null,
          isEmployee: found.employee != null,
          schoolId: found.customer?.schoolId ?? found.seller?.schoolId,
          storeId: found.employee?.storeId ?? found.seller?.storeId,
        };
        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      if (user) {
        token.user = { ...user };
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.isAdmin = token.user.isAdmin;
      session.user.isSeller = token.user.isSeller;
      session.user.isCustomer = token.user.isCustomer;
      session.user.isEmployee = token.user.isEmployee;
      session.user.schoolId = token.user.schoolId;
      session.user.storeId = token.user.storeId;
      session.user.email = token.user.email;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
