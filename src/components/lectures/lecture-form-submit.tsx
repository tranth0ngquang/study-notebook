"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type LectureFormSubmitProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function LectureFormSubmit({
  idleLabel,
  pendingLabel,
}: LectureFormSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        idleLabel
      )}
    </Button>
  );
}
