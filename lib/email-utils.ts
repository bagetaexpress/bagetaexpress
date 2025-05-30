"use server";

import {
  EmailTemplateResponseNeeded,
  EmailTemplateWelcome,
  EmailTemplateSupportConfirmation,
  EmailTemplateSupportNotification,
} from "@/components/email/contact-template";
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
      from: "bagetaEXPRESS <kontakt@bageta.express>",
      to: [email],
      replyTo: "bagetaEXPRESS <tomas.zifcak197@gmail.com>",
      subject: "Spolupráca s Bageta Express",
      react: EmailTemplateWelcome(),
    });

    if (error) {
      return { error: error.message, data: null };
    }
    const { error: error2 } = await resend.emails.send({
      from: "bagetaEXPRESS <kontakt@bageta.express>",
      to: ["tomas.zifcak197@gmail.com"],
      replyTo: "bagetaEXPRESS <tomas.zifcak197@gmail.com>",
      subject: "Spolupráca s Bageta Express",
      react: EmailTemplateResponseNeeded(email),
    });

    if (error2) {
      return { error: error2.message, data: null };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { error: error?.message ?? "Send email failed", data: null };
  }
}

type RecaptchaRes = {
  success: true | false; // whether this request was a valid reCAPTCHA token for your site
  score: number; // the score for this request (0.0 - 1.0)
  action: string; // the action name for this request (important to verify)
  challenge_ts: Date; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
  "error-codes": string[]; // optional
};

export async function verifyRecaptcha(
  token: string,
): Promise<ErrorRes<RecaptchaRes>> {
  try {
    console.log(token);
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    if (!res.ok) {
      throw new Error("Recaptcha verification failed");
    }

    const success = (await res.json()) as RecaptchaRes;

    if (!success.success) {
      return { data: null, error: "Recaptcha verification failed" };
    }
    if (success.score < 0.5) {
      return { data: null, error: "Recaptcha verification failed" };
    }
    if (success.action !== "submit") {
      return { data: null, error: "Recaptcha verification failed" };
    }

    return { data: success, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: error?.message ?? "Recaptcha verification failed",
    };
  }
}

interface SupportEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function SendSupportEmail(data: SupportEmailData): Promise<ErrorRes<null>> {
  if (z.string().email().safeParse(data.email).success === false) {
    return { data: null, error: "Invalid email" };
  }

  try {
    // Send confirmation email to the user
    const { error } = await resend.emails.send({
      from: "bagetaEXPRESS <kontakt@bageta.express>",
      to: [data.email],
      replyTo: "bagetaEXPRESS <tomas.zifcak197@gmail.com>",
      subject: "Potvrdenie správy - Bageta Express",
      react: EmailTemplateSupportConfirmation(data),
    });

    if (error) {
      return { error: error.message, data: null };
    }

    // Send notification email to admin
    const { error: error2 } = await resend.emails.send({
      from: "bagetaEXPRESS <kontakt@bageta.express>",
      to: ["tomas.zifcak197@gmail.com"],
      replyTo: `bagetaEXPRESS <${data.email}>`,
      subject: `Nová správa od ${data.name}: ${data.subject}`,
      react: EmailTemplateSupportNotification(data),
    });

    if (error2) {
      return { error: error2.message, data: null };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { error: error?.message ?? "Send email failed", data: null };
  }
}
