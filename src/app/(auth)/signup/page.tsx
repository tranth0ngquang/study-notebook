import { redirect } from "next/navigation";

import { SignUpForm } from "@/components/auth/signup-form";
import { getCurrentUser } from "@/lib/supabase/server";

export default async function SignUpPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}
