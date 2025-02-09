"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Loader } from "lucide-react";
import { SendContactEmail, verifyRecaptcha } from "@/lib/email-utils";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function handleSendEmail() {
    try {
      const { error } = await SendContactEmail(email);
      if (error) {
        throw new Error(error);
      }
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsSent(true);
      setIsLoading(false);
    }
  }

  function onSubmit(_: FormData) {
    setIsLoading(true);
    setIsSent(false);
    setIsError(false);
    setErrorMessage("");
    setIsSuccess(false);

    const res = z.string().email().safeParse(email);
    if (!res.success) {
      setIsSent(true);
      setIsError(true);
      setErrorMessage("Neplatný email");
      return;
    }

    // NOTE: https://developers.google.com/recaptcha/docs/v3

    // @ts-ignore
    window.grecaptcha.ready(function () {
      // @ts-ignore
      window.grecaptcha
        .execute(process.env.RECAPTCHA_SITE_KEY, { action: "submit" })
        .then(async function (token: string) {
          const { data, error } = await verifyRecaptcha(token);
          if (error) {
            setIsSent(true);
            setIsError(true);
            setErrorMessage("Recaptcha verifikácia zlyhala");
            setIsLoading(false);
            return;
          }
          if (!data?.success) {
            setIsSent(true);
            setIsError(true);
            setErrorMessage("Recaptcha verifikácia zlyhala");
            setIsLoading(false);
            return;
          }
          void handleSendEmail();
        });
    });
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);
  }, []);

  return (
    <form action={onSubmit} className="grid w-full gap-4 sm:p-16">
      <div
        className="g-recaptcha"
        data-sitekey={process.env.RECAPTCHA_SITE_KEY}
        data-size="invisible"
      ></div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Zadajte email"
          disabled={isLoading}
          required
          value={email}
          onChange={(v) => {
            setIsSent(false);
            setEmail(v.target.value);
          }}
        />
      </div>
      <div className="grid">
        <Button size="lg" disabled={isLoading}>
          Odoslať{" "}
          {isLoading && <Loader className="h-5 w-5 ml-2 animate-spin" />}
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
      </div>
      {isSent && isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nepodarilo sa poslať email!</AlertTitle>
          {errorMessage?.trim() != "" && (
            <AlertDescription>{errorMessage}</AlertDescription>
          )}
        </Alert>
      )}
      {isSent && isSuccess && (
        <Alert className="bg-green-300 border-green-500 bg-opacity-50">
          <Check className="w-4 h-4" />
          <AlertTitle>Email bol odoslaný!</AlertTitle>
        </Alert>
      )}
    </form>
  );
}
