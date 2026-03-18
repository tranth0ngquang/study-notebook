"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function getRequiredEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
) {
  const value =
    name === "NEXT_PUBLIC_SUPABASE_URL"
      ? supabaseUrl
      : supabasePublishableKey;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createClient() {
  return createBrowserClient<Database>(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  );
}
