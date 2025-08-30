import LogomarkJS from "@/components/nav/logomark-js";

export default function LoadingFullPage() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <LogomarkJS width={180} height={65} />
        <div className="flex items-center gap-2 text-muted-foreground" aria-live="polite" aria-busy>
          <span className="sr-only">Načítavam…</span>
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-foreground animate-spin" />
          <span>Načítavam…</span>
        </div>
      </div>
    </div>
  );
}

export function LoadingFill() {
  return (
    <div className="flex flex-1 p-5 items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <LogomarkJS width={180} height={65} />
      </div>
    </div>
  );
}
