"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  initialCourseFormState,
  type CourseFormState,
} from "@/lib/courses/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { courseSchema } from "@/validation/courses";

function normalizeCoursePayload(formData: FormData) {
  return {
    name: formData.get("name"),
    code: formData.get("code"),
    semester: formData.get("semester"),
    color: formData.get("color"),
    description: formData.get("description"),
    archived: formData.get("archived") === "on",
  };
}

function revalidateCoursePaths(courseId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/courses");

  if (courseId) {
    revalidatePath(`/courses/${courseId}`);
  }
}

export async function createCourseAction(
  previousState: CourseFormState = initialCourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  void previousState;

  const parsed = courseSchema.safeParse(normalizeCoursePayload(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
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

  const { error } = await supabase.from("courses").insert({
    user_id: user.id,
    title: parsed.data.name,
    code: parsed.data.code ?? null,
    term: parsed.data.semester ?? null,
    color: parsed.data.color ?? null,
    description: parsed.data.description ?? null,
    archived: parsed.data.archived,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateCoursePaths();

  return {
    status: "success",
    message: "Course created.",
  };
}

export async function updateCourseAction(
  previousState: CourseFormState = initialCourseFormState,
  formData: FormData,
): Promise<CourseFormState> {
  void previousState;

  const courseId = String(formData.get("courseId") ?? "");
  const parsed = courseSchema.safeParse(normalizeCoursePayload(formData));

  if (!courseId) {
    return {
      status: "error",
      message: "Course ID is missing.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
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
    .from("courses")
    .update({
      title: parsed.data.name,
      code: parsed.data.code ?? null,
      term: parsed.data.semester ?? null,
      color: parsed.data.color ?? null,
      description: parsed.data.description ?? null,
      archived: parsed.data.archived,
    })
    .eq("id", courseId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateCoursePaths(courseId);

  return {
    status: "success",
    message: "Course updated.",
  };
}

export async function deleteCourseAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/courses");

  if (!courseId) {
    redirect(redirectTo);
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("courses").delete().eq("id", courseId).eq("user_id", user.id);

  revalidateCoursePaths(courseId);
  redirect(redirectTo);
}
