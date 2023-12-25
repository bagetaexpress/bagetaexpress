"use client";

import LoginForm from "@/components/loginCard";
import RegisterForm from "@/components/registerCard";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="login">
            Login
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="register">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
