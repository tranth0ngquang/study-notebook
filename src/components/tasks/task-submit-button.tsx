"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type TaskSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function TaskSubmitButton({
  idleLabel,
  pendingLabel,
}: TaskSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </Button>
  );
}
