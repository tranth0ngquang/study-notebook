"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { toggleLectureCompletionAction } from "@/lib/lectures/actions";
import { getLectureCompletionToggleStyle } from "@/lib/lectures/completion-style";
import { cn } from "@/lib/utils";

type LectureCompletionToggleProps = {
  checked: boolean;
  courseId: string;
  lectureId: string;
  courseColor?: string | null;
  variant?: "card" | "header";
};

export function LectureCompletionToggle({
  checked,
  courseId,
  courseColor,
  lectureId,
  variant = "card",
}: LectureCompletionToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const resolvedChecked = Boolean(checked);
  const [optimisticChecked, setOptimisticChecked] = useState(resolvedChecked);

  useEffect(() => {
    setOptimisticChecked(Boolean(checked));
  }, [checked]);

  const compact = variant === "card";
  const { checkedBoxStyle, shellStyle } = getLectureCompletionToggleStyle(courseColor);

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 rounded-full border transition-colors",
        compact
          ? "border-slate-200 bg-white/90 px-3 py-2 text-sm"
          : "border-emerald-200 bg-emerald-50 px-4 py-2 text-base",
        pending && "pointer-events-none opacity-70",
      )}
      style={optimisticChecked ? shellStyle : undefined}
    >
      <input
        checked={optimisticChecked}
        className="sr-only"
        disabled={pending}
        onChange={(event) => {
          const nextChecked = event.currentTarget.checked;
          setOptimisticChecked(nextChecked);

          startTransition(async () => {
            const formData = new FormData();
            formData.set("courseId", courseId);
            formData.set("lectureId", lectureId);
            formData.set("completed", String(nextChecked));
            const result = await toggleLectureCompletionAction(formData);

            if (result?.status === "error") {
              setOptimisticChecked(!nextChecked);
              window.alert(result.message ?? "Could not update lecture completion.");
              return;
            }

            router.refresh();
          });
        }}
        type="checkbox"
      />
      <span
        className={cn(
          "flex items-center justify-center rounded-md border transition-colors",
          compact ? "size-5" : "size-6",
          optimisticChecked
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-slate-300 bg-white text-transparent",
        )}
        style={optimisticChecked ? checkedBoxStyle : undefined}
      >
        <Check className={compact ? "size-3.5" : "size-4"} />
      </span>
      <span className="font-medium text-slate-700">
        {optimisticChecked ? "Done lecture" : "Mark as done"}
      </span>
    </label>
  );
}
