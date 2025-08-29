import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import Link from "next/link";
import ContactForm from "@/app/_components/contact-form";
import { Suspense } from "react";
import Loading from "../loading";

export default function SupportPage() {
  return (
    <div className="container mx-auto py-10 px-1 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8">Podpora & Kontakt</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktujte nás</CardTitle>
              <CardDescription>Sledujte nás na Instagrame pre najrýchlejšiu odpoveď</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link 
                href="https://instagram.com/bagetaexpress" 
                target="_blank"
                className="flex items-center gap-3 hover:underline"
              >
                <Instagram className="h-5 w-5" />
                <span>@bagetaexpress</span>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rýchle odkazy</CardTitle>
              <CardDescription>Dozviete sa viac o nás</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/about-us" className="block hover:underline">
                O nás
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kontaktný formulár <span className="text-sm">(preferujeme instagram)</span></CardTitle>
            <CardDescription>Pošlite nám správu a my vám odpovieme čo najskôr</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Loading />}>
              <ContactForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 