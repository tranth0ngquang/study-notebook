import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture } from "@/types/domain";

export async function getLecturesByCourse(courseId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("lectures")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .order("lecture_number", { ascending: true, nullsFirst: false })
    .order("lecture_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Lecture[];
}

export async function getLectureById(courseId: string, lectureId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("lectures")
    .select("*")
    .eq("id", lectureId)
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Lecture | null;
}

export async function getCourseWithLectures(courseId: string): Promise<{
  course: Course | null;
  lectures: Lecture[];
}> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { course: null, lectures: [] };
  }

  const [courseResult, lectureResult] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("lectures")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .order("lecture_number", { ascending: true, nullsFirst: false })
      .order("lecture_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }),
  ]);

  if (courseResult.error) {
    throw new Error(courseResult.error.message);
  }

  if (lectureResult.error) {
    throw new Error(lectureResult.error.message);
  }

  return {
    course: courseResult.data as Course | null,
    lectures: lectureResult.data as Lecture[],
  };
}
