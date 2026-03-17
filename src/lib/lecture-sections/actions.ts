"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  initialSectionActionState,
  type SectionActionState,
} from "@/lib/lecture-sections/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  lectureConceptSchema,
  lectureExampleSchema,
  lectureListItemSchema,
  lectureQuestionSchema,
  lectureTimestampSchema,
} from "@/validation/lectures";

function normalizeNullable(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function revalidateLectureWorkspace(courseId: string, lectureId: string) {
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
}

async function getNextSortOrder(
  table:
    | "lecture_objectives"
    | "lecture_concepts"
    | "lecture_examples"
    | "lecture_timestamps"
    | "lecture_questions",
  lectureId: string,
  userId: string,
) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .eq("lecture_id", lectureId)
    .eq("user_id", userId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.sort_order ?? -1) + 1;
}

async function getOwner() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function createObjectiveAction(
  previousState: SectionActionState = initialSectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const parsed = lectureListItemSchema.safeParse({
    content: formData.get("content"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Please correct the objective.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const sortOrder = await getNextSortOrder("lecture_objectives", lectureId, user.id);

  const { error } = await supabase.from("lecture_objectives").insert({
    user_id: user.id,
    lecture_id: lectureId,
    content: parsed.data.content,
    sort_order: sortOrder,
  });
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Objective saved." };
}

export async function updateObjectiveAction(
  previousState: SectionActionState = initialSectionActionState,
  formData: FormData,
): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const parsed = lectureListItemSchema.safeParse({
    content: formData.get("content"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!itemId) return { status: "error", message: "Objective ID is missing." };
  if (!parsed.success) return { status: "error", message: "Please correct the objective.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const { error } = await supabase.from("lecture_objectives").update({
    content: parsed.data.content,
    sort_order: parsed.data.sortOrder,
  }).eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Objective updated." };
}

export async function deleteObjectiveAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase, user } = await getOwner();
  if (!user) redirect("/login");
  await supabase.from("lecture_objectives").delete().eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  revalidateLectureWorkspace(courseId, lectureId);
  redirect(`/courses/${courseId}/lectures/${lectureId}`);
}

export async function createConceptAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const parsed = lectureConceptSchema.safeParse({
    title: normalizeNullable(formData, "title"),
    definition: normalizeNullable(formData, "definition"),
    formula: normalizeNullable(formData, "formula"),
    example: normalizeNullable(formData, "example"),
    usageNote: normalizeNullable(formData, "usageNote"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { status: "error", message: "Please correct the concept.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const sortOrder = await getNextSortOrder("lecture_concepts", lectureId, user.id);
  const content = [parsed.data.title, parsed.data.definition, parsed.data.formula, parsed.data.example, parsed.data.usageNote].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("lecture_concepts").insert({
    user_id: user.id,
    lecture_id: lectureId,
    title: parsed.data.title ?? null,
    definition: parsed.data.definition ?? null,
    formula: parsed.data.formula ?? null,
    example: parsed.data.example ?? null,
    usage_note: parsed.data.usageNote ?? null,
    content,
    sort_order: sortOrder,
  });
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Concept saved." };
}

export async function updateConceptAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const parsed = lectureConceptSchema.safeParse({
    title: normalizeNullable(formData, "title"),
    definition: normalizeNullable(formData, "definition"),
    formula: normalizeNullable(formData, "formula"),
    example: normalizeNullable(formData, "example"),
    usageNote: normalizeNullable(formData, "usageNote"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!itemId) return { status: "error", message: "Concept ID is missing." };
  if (!parsed.success) return { status: "error", message: "Please correct the concept.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const content = [parsed.data.title, parsed.data.definition, parsed.data.formula, parsed.data.example, parsed.data.usageNote].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("lecture_concepts").update({
    title: parsed.data.title ?? null,
    definition: parsed.data.definition ?? null,
    formula: parsed.data.formula ?? null,
    example: parsed.data.example ?? null,
    usage_note: parsed.data.usageNote ?? null,
    content,
    sort_order: parsed.data.sortOrder,
  }).eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Concept updated." };
}

export async function deleteConceptAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase, user } = await getOwner();
  if (!user) redirect("/login");
  await supabase.from("lecture_concepts").delete().eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  revalidateLectureWorkspace(courseId, lectureId);
  redirect(`/courses/${courseId}/lectures/${lectureId}`);
}

export async function createExampleAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const parsed = lectureExampleSchema.safeParse({
    title: normalizeNullable(formData, "title"),
    description: normalizeNullable(formData, "description"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { status: "error", message: "Please correct the example.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const sortOrder = await getNextSortOrder("lecture_examples", lectureId, user.id);
  const content = [parsed.data.title, parsed.data.description].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("lecture_examples").insert({
    user_id: user.id,
    lecture_id: lectureId,
    title: parsed.data.title ?? null,
    description: parsed.data.description ?? null,
    content,
    sort_order: sortOrder,
  });
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Example saved." };
}

export async function updateExampleAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const parsed = lectureExampleSchema.safeParse({
    title: normalizeNullable(formData, "title"),
    description: normalizeNullable(formData, "description"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!itemId) return { status: "error", message: "Example ID is missing." };
  if (!parsed.success) return { status: "error", message: "Please correct the example.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const content = [parsed.data.title, parsed.data.description].filter(Boolean).join("\n\n");
  const { error } = await supabase.from("lecture_examples").update({
    title: parsed.data.title ?? null,
    description: parsed.data.description ?? null,
    content,
    sort_order: parsed.data.sortOrder,
  }).eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Example updated." };
}

export async function deleteExampleAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase, user } = await getOwner();
  if (!user) redirect("/login");
  await supabase.from("lecture_examples").delete().eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  revalidateLectureWorkspace(courseId, lectureId);
  redirect(`/courses/${courseId}/lectures/${lectureId}`);
}

export async function createTimestampAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const parsed = lectureTimestampSchema.safeParse({
    timeLabel: normalizeNullable(formData, "timeLabel"),
    timeSeconds: formData.get("timeSeconds"),
    title: normalizeNullable(formData, "title"),
    note: normalizeNullable(formData, "note"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { status: "error", message: "Please correct the timestamp.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const sortOrder = await getNextSortOrder("lecture_timestamps", lectureId, user.id);
  const label = parsed.data.timeLabel ?? `${Math.floor(parsed.data.timeSeconds / 60)}:${String(parsed.data.timeSeconds % 60).padStart(2, "0")}`;
  const { error } = await supabase.from("lecture_timestamps").insert({
    user_id: user.id,
    lecture_id: lectureId,
    time_label: parsed.data.timeLabel ?? null,
    title: parsed.data.title ?? null,
    time_seconds: parsed.data.timeSeconds,
    note: parsed.data.note ?? null,
    label,
    sort_order: sortOrder,
  });
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Timestamp saved." };
}

export async function updateTimestampAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const parsed = lectureTimestampSchema.safeParse({
    timeLabel: normalizeNullable(formData, "timeLabel"),
    timeSeconds: formData.get("timeSeconds"),
    title: normalizeNullable(formData, "title"),
    note: normalizeNullable(formData, "note"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!itemId) return { status: "error", message: "Timestamp ID is missing." };
  if (!parsed.success) return { status: "error", message: "Please correct the timestamp.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const label = parsed.data.timeLabel ?? `${Math.floor(parsed.data.timeSeconds / 60)}:${String(parsed.data.timeSeconds % 60).padStart(2, "0")}`;
  const { error } = await supabase.from("lecture_timestamps").update({
    time_label: parsed.data.timeLabel ?? null,
    title: parsed.data.title ?? null,
    time_seconds: parsed.data.timeSeconds,
    note: parsed.data.note ?? null,
    label,
    sort_order: parsed.data.sortOrder,
  }).eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Timestamp updated." };
}

export async function deleteTimestampAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase, user } = await getOwner();
  if (!user) redirect("/login");
  await supabase.from("lecture_timestamps").delete().eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  revalidateLectureWorkspace(courseId, lectureId);
  redirect(`/courses/${courseId}/lectures/${lectureId}`);
}

export async function createQuestionAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const parsed = lectureQuestionSchema.safeParse({
    content: formData.get("content"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { status: "error", message: "Please correct the question.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const sortOrder = await getNextSortOrder("lecture_questions", lectureId, user.id);
  const { error } = await supabase.from("lecture_questions").insert({
    user_id: user.id,
    lecture_id: lectureId,
    content: parsed.data.content,
    is_resolved: parsed.data.status === "resolved",
    sort_order: sortOrder,
  });
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Question saved." };
}

export async function updateQuestionAction(previousState: SectionActionState = initialSectionActionState, formData: FormData): Promise<SectionActionState> {
  void previousState;
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const parsed = lectureQuestionSchema.safeParse({
    content: formData.get("content"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!itemId) return { status: "error", message: "Question ID is missing." };
  if (!parsed.success) return { status: "error", message: "Please correct the question.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { supabase, user } = await getOwner();
  if (!user) return { status: "error", message: "Your session expired. Please log in again." };
  const { error } = await supabase.from("lecture_questions").update({
    content: parsed.data.content,
    is_resolved: parsed.data.status === "resolved",
    sort_order: parsed.data.sortOrder,
  }).eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  if (error) return { status: "error", message: error.message };
  revalidateLectureWorkspace(courseId, lectureId);
  return { status: "success", message: "Question updated." };
}

export async function deleteQuestionAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase, user } = await getOwner();
  if (!user) redirect("/login");
  await supabase.from("lecture_questions").delete().eq("id", itemId).eq("lecture_id", lectureId).eq("user_id", user.id);
  revalidateLectureWorkspace(courseId, lectureId);
  redirect(`/courses/${courseId}/lectures/${lectureId}`);
}
