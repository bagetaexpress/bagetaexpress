import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/db"
import { customer, employee, user } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import bcrypt from "bcrypt";

export interface BeUser {
  id: string
  name: string
  surname: string
  email: string
  isAdmin: boolean
  schoolId?: number
  storeId?: number
}

const handler = NextAuth({
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

        const findUser = await db
          .select()
          .from(user)
          .where(
            and(
              eq(user.email, credentials.email),
              // eq(user.verified, true)
            )
          )
          .leftJoin(employee, eq(employee.userId, user.id))
          .leftJoin(customer, eq(customer.userId, user.id))
          .limit(1);

        if (!findUser || findUser.length === 0) {
          return null;
        }
        const found = findUser[0];

        if (!found.user.password) {
          return null;
        }

        if (
          !(await bcrypt.compare(credentials.password, found.user.password))
        ) {
          return null;
        }

        const newUser: BeUser = {
          id: found.user.id.toString(),
          name: found.user.name,
          surname: found.user.surname,
          email: found.user.email,
          isAdmin: found.user.isAdmin,
          schoolId: found.customer?.schoolId,
          storeId: found.employee?.storeId,
        };
        return newUser;
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
      session.user.schoolId = token.user.schoolId;
      session.user.storeId = token.user.storeId;
      session.user.name = token.user.name;
      session.user.surname = token.user.surname;
      session.user.email = token.user.email;

      return session;
    },
  },
})

export { handler as GET, handler as POST }