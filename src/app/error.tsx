"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="max-w-lg space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">
            Unexpected application error
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Something failed while loading the workspace. Try the request again,
            and if the issue persists, inspect the Supabase configuration or
            the most recent mutation that ran.
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
