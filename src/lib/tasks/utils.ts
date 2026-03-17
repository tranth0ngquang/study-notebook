import type { Task, TaskStatus, TaskType } from "@/types/domain";

export function formatTaskTypeLabel(type: TaskType) {
  return type === "assignment" ? "Assignment" : "Action item";
}

export function formatTaskStatusLabel(status: TaskStatus) {
  if (status === "todo") return "To do";
  if (status === "doing") return "Doing";
  return "Done";
}

export function isTaskOverdue(task: Pick<Task, "due_date" | "status">) {
  if (!task.due_date || task.status === "done") {
    return false;
  }

  const today = new Date();
  const currentDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  return new Date(`${task.due_date}T00:00:00Z`) < currentDate;
}

export function formatTaskDate(date: string | null) {
  if (!date) {
    return "No due date";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString();
}
