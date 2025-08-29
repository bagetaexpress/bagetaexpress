import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4">
			<div className="mx-auto w-full max-w-md text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-bold">
					404
				</div>
				<h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Hľadaná stránka neexistuje alebo bola presunutá.
				</p>
				<div className="mt-6 flex items-center justify-center gap-3">
					<Button variant="secondary" asChild>
						<Link href="/support">Kontaktovať podporu</Link>
					</Button>
					<Button asChild>
						<Link href="/">Domov</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}


