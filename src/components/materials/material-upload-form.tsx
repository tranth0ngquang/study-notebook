"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createLectureMaterialMetadataAction } from "@/lib/materials/actions";
import {
  MATERIAL_BUCKET,
  resolveUniqueMaterialNameWithClient,
  validateMaterialFile,
} from "@/lib/materials/shared";
import { createClient } from "@/lib/supabase/client";
import {
  initialMaterialActionState,
  type MaterialActionState,
} from "@/lib/materials/types";

import { Button } from "@/components/ui/button";

type MaterialUploadFormProps = {
  courseId: string;
  lectureId: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MaterialUploadForm({
  courseId,
  lectureId,
}: MaterialUploadFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<MaterialActionState>(initialMaterialActionState);
  const [files, setFiles] = useState<File[]>([]);
  const supabase = createClient();

  const summary = useMemo(() => {
    if (!files.length) return null;
    const total = files.reduce((sum, file) => sum + file.size, 0);
    return `${files.length} file${files.length > 1 ? "s" : ""} selected - ${formatBytes(total)}`;
  }, [files]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!files.length) {
      setState({
        status: "error",
        message: "Choose at least one file to upload.",
      });
      return;
    }

    startTransition(async () => {
      setState(initialMaterialActionState);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({
          status: "error",
          message: "Your session expired. Please log in again.",
        });
        return;
      }

      const renamedFiles: string[] = [];

      for (const file of files) {
        const validationMessage = validateMaterialFile(file);

        if (validationMessage) {
          setState({
            status: "error",
            message: validationMessage,
          });
          return;
        }

        try {
          const { fileName, storagePath, wasRenamed } =
            await resolveUniqueMaterialNameWithClient({
              findExistingStoragePath: async (existingStoragePath) => {
                const { data, error } = await supabase
                  .from("lecture_materials")
                  .select("id")
                  .eq("storage_path", existingStoragePath)
                  .maybeSingle();

                if (error) {
                  throw new Error(error.message);
                }

                return Boolean(data);
              },
              userId: user.id,
              courseId,
              lectureId,
              originalName: file.name,
            });

          const uploadResult = await supabase.storage
            .from(MATERIAL_BUCKET)
            .upload(storagePath, file, {
              upsert: false,
              contentType: file.type || "application/octet-stream",
            });

          if (uploadResult.error) {
            setState({
              status: "error",
              message: uploadResult.error.message,
            });
            return;
          }

          const formData = new FormData();
          formData.set("courseId", courseId);
          formData.set("lectureId", lectureId);
          formData.set("fileName", fileName);
          formData.set("storagePath", storagePath);
          formData.set("mimeType", file.type || "");
          formData.set("fileSize", String(file.size));

          const result = await createLectureMaterialMetadataAction(
            initialMaterialActionState,
            formData,
          );

          if (result.status === "error") {
            await supabase.storage.from(MATERIAL_BUCKET).remove([storagePath]);
            setState(result);
            return;
          }

          if (wasRenamed) {
            renamedFiles.push(`${file.name} -> ${fileName}`);
          }
        } catch (error) {
          setState({
            status: "error",
            message:
              error instanceof Error ? error.message : "Upload failed unexpectedly.",
          });
          return;
        }
      }

      setFiles([]);
      setState({
        status: "success",
        message:
          renamedFiles.length > 0
            ? `Upload complete. Duplicate names were renamed: ${renamedFiles.join(", ")}`
            : `${files.length} file${files.length > 1 ? "s" : ""} uploaded.`,
      });
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
