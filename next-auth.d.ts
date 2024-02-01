import NextAuth from "next-auth";

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   image?: string;
//   isAdmin: boolean;
//   isCustomer: boolean;
//   isSeller: boolean;
//   isEmployee: boolean;
//   storeId?: string;
//   schoolId?: string;
// }

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    isAdmin: boolean;
    isCustomer: boolean;
    isSeller: boolean;
    isEmployee: boolean;
    storeId?: number;
    schoolId?: number;
  }
}
