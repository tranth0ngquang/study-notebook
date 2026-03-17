"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  initialTaskFormState,
  type TaskFormState,
} from "@/lib/tasks/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { TaskStatus } from "@/types/domain";
import { taskSchema, type TaskInput } from "@/validation/tasks";

function normalizeTaskPayload(formData: FormData): TaskInput {
  const nullable = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value.length > 0 ? value : null;
  };

  return {
    courseId: String(formData.get("courseId") ?? ""),
    lectureId: String(formData.get("lectureId") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: nullable("description"),
    type: String(formData.get("type") ?? "assignment") as TaskInput["type"],
    status: String(formData.get("status") ?? "todo") as TaskInput["status"],
    dueDate: nullable("dueDate"),
  };
}

function revalidateTaskPaths(courseId: string, lectureId?: string | null) {
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath(`/courses/${courseId}`);
  if (lectureId) {
    revalidatePath(`/courses/${courseId}/lectures/${lectureId}`);
  }
}

function getCompletedAt(status: TaskInput["status"]) {
  return status === "done" ? new Date().toISOString() : null;
}

export async function createTaskAction(
  previousState: TaskFormState = initialTaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  void previousState;

  const parsed = taskSchema.safeParse(normalizeTaskPayload(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted task fields.",
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

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    course_id: parsed.data.courseId,
    lecture_id: parsed.data.lectureId,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    type: parsed.data.type,
    status: parsed.data.status,
    due_date: parsed.data.dueDate ?? null,
    completed_at: getCompletedAt(parsed.data.status),
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateTaskPaths(parsed.data.courseId, parsed.data.lectureId);

  return {
    status: "success",
    message: "Task created.",
  };
}

export async function updateTaskAction(
  previousState: TaskFormState = initialTaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  void previousState;

  const taskId = String(formData.get("taskId") ?? "");
  const parsed = taskSchema.safeParse(normalizeTaskPayload(formData));

  if (!taskId) {
    return {
      status: "error",
      message: "Task ID is missing.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted task fields.",
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
    .from("tasks")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      type: parsed.data.type,
      status: parsed.data.status,
      due_date: parsed.data.dueDate ?? null,
      completed_at: getCompletedAt(parsed.data.status),
    })
    .eq("id", taskId)
    .eq("course_id", parsed.data.courseId)
    .eq("lecture_id", parsed.data.lectureId)
    .eq("user_id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidateTaskPaths(parsed.data.courseId, parsed.data.lectureId);

  return {
    status: "success",
    message: "Task updated.",
  };
}

export async function quickUpdateTaskStatusAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!courseId || !lectureId || !taskId) {
    return;
  }

  if (!["todo", "doing", "done"].includes(status)) {
    return;
  }

  const nextStatus = status as TaskStatus;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase
    .from("tasks")
    .update({
      status: nextStatus,
      completed_at: nextStatus === "done" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .eq("course_id", courseId)
    .eq("lecture_id", lectureId)
    .eq("user_id", user.id);

  revalidateTaskPaths(courseId, lectureId);
}

export async function deleteTaskAction(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lectureId = String(formData.get("lectureId") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const redirectTo =
    String(formData.get("redirectTo") ?? "") ||
    `/courses/${courseId}/lectures/${lectureId}`;

  if (!courseId || !lectureId || !taskId) {
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
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("course_id", courseId)
    .eq("lecture_id", lectureId)
    .eq("user_id", user.id);

  revalidateTaskPaths(courseId, lectureId);
  redirect(redirectTo);
}
