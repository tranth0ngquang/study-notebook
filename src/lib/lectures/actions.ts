"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  initialLectureFormState,
  type LectureFormState,
} from "@/lib/lectures/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { lectureSchema } from "@/validation/lectures";

function normalizeLecturePayload(formData: FormData) {
  const nullable = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value.length > 0 ? value : null;
  };

  return {
    courseId: String(formData.get("courseId") ?? ""),
    title: String(formData.get("title") ?? ""),
    topic: nullable("topic"),
    lectureNumber: nullable("lectureNumber"),
    lectureDate: nullable("lectureDate"),
    lecturer: nullable("lecturer"),
    durationMinutes: nullable("durationMinutes"),
    localVideoLabel: nullable("localVideoLabel"),
    recordLink: nullable("recordLink"),
    slidesLink: nullable("slidesLink"),
    summary: nullable("summary"),
    understandingScore: nullable("understandingScore"),
  };
}

function revalidateLecturePaths(courseId: string, lectureId?: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lectures`);
  if (lectureId) {
    revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
  }
}

export async function createLectureAction(
  previousState: LectureFormState = initialLectureFormState,
  formData: FormData,
): Promise<LectureFormState> {
  void previousState;

  const parsed = lectureSchema.safeParse(normalizeLecturePayload(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted lecture fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please log in again.",
    };
  }

  const { error } = await supabase.from("lectures").insert({
    user_id: user.id,
    course_id: parsed.data.courseId,
    title: parsed.data.title,
    topic: parsed.data.topic ?? null,
    lecture_number: parsed.data.lectureNumber ?? null,
    lecture_date: parsed.data.lectureDate ?? null,
    lecturer: parsed.data.lecturer ?? null,
    duration_minutes: parsed.data.durationMinutes ?? null,
    local_video_label: parsed.data.localVideoLabel ?? null,
    record_link: parsed.data.recordLink ?? null,
    slides_link: parsed.data.slidesLink ?? null,
    summary: parsed.data.summary ?? null,
    understanding_score: parsed.data.understandingScore ?? null,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateLecturePaths(parsed.data.courseId);

  return {
    status: "success",
    message: "Lecture created.",
  };
}

export async function updateLectureAction(
  previousState: LectureFormState = initialLectureFormState,
  formData: FormData,
): Promise<LectureFormState> {
  void previousState;

  const lectureId = String(formData.get("lectureId") ?? "");
  const parsed = lectureSchema.safeParse(normalizeLecturePayload(formData));

  if (!lectureId) {
    return {
      status: "error",
      message: "Lecture ID is missing.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted lecture fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Your session expired. Please log in again.",
    };
  }

  const { error } = await supabase
    .from("lectures")
    .update({
      title: parsed.data.title,
      topic: parsed.data.topic ?? null,
      lecture_number: parsed.data.lectureNumber ?? null,
      lecture_date: parsed.data.lectureDate ?? null,
      lecturer: parsed.data.lecturer ?? null,
      duration_minutes: parsed.data.durationMinutes ?? null,
      local_video_label: parsed.data.localVideoLabel ?? null,
      record_link: parsed.data.recordLink ?? null,
      slides_link: parsed.data.slidesLink ?? null,
      summary: parsed.data.summary ?? null,
      understanding_score: parsed.data.understandingScore ?? null,
    })
    .eq("id", lectureId)
    .eq("course_id", parsed.data.courseId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateLecturePaths(parsed.data.courseId, lectureId);

  return {
    status: "success",
    message: "Lecture updated.",
  };
}

export async function deleteLectureAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const redirectTo =
    String(formData.get("redirectTo") ?? "") || `/courses/${courseId}`;

  if (!courseId || !lectureId) {
    redirect(redirectTo);
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("lectures")
    .delete()
    .eq("id", lectureId)
    .eq("course_id", courseId)
    .eq("user_id", user.id);

  revalidateLecturePaths(courseId, lectureId);
  redirect(redirectTo);
}
