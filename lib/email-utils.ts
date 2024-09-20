"use server";

import { EmailTemplate } from "@/components/email/contact-template";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

type ErrorRes<T> = { data: null; error: string } | { data: T; error: null };

export async function SendContactEmail(email: string): Promise<ErrorRes<null>> {
  if (z.string().email().safeParse(email).success === false) {
    return { data: null, error: "Invalid email" };
  }
  try {
    const { error } = await resend.emails.send({
      from: "Acme <noreply@bageta.express>",
      to: ["tomas.zifcak197@gmail.com"],
      replyTo: "Acme <tomas.zifcak197@gmail.com>",
      subject: "Hello world",
      react: EmailTemplate({ firstName: "John" }),
    });

    if (error) {
      return { error: error.message, data: null };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { error: error?.message ?? "Send email failed", data: null };
  }
}
