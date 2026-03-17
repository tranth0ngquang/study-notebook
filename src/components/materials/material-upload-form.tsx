"use client";

import { useActionState, useMemo, useState } from "react";

import {
  initialMaterialActionState,
  type MaterialActionState,
} from "@/lib/materials/types";

import { Button } from "@/components/ui/button";

type MaterialUploadFormProps = {
  action: (
    state: MaterialActionState,
    formData: FormData,
  ) => Promise<MaterialActionState>;
  courseId: string;
  lectureId: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MaterialUploadForm({
  action,
  courseId,
  lectureId,
}: MaterialUploadFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialMaterialActionState,
  );
  const [files, setFiles] = useState<File[]>([]);

  const summary = useMemo(() => {
    if (!files.length) return null;
    const total = files.reduce((sum, file) => sum + file.size, 0);
    return `${files.length} file${files.length > 1 ? "s" : ""} selected - ${formatBytes(total)}`;
  }, [files]);

  return (
    <form action={formAction} className="space-y-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lectureId" type="hidden" value={lectureId} />

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-slate-400 hover:bg-slate-100">
        <span className="text-base font-medium text-slate-950">
          Select lecture materials
        </span>
        <span className="mt-2 text-sm leading-6 text-slate-600">
          Upload PDFs, slide decks, notes, worksheets, or other supporting
          documents. Video files are not supported.
        </span>
        <input
          className="sr-only"
          multiple
          name="files"
          onChange={(event) =>
            setFiles(Array.from(event.currentTarget.files ?? []))
          }
          type="file"
        />
      </label>

      {summary ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          {summary}
        </div>
      ) : null}

      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.status === "error"
              ? "border-destructive/25 bg-destructive/5 text-destructive"
              : "border-teal-200 bg-teal-50 text-teal-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button disabled={pending} type="submit">
          {pending ? "Uploading..." : "Upload materials"}
        </Button>
      </div>
    </form>
  );
}
