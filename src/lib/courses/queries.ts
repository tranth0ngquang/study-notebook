import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture, Task } from "@/types/domain";

type DashboardData = {
  recentCourses: Course[];
  recentLectures: Lecture[];
  upcomingTasks: Task[];
};

export async function getCourses() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Course[];
}

export async function getCourseById(courseId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Course | null;
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      recentCourses: [],
      recentLectures: [],
      upcomingTasks: [],
    };
  }

  const [coursesResult, lecturesResult, tasksResult] = await Promise.all([
    supabase
      .from("courses")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(4),
    supabase
      .from("lectures")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["todo", "doing"])
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(5),
  ]);

  if (coursesResult.error) {
    throw new Error(coursesResult.error.message);
  }

  if (lecturesResult.error) {
    throw new Error(lecturesResult.error.message);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error.message);
  }

  return {
    recentCourses: coursesResult.data as Course[],
    recentLectures: lecturesResult.data as Lecture[],
    upcomingTasks: tasksResult.data as Task[],
  };
}
