"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/lib/auth/actions";
import { initialAuthFormState } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

import { AuthSubmitButton } from "./auth-submit-button";
import { AuthFormShell } from "./auth-form-shell";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialAuthFormState);

  return (
    <AuthFormShell
      alternateHref="/signup"
      alternateLabel="Create account"
      description="Use your Supabase account to access the protected study workspace."
      footerNote={
        <>
          New here?{" "}
          <Link className="font-medium text-teal-700 hover:text-teal-800" href="/signup">
            Create an account
          </Link>
          .
        </>
      }
      title="Log in"
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            className={cn(state.fieldErrors?.email ? "border-destructive ring-3 ring-destructive/10" : "")}
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
          {state.fieldErrors?.email ? (
            <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete="current-password"
            aria-invalid={Boolean(state.fieldErrors?.password)}
            className={cn(state.fieldErrors?.password ? "border-destructive ring-3 ring-destructive/10" : "")}
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
          {state.fieldErrors?.password ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.password[0]}
            </p>
          ) : null}
        </div>

        {state.message ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              state.status === "error"
                ? "border-destructive/25 bg-destructive/5 text-destructive"
                : "border-teal-200 bg-teal-50 text-teal-800",
            )}
          >
            {state.message}
          </div>
        ) : null}

        <AuthSubmitButton idleLabel="Log in" pendingLabel="Logging in..." />
      </form>
    </AuthFormShell>
  );
}
