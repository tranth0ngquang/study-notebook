import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Objective = Database["public"]["Tables"]["lecture_objectives"]["Row"];
type Concept = Database["public"]["Tables"]["lecture_concepts"]["Row"];
type Example = Database["public"]["Tables"]["lecture_examples"]["Row"];
type Timestamp = Database["public"]["Tables"]["lecture_timestamps"]["Row"];
type Question = Database["public"]["Tables"]["lecture_questions"]["Row"];

export type LectureSectionsData = {
  objectives: Objective[];
  concepts: Concept[];
  examples: Example[];
  timestamps: Timestamp[];
  questions: Question[];
};

export async function getLectureSections(lectureId: string): Promise<LectureSectionsData> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      objectives: [],
      concepts: [],
      examples: [],
      timestamps: [],
      questions: [],
    };
  }

  const [objectives, concepts, examples, timestamps, questions] = await Promise.all([
    supabase
      .from("lecture_objectives")
      .select("*")
      .eq("lecture_id", lectureId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("lecture_concepts")
      .select("*")
      .eq("lecture_id", lectureId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("lecture_examples")
      .select("*")
      .eq("lecture_id", lectureId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("lecture_timestamps")
      .select("*")
      .eq("lecture_id", lectureId)
      .eq("user_id", user.id)
      .order("time_seconds", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("lecture_questions")
      .select("*")
      .eq("lecture_id", lectureId)
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
  ]);

  for (const result of [objectives, concepts, examples, timestamps, questions]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  return {
    objectives: (objectives.data ?? []) as Objective[],
    concepts: (concepts.data ?? []) as Concept[],
    examples: (examples.data ?? []) as Example[],
    timestamps: (timestamps.data ?? []) as Timestamp[],
    questions: (questions.data ?? []) as Question[],
  };
}
