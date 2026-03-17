"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type DeleteTaskButtonProps = {
  confirmMessage: string;
};

export function DeleteTaskButton({ confirmMessage }: DeleteTaskButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      type="submit"
      variant="destructive"
    >
      <Trash2 className="size-4" />
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
