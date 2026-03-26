import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Course, Lecture } from "@/types/domain";
import type { Database } from "@/types/database";

type Concept = Database["public"]["Tables"]["lecture_concepts"]["Row"];
type Question = Database["public"]["Tables"]["lecture_questions"]["Row"];

export type SearchMatch = {
  field: "overview" | "title" | "topic" | "summary" | "concept" | "question";
  label: string;
  snippet: string;
};

export type CourseSearchResult = {
  lecture: Lecture;
  matches: SearchMatch[];
};

export type CourseSearchData = {
  course: Course | null;
  results: CourseSearchResult[];
  query: string;
};

function includesQuery(value: string | null | undefined, query: string) {
  return Boolean(value && value.toLowerCase().includes(query));
}

function toSnippet(value: string, query: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  const lower = normalized.toLowerCase();
  const index = lower.indexOf(query);

  if (index === -1) {
    return normalized.slice(0, 160);
  }

  const start = Math.max(0, index - 48);
  const end = Math.min(normalized.length, index + query.length + 72);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < normalized.length ? "..." : "";

  return `${prefix}${normalized.slice(start, end)}${suffix}`;
}

export async function searchCourseContent(
  courseId: string,
  rawQuery: string,
): Promise<CourseSearchData> {
  const query = rawQuery.trim().toLowerCase();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      course: null,
      results: [],
      query: rawQuery,
    };
  }

  const [courseResult, lecturesResult, conceptsResult, questionsResult] =
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
        .from("lecture_concepts")
        .select("*")
        .eq("user_id", user.id),
      supabase
        .from("lecture_questions")
        .select("*")
        .eq("user_id", user.id),
    ]);

  for (const result of [
    courseResult,
    lecturesResult,
    conceptsResult,
    questionsResult,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const course = (courseResult.data as Course | null) ?? null;
  const lectures = (lecturesResult.data ?? []) as Lecture[];

  if (!course) {
    return {
      course,
      results: [],
      query: rawQuery,
    };
  }

  if (query.length === 0) {
    return {
      course,
      results: lectures.map((lecture) => ({
        lecture,
        matches: [
          {
            field: "overview",
            label: "Lecture overview",
            snippet:
              lecture.summary?.trim() ||
              lecture.topic?.trim() ||
              "Open this lecture to review its notes, timestamps, tasks, materials, and questions.",
          },
        ],
      })),
      query: rawQuery,
    };
  }

  const lectureIds = new Set(lectures.map((lecture) => lecture.id));
  const concepts = ((conceptsResult.data ?? []) as Concept[]).filter((concept) =>
    lectureIds.has(concept.lecture_id),
  );
  const questions = ((questionsResult.data ?? []) as Question[]).filter(
    (question) => lectureIds.has(question.lecture_id),
  );

  const matchesByLecture = new Map<string, SearchMatch[]>();

  const pushMatch = (lectureId: string, match: SearchMatch) => {
    const current = matchesByLecture.get(lectureId) ?? [];
    if (
      current.some(
        (existing) =>
          existing.field === match.field && existing.snippet === match.snippet,
      )
    ) {
      return;
    }

    current.push(match);
    matchesByLecture.set(lectureId, current.slice(0, 5));
  };

  for (const lecture of lectures) {
    if (includesQuery(lecture.title, query)) {
      pushMatch(lecture.id, {
        field: "title",
        label: "Lecture title",
        snippet: toSnippet(lecture.title, query),
      });
    }

    if (includesQuery(lecture.topic, query)) {
      pushMatch(lecture.id, {
        field: "topic",
        label: "Topic",
        snippet: toSnippet(lecture.topic ?? "", query),
      });
    }

    if (includesQuery(lecture.summary, query)) {
      pushMatch(lecture.id, {
        field: "summary",
        label: "Summary",
        snippet: toSnippet(lecture.summary ?? "", query),
      });
    }
  }

  for (const concept of concepts) {
    const conceptParts = [
      concept.title,
      concept.content,
      concept.definition,
      concept.formula,
      concept.example,
      concept.usage_note,
    ].filter(Boolean);
    const combined = conceptParts.join(" ");

    if (includesQuery(combined, query)) {
      pushMatch(concept.lecture_id, {
        field: "concept",
        label: "Concept",
        snippet: toSnippet(combined, query),
      });
    }
  }

  for (const question of questions) {
    if (includesQuery(question.content, query)) {
      pushMatch(question.lecture_id, {
        field: "question",
        label: "Question",
        snippet: toSnippet(question.content, query),
      });
    }
  }

  const results = lectures
    .filter((lecture) => matchesByLecture.has(lecture.id))
    .map((lecture) => ({
      lecture,
      matches: matchesByLecture.get(lecture.id) ?? [],
    }));

  return {
    course,
    results,
    query: rawQuery,
  };
}
