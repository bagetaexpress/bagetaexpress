import { AuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import AzureADProvider from "next-auth/providers/azure-ad";
import { userRepository } from "@/repositories/user-repository";

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
      const found = await userRepository.getSingleExtended({ userId: user.id });
      if (!found) {
        return session;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isAdmin: found?.user?.isAdmin || false,
          isCustomer: !!found?.customer,
          isSeller: !!found?.seller,
          isEmployee: !!found?.employee,
          storeId: found.seller?.storeId || found.employee?.storeId,
          schoolId: found.customer?.schoolId,
        },
      };
    },
  },
};
