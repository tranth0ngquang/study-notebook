"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">
          Workspace section failed to load
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          This part of the authenticated workspace hit an unexpected error. Try
          the request again. If it keeps failing, check the related Supabase
          query, storage configuration, or most recent mutation.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
