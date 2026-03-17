"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthFormState } from "@/lib/auth/types";
import { env } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { signInSchema, signUpSchema } from "@/validation/auth";

function getBaseUrl(headerStore: Awaited<ReturnType<typeof headers>>) {
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL;
  }

  const origin = headerStore.get("origin");
  if (origin) {
    return origin;
  }

  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      status: "error",
      message:
        error.message === "Email not confirmed"
          ? "Confirm your email before logging in."
          : error.message,
    };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const headerStore = await headers();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.displayName,
      },
      emailRedirectTo: `${getBaseUrl(headerStore)}/auth/callback`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    status: "success",
    message:
      "Account created. Check your email to confirm your account, then return to log in.",
  };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  redirect("/login");
}
