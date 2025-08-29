"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
	useEffect(() => {
		// Report error to your analytics or logging service here
		// eslint-disable-next-line no-console
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4">
			<div className="mx-auto w-full max-w-md text-center">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="h-8 w-8"
					>
						<path
							fillRule="evenodd"
							d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm10.5-5.25a1.5 1.5 0 10-3 0v6a1.5 1.5 0 003 0v-6Zm-1.5 10.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25Z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<h1 className="text-2xl font-semibold tracking-tight">Niečo sa pokazilo</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Vyskytla sa neočakávaná chyba. Skúste to znova alebo sa vráťte späť.
				</p>
				<div className="mt-6 flex items-center justify-center gap-3">
					<Button variant="secondary" onClick={() => reset()}>Skúsiť znova</Button>
					<Button onClick={() => (window.location.href = "/")}>Domov</Button>
				</div>
				{error?.digest ? (
					<p className="mt-4 text-xs text-muted-foreground">ID chyby: {error.digest}</p>
				) : null}
			</div>
		</div>
	);
}


