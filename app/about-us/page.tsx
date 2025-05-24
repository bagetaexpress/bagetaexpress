import { Instagram, Github } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">O nás</h1>
        <p className="text-lg text-muted-foreground">
          Od školského projektu po reálnu aplikáciu
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Naša misia</h2>
          <p className="text-muted-foreground">
            Chceme zjednodušiť a zrýchliť proces objednávania jedla pre študentov. 
            Naším cieľom je vytvoriť jednoduchý a efektívny systém, ktorý uľahčí 
            život študentom aj predajcom.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">O nás</h2>
          <p className="text-muted-foreground">
            Všetko začalo ako stredoškolský projekt, ktorý sme vytvorili pre našich spolužiakov.
            Keď sme videli, ako projekt pomáha a uľahčuje život študentom, rozhodli sme sa 
            ho premeniť na reálnu webovú aplikáciu. Dnes BagetaExpress pomáha študentom 
            na školách a neustále sa vyvíja na základe spätnej väzby od používateľov.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Technológie</h2>
          <p className="text-muted-foreground mb-4">
            Projekt je postavený na moderných technológiách ako Next.js, React a 
            Tailwind CSS. Tieto technológie nám umožňujú vytvárať rýchlu, 
            spoľahlivú a používateľsky prívetivú aplikáciu.
          </p>
          <p className="text-muted-foreground mb-4">
            BagetaExpress je open source projekt. Celý kód je dostupný na GitHub-e, 
            kde môžete vidieť ako aplikácia funguje a prípadne prispieť k jej vývoju.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link 
              href="https://github.com/bagetaexpress/bagetaexpress" 
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-6 h-6" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Budúcnosť</h2>
          <p className="text-muted-foreground">
            Plánujeme neustále vylepšovať BagetaExpress na základe spätnej väzby 
            od používateľov. Naším cieľom je rozšíriť službu na ďalšie školy a 
            pridať nové funkcie, ktoré uľahčia život študentom aj predajcom.
          </p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Sledujte nás</h2>
          <div className="flex items-center justify-center gap-2">
            <Link 
              href="https://instagram.com/bagetaexpress" 
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span>@bagetaexpress</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
