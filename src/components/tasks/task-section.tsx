"use client";

import {
  createTaskAction,
  deleteTaskAction,
  quickUpdateTaskStatusAction,
  updateTaskAction,
} from "@/lib/tasks/actions";
import {
  formatTaskDate,
  formatTaskTypeLabel,
  isTaskOverdue,
} from "@/lib/tasks/utils";
import type { Task } from "@/types/domain";

import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TaskSectionProps = {
  courseId: string;
  lectureId: string;
  tasks: Task[];
};

const statusOptions = [
  { value: "todo", label: "To do" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
] as const;

export function TaskSection({
  courseId,
  lectureId,
  tasks,
}: TaskSectionProps) {
  const grouped = {
    assignment: tasks.filter((task) => task.type === "assignment"),
    action: tasks.filter((task) => task.type === "action"),
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>Add lecture task</CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Track assignments and action items tied to this lecture. Due dates
            and statuses stay lightweight and practical for repeated study use.
          </p>
        </CardHeader>
        <CardContent>
          <TaskForm
            action={createTaskAction}
            courseId={courseId}
            lectureId={lectureId}
            mode="create"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <TaskGroup
          courseId={courseId}
          emptyDescription="No assignments yet for this lecture."
          lectureId={lectureId}
          tasks={grouped.assignment}
          title="Assignments"
        />
        <TaskGroup
          courseId={courseId}
          emptyDescription="No action items yet for this lecture."
          lectureId={lectureId}
          tasks={grouped.action}
          title="Action items"
        />
      </div>
    </div>
  );
}

function TaskGroup({
  courseId,
  emptyDescription,
  lectureId,
  tasks,
  title,
}: {
  courseId: string;
  emptyDescription: string;
  lectureId: string;
  tasks: Task[];
  title: string;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <Badge variant="outline">{tasks.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              courseId={courseId}
              lectureId={lectureId}
              task={task}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            {emptyDescription}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TaskRow({
  courseId,
  lectureId,
  task,
}: {
  courseId: string;
  lectureId: string;
  task: Task;
}) {
  const overdue = isTaskOverdue(task);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{formatTaskTypeLabel(task.type)}</Badge>
            <TaskStatusBadge dueDate={task.due_date} status={task.status} />
          </div>
          <h3 className="text-base font-semibold text-slate-950">{task.title}</h3>
          <p className="text-sm text-slate-600">
            {task.description?.trim() || "No description yet."}
          </p>
          <p
            className={`text-sm ${
              overdue ? "font-medium text-amber-700" : "text-slate-500"
            }`}
          >
            Due {formatTaskDate(task.due_date)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <form action={quickUpdateTaskStatusAction} key={option.value}>
              <input name="courseId" type="hidden" value={courseId} />
              <input name="lectureId" type="hidden" value={lectureId} />
              <input name="taskId" type="hidden" value={task.id} />
              <input name="status" type="hidden" value={option.value} />
              <Button
                size="sm"
                type="submit"
                variant={task.status === option.value ? "default" : "outline"}
              >
                {option.label}
              </Button>
            </form>
          ))}
        </div>
      </div>

      <TaskForm
        action={updateTaskAction}
        courseId={courseId}
        initialValues={task}
        lectureId={lectureId}
        mode="edit"
      />

      <div className="flex justify-end">
        <form action={deleteTaskAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="taskId" type="hidden" value={task.id} />
          <input
            name="redirectTo"
            type="hidden"
            value={`/courses/${courseId}/lectures/${lectureId}`}
          />
          <DeleteTaskButton confirmMessage={`Delete "${task.title}"?`} />
        </form>
      </div>
    </div>
  );
}
