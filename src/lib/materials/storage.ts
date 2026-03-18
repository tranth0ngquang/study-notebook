import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LectureMaterial } from "@/types/domain";
import {
  MATERIAL_BUCKET as BUCKET,
  resolveUniqueMaterialNameWithClient,
} from "@/lib/materials/shared";

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
  return resolveUniqueMaterialNameWithClient({
    findExistingStoragePath: async (storagePath) => {
      const { data, error } = await supabase
        .from("lecture_materials")
        .select("id")
        .eq("storage_path", storagePath)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return Boolean(data);
    },
    userId,
    courseId,
    lectureId,
    originalName,
  });
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
