"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full justify-start rounded-2xl"
      disabled={pending}
      type="submit"
      variant="outline"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="size-4" />
          Log out
        </>
      )}
    </Button>
  );
}
