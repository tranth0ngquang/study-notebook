import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture, Task } from "@/types/domain";
import type { Database } from "@/types/database";

type ReviewQuestion = Database["public"]["Tables"]["lecture_questions"]["Row"];

export type ReviewLecture = Lecture & {
  unfinishedTaskCount: number;
  unresolvedQuestionCount: number;
};

export type CourseReviewData = {
  course: Course | null;
  lectures: ReviewLecture[];
  totals: {
    lectures: number;
    lowUnderstanding: number;
    unfinishedTasks: number;
    unresolvedQuestions: number;
  };
};

export type ReviewFilters = {
  lowUnderstandingOnly: boolean;
  unfinishedTasksOnly: boolean;
  unresolvedQuestionsOnly: boolean;
};

export async function getCourseReviewData(
  courseId: string,
  filters: ReviewFilters,
): Promise<CourseReviewData> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      course: null,
      lectures: [],
      totals: {
        lectures: 0,
        lowUnderstanding: 0,
        unfinishedTasks: 0,
        unresolvedQuestions: 0,
      },
    };
  }

  const [courseResult, lecturesResult, questionsResult, tasksResult] =
    await Promise.all([
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
      supabase
        .from("lecture_questions")
        .select("*")
        .eq("user_id", user.id),
      supabase
        .from("tasks")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id),
    ]);

  for (const result of [
    courseResult,
    lecturesResult,
    questionsResult,
    tasksResult,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const lectures = (lecturesResult.data ?? []) as Lecture[];
  const lectureIds = new Set(lectures.map((lecture) => lecture.id));

  const unresolvedCounts = new Map<string, number>();
  for (const question of (questionsResult.data ?? []) as ReviewQuestion[]) {
    if (!lectureIds.has(question.lecture_id) || question.is_resolved) {
      continue;
    }

    unresolvedCounts.set(
      question.lecture_id,
      (unresolvedCounts.get(question.lecture_id) ?? 0) + 1,
    );
  }

  const unfinishedTaskCounts = new Map<string, number>();
  for (const task of (tasksResult.data ?? []) as Task[]) {
    if (!task.lecture_id || !lectureIds.has(task.lecture_id) || task.status === "done") {
      continue;
    }

    unfinishedTaskCounts.set(
      task.lecture_id,
      (unfinishedTaskCounts.get(task.lecture_id) ?? 0) + 1,
    );
  }

  const withCounts = lectures.map((lecture) => ({
    ...lecture,
    unfinishedTaskCount: unfinishedTaskCounts.get(lecture.id) ?? 0,
    unresolvedQuestionCount: unresolvedCounts.get(lecture.id) ?? 0,
  }));

  const filtered = withCounts.filter((lecture) => {
    if (
      filters.lowUnderstandingOnly &&
      !(lecture.understanding_score !== null && lecture.understanding_score <= 2)
    ) {
      return false;
    }

    if (filters.unfinishedTasksOnly && lecture.unfinishedTaskCount === 0) {
      return false;
    }

    if (filters.unresolvedQuestionsOnly && lecture.unresolvedQuestionCount === 0) {
      return false;
    }

    return true;
  });

  return {
    course: (courseResult.data as Course | null) ?? null,
    lectures: filtered,
    totals: {
      lectures: withCounts.length,
      lowUnderstanding: withCounts.filter(
        (lecture) =>
          lecture.understanding_score !== null && lecture.understanding_score <= 2,
      ).length,
      unfinishedTasks: withCounts.reduce(
        (sum, lecture) => sum + lecture.unfinishedTaskCount,
        0,
      ),
      unresolvedQuestions: withCounts.reduce(
        (sum, lecture) => sum + lecture.unresolvedQuestionCount,
        0,
      ),
    },
  };
}
