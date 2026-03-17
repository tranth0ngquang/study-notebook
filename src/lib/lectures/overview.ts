import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture } from "@/types/domain";

export type LectureWithCourse = Lecture & {
  course: Pick<Course, "id" | "title" | "color" | "code"> | null;
};

export async function getAllLecturesWithCourse(): Promise<LectureWithCourse[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const [lecturesResult, coursesResult] = await Promise.all([
    supabase
      .from("lectures")
      .select("*")
      .eq("user_id", user.id)
      .order("lecture_date", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, title, color, code")
      .eq("user_id", user.id),
  ]);

  if (lecturesResult.error) {
    throw new Error(lecturesResult.error.message);
  }

  if (coursesResult.error) {
    throw new Error(coursesResult.error.message);
  }

  const courses = new Map(
    (coursesResult.data ?? []).map((course) => [course.id, course]),
  );

  return ((lecturesResult.data ?? []) as Lecture[]).map((lecture) => ({
    ...lecture,
    course: courses.get(lecture.course_id) ?? null,
  }));
}
