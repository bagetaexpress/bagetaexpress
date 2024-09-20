"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Loader } from "lucide-react";
import { SendContactEmail } from "@/lib/email-utils";

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
    if (res.success) {
      void handleSendEmail();
    } else {
      setIsSent(true);
      setIsError(true);
      setErrorMessage("Neplatný email");
    }
  }

  return (
    <form action={onSubmit} className="grid w-full gap-4 sm:p-16">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Zadajte email"
          required
          value={email}
          onChange={(v) => {
            setIsSent(false);
            setEmail(v.target.value);
          }}
        />
      </div>
      <Button size="lg" disabled={isLoading}>
        Odoslať {isLoading && <Loader className="h-5 w-5 ml-2 animate-spin" />}
      </Button>
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
