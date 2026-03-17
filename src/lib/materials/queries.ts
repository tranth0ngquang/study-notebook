import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture, LectureMaterial } from "@/types/domain";

export async function getLectureMaterials(lectureId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("lecture_materials")
    .select("*")
    .eq("lecture_id", lectureId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as LectureMaterial[];
}

export type MaterialWithContext = LectureMaterial & {
  course: Pick<Course, "id" | "title" | "color"> | null;
  lecture: Pick<Lecture, "id" | "title" | "lecture_number"> | null;
};

export async function getAllMaterialsWithContext(): Promise<MaterialWithContext[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const [materialsResult, coursesResult, lecturesResult] = await Promise.all([
    supabase
      .from("lecture_materials")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, title, color")
      .eq("user_id", user.id),
    supabase
      .from("lectures")
      .select("id, title, lecture_number")
      .eq("user_id", user.id),
  ]);

  if (materialsResult.error) {
    throw new Error(materialsResult.error.message);
  }

  if (coursesResult.error) {
    throw new Error(coursesResult.error.message);
  }

  if (lecturesResult.error) {
    throw new Error(lecturesResult.error.message);
  }

  const courses = new Map(
    (coursesResult.data ?? []).map((course) => [course.id, course]),
  );
  const lectures = new Map(
    (lecturesResult.data ?? []).map((lecture) => [lecture.id, lecture]),
  );

  return ((materialsResult.data ?? []) as LectureMaterial[]).map((material) => ({
    ...material,
    course: courses.get(material.course_id) ?? null,
    lecture: lectures.get(material.lecture_id) ?? null,
  }));
}
