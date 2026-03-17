"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteMaterialObject,
  getOwnedMaterialForDelete,
  resolveUniqueMaterialName,
  uploadMaterialObject,
} from "@/lib/materials/storage";
import {
  initialMaterialActionState,
  type MaterialActionState,
} from "@/lib/materials/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { lectureMaterialSchema } from "@/validation/materials";

const MAX_SIZE = 1024 * 1024 * 100;

function revalidateMaterialPaths(courseId: string, lectureId: string) {
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
}

function isAllowedMaterial(file: File) {
  return !file.type.startsWith("video/");
}

export async function uploadLectureMaterialsAction(
  previousState: MaterialActionState = initialMaterialActionState,
  formData: FormData,
): Promise<MaterialActionState> {
  void previousState;

  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);

  if (!files.length) {
    return {
      status: "error",
      message: "Choose at least one file to upload.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please log in again.",
    };
  }

  const renamedFiles: string[] = [];

  for (const file of files) {
    if (!isAllowedMaterial(file)) {
      return {
        status: "error",
        message: `"${file.name}" looks like a video file. Only lecture materials are supported here.`,
      };
    }

    if (file.size > MAX_SIZE) {
      return {
        status: "error",
        message: `"${file.name}" exceeds the 100 MB limit.`,
      };
    }

    const { fileName, storagePath, wasRenamed } = await resolveUniqueMaterialName(
      user.id,
      courseId,
      lectureId,
      file.name,
    );

    const parsed = lectureMaterialSchema.safeParse({
      courseId,
      lectureId,
      fileName,
      mimeType: file.type || null,
      fileSize: file.size,
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: `Invalid file metadata for "${file.name}".`,
      };
    }

    await uploadMaterialObject(storagePath, file);

    const { error } = await supabase.from("lecture_materials").insert({
      user_id: user.id,
      course_id: courseId,
      lecture_id: lectureId,
      file_name: fileName,
      storage_path: storagePath,
      mime_type: file.type || null,
      file_size: file.size,
    });

    if (error) {
      await deleteMaterialObject(storagePath);
      return {
        status: "error",
        message: error.message,
      };
    }

    if (wasRenamed) {
      renamedFiles.push(`${file.name} -> ${fileName}`);
    }
  }

  revalidateMaterialPaths(courseId, lectureId);

  return {
    status: "success",
    message:
      renamedFiles.length > 0
        ? `Upload complete. Duplicate names were renamed: ${renamedFiles.join(", ")}`
        : `${files.length} file${files.length > 1 ? "s" : ""} uploaded.`,
  };
}

export async function deleteLectureMaterialAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const materialId = String(formData.get("materialId") ?? "");
  const redirectTo =
    String(formData.get("redirectTo") ?? "") || `/courses/${courseId}/lectures/${lectureId}`;

  const { supabase, user, material } = await getOwnedMaterialForDelete(materialId);

  if (!user) {
    redirect("/login");
  }

  if (!material) {
    redirect(redirectTo);
  }

  await deleteMaterialObject(material.storage_path);

  await supabase
    .from("lecture_materials")
    .delete()
    .eq("id", materialId)
    .eq("user_id", user.id);

  revalidateMaterialPaths(courseId, lectureId);
  redirect(redirectTo);
}
