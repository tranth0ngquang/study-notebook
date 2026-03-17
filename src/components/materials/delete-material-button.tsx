"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type DeleteMaterialButtonProps = {
  confirmMessage: string;
};

export function DeleteMaterialButton({
  confirmMessage,
}: DeleteMaterialButtonProps) {
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
      variant="outline"
    >
      {pending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="size-4" />
          Delete
        </>
      )}
    </Button>
  );
}
