import NextAuth, { AuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import AzureADProvider from "next-auth/providers/azure-ad";
import {
  getEmployeeById,
  getSellerById,
  getUserById,
} from "@/db/controllers/userController";
import { getCustomer } from "@/db/controllers/customerController";
import { getUser } from "@/lib/userUtils";

export const authOptions: AuthOptions = {
  // ! wierd type error, don't have time to fix, but it works
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],
  pages: {
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.userId = account.userId;
      }

      return token;
    },
    async session({ session, user }) {
      const foundUser = await getUserById(user.id);
      const customer = await getCustomer(user.id);
      const seller = await getSellerById(user.id);
      const employee = await getEmployeeById(user.id);

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isAdmin: foundUser?.isAdmin || false,
          isCustomer: !!customer,
          isSeller: !!seller,
          isEmployee: !!employee,
          storeId: seller?.storeId || employee?.storeId,
          schoolId: seller?.schoolId,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
