"use client";

import LoginForm from "@/components/loginCard";
import RegisterForm from "@/components/registerCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/components/ui/tabs";
import { Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-4 items-center justify-center">
      <Alert className=" max-w-screen-sm">
        <Terminal className="h-4 w-4" />
        <AlertTitle>This is a test version!</AlertTitle>
        <AlertDescription>
          Registration is disabled, avalible accounts:
          <br />
          <ul>
            <li>
              <span className=" font-semibold">customer@bageta.express</span> -
              password: <b>x</b>
            </li>
            <li>
              <span className=" font-semibold">seller@bageta.express</span> -
              password: <b>x</b>
            </li>
            <li>
              <span className=" font-semibold">employee@bageta.express</span> -
              password: <b>x</b>
            </li>
          </ul>
          <br />
          If you find any bugs, please contact me on discord: <b>tomas197</b>
        </AlertDescription>
      </Alert>
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
