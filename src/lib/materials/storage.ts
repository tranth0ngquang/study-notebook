import path from "node:path";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LectureMaterial } from "@/types/domain";

const BUCKET = "lecture-materials";

function sanitizeFileName(fileName: string) {
  return fileName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function splitFileName(fileName: string) {
  const extension = path.extname(fileName);
  const baseName = fileName.slice(0, Math.max(1, fileName.length - extension.length));
  return { baseName, extension };
}

async function getOwnedLectureMaterial(materialId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, material: null };
  }

  const { data, error } = await supabase
    .from("lecture_materials")
    .select("*")
    .eq("id", materialId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return { supabase, user, material: data as LectureMaterial | null };
}

export async function resolveUniqueMaterialName(
  userId: string,
  courseId: string,
  lectureId: string,
  originalName: string,
) {
  const supabase = await createServerSupabaseClient();
  const cleanName = sanitizeFileName(originalName) || "file";
  const { baseName, extension } = splitFileName(cleanName);

  let candidate = cleanName;
  let counter = 2;

  while (true) {
    const storagePath = `${userId}/${courseId}/${lectureId}/${candidate}`;
    const { data, error } = await supabase
      .from("lecture_materials")
      .select("id")
      .eq("storage_path", storagePath)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return {
        fileName: candidate,
        storagePath,
        wasRenamed: candidate !== cleanName,
      };
    }

    candidate = `${baseName} (${counter})${extension}`;
    counter += 1;
  }
}

export async function uploadMaterialObject(storagePath: string, file: File) {
  const admin = createAdminSupabaseClient();
  const { error } = await admin.storage.from(BUCKET).upload(storagePath, file, {
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteMaterialObject(storagePath: string) {
  const admin = createAdminSupabaseClient();
  const { error } = await admin.storage.from(BUCKET).remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createMaterialSignedUrl(materialId: string) {
  const { material } = await getOwnedLectureMaterial(materialId);

  if (!material) {
    return null;
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(material.storage_path, 60 * 15);

  if (error) {
    throw new Error(error.message);
  }

  return { material, signedUrl: data.signedUrl };
}

export async function downloadMaterialFile(materialId: string) {
  const { material } = await getOwnedLectureMaterial(materialId);

  if (!material) {
    return null;
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.storage
    .from(BUCKET)
    .download(material.storage_path);

  if (error) {
    throw new Error(error.message);
  }

  return { material, blob: data };
}

export async function getOwnedMaterialForDelete(materialId: string) {
  return getOwnedLectureMaterial(materialId);
}
