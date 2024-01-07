"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "./ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/userUtils";
import { Loader } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be valid.",
  }),
  password: z.string().min(1, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginForm({ error }: { error?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      ...values,
      callbackUrl: "/",
      redirect: false,
    });
    if (res?.error) {
      router.push("?error=" + res.error);
      router.forward();
    } else {
      const user = await getUser();
      if (!user) {
        return;
      }
      switch (true) {
        case user.isCustomer:
          router.push("/auth/c/store");
          break;
        case user.isEmployee:
          router.push("/auth/e/dashboard");
          break;
        case user.isSeller:
          router.push("/auth/s/summary");
          break;
        default:
          router.push("/");
          break;
      }
    }
    setIsSubmitting(false);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-5 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heslo</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            {isSubmitting ? (
              <Button disabled={isSubmitting} type="submit">
                <Loader className="animate-spin w-5 h-5 mr-2" /> Loading...
              </Button>
            ) : (
              <Button disabled={isSubmitting} type="submit">
                Submit
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
