"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Loader } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { verifyRecaptcha, SendSupportEmail } from "@/lib/email-utils";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const formSchema = z.object({
    name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
    email: z.string().email("Neplatný email"),
    subject: z.string().min(3, "Predmet musí mať aspoň 3 znaky"),
    message: z.string().min(10, "Správa musí mať aspoň 10 znakov"),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setIsSent(false);
    setIsError(false);
    setErrorMessage("");
    setIsSuccess(false);

    try {
      const validation = formSchema.safeParse(formData);
      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      // @ts-ignore
      window.grecaptcha.ready(function () {
        // @ts-ignore
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
            action: "submit",
          })
          .then(async function (token: string) {
            const { data, error } = await verifyRecaptcha(token);
            if (error || !data?.success) {
              throw new Error("Recaptcha verifikácia zlyhala");
            }
            
            const { error: emailError } = await SendSupportEmail(formData);
            if (emailError) {
              throw new Error(emailError);
            }
            
            setIsSuccess(true);
          });
      });
    } catch (e) {
      console.error(e);
      setIsError(true);
      setErrorMessage(e instanceof Error ? e.message : "Nepodarilo sa odoslať správu");
    } finally {
      setIsSent(true);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="g-recaptcha"
        data-sitekey={process.env.RECAPTCHA_SITE_KEY}
        data-size="invisible"
      ></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Meno
          </label>
          <Input
            id="name"
            placeholder="Vaše meno"
            disabled={isLoading}
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setIsSent(false);
            }}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="vas.email@priklad.sk"
            disabled={isLoading}
            required
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setIsSent(false);
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Predmet
        </label>
        <Input
          id="subject"
          placeholder="O čo ide?"
          disabled={isLoading}
          required
          value={formData.subject}
          onChange={(e) => {
            setFormData({ ...formData, subject: e.target.value });
            setIsSent(false);
          }}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Správa
        </label>
        <Textarea
          id="message"
          placeholder="Popíšte váš problém alebo otázku..."
          className="min-h-[150px]"
          disabled={isLoading}
          required
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            setIsSent(false);
          }}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            Odosielam <Loader className="h-5 w-5 ml-2 animate-spin" />
          </>
        ) : (
          "Odoslať správu"
        )}
      </Button>
      <p className="text-xs text-muted-foreground font-extralight opacity-60">
        This site is protected by reCAPTCHA and the Google{" "}
        <Link
          prefetch={false}
          href="https://policies.google.com/privacy"
          className="text-blue-400 hover:text-blue-700"
        >
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link
          prefetch={false}
          href="https://policies.google.com/terms"
          className="text-blue-400 hover:text-blue-700"
        >
          Terms of Service
        </Link>{" "}
        apply.
      </p>
      {isSent && isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nepodarilo sa odoslať správu!</AlertTitle>
          {errorMessage?.trim() != "" && (
            <AlertDescription>{errorMessage}</AlertDescription>
          )}
        </Alert>
      )}
      {isSent && isSuccess && (
        <Alert className="bg-green-300 border-green-500 bg-opacity-50">
          <Check className="w-4 h-4" />
          <AlertTitle>Správa bola odoslaná!</AlertTitle>
        </Alert>
      )}
    </form>
  );
} 