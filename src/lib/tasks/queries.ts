import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture, Task } from "@/types/domain";

export type TaskWithContext = Task & {
  course: Pick<Course, "id" | "title" | "color"> | null;
  lecture: Pick<Lecture, "id" | "title"> | null;
};

export async function getLectureTasks(lectureId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("lecture_id", lectureId)
    .eq("user_id", user.id)
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Task[];
}

export async function getCourseUpcomingTasks(courseId: string, limit = 6) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .in("status", ["todo", "doing"])
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data as Task[];
}

export async function getAllTasksWithContext(): Promise<TaskWithContext[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const [tasksResult, coursesResult, lecturesResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("status", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("updated_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, title, color")
      .eq("user_id", user.id),
    supabase
      .from("lectures")
      .select("id, title")
      .eq("user_id", user.id),
  ]);

  if (tasksResult.error) {
    throw new Error(tasksResult.error.message);
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

  return (tasksResult.data as Task[]).map((task) => ({
    ...task,
    course: courses.get(task.course_id) ?? null,
    lecture: task.lecture_id ? lectures.get(task.lecture_id) ?? null : null,
  }));
}
