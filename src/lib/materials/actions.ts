"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteMaterialObject,
  getOwnedMaterialForDelete,
} from "@/lib/materials/storage";
import {
  initialMaterialActionState,
  type MaterialActionState,
} from "@/lib/materials/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createLectureMaterialMetadataSchema } from "@/validation/materials";

function revalidateMaterialPaths(courseId: string, lectureId: string) {
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
}

export async function createLectureMaterialMetadataAction(
  previousState: MaterialActionState = initialMaterialActionState,
  formData: FormData,
): Promise<MaterialActionState> {
  void previousState;

  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const fileName = String(formData.get("fileName") ?? "");
  const storagePath = String(formData.get("storagePath") ?? "");
  const mimeType = String(formData.get("mimeType") ?? "");
  const fileSize = Number(formData.get("fileSize") ?? 0);

  const parsed = createLectureMaterialMetadataSchema.safeParse({
    courseId,
    lectureId,
    fileName,
    storagePath,
    mimeType: mimeType || null,
    fileSize,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Invalid file metadata.",
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

  const { error } = await supabase.from("lecture_materials").insert({
    user_id: user.id,
    course_id: parsed.data.courseId,
    lecture_id: parsed.data.lectureId,
    file_name: parsed.data.fileName,
    storage_path: parsed.data.storagePath,
    mime_type: parsed.data.mimeType,
    file_size: parsed.data.fileSize,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateMaterialPaths(courseId, lectureId);

  return {
    status: "success",
    message: "Material metadata saved.",
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
