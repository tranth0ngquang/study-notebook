import Link from "next/link";

import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllTasksWithContext,
  type TaskWithContext,
} from "@/lib/tasks/queries";
import { formatTaskDate, formatTaskTypeLabel } from "@/lib/tasks/utils";

export default async function TasksPage() {
  const tasks = await getAllTasksWithContext();
  const assignments = tasks.filter((task) => task.type === "assignment");
  const actions = tasks.filter((task) => task.type === "action");

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-3">
          <Badge className="w-fit" variant="secondary">
            Tasks
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              Assignments and action items
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Tasks are created inside lecture workspaces. This view helps you
              scan everything still in motion across your study workspace.
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <TaskListGroup
          emptyDescription="No assignments yet."
          tasks={assignments}
          title="Assignments"
        />
        <TaskListGroup
          emptyDescription="No action items yet."
          tasks={actions}
          title="Action items"
        />
      </div>
    </div>
  );
}

function TaskListGroup({
  emptyDescription,
  tasks,
  title,
}: {
  emptyDescription: string;
  tasks: TaskWithContext[];
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
            <Link
              key={task.id}
              className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              href={
                task.lecture_id
                  ? `/courses/${task.course_id}/lectures/${task.lecture_id}`
                  : "/courses"
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{formatTaskTypeLabel(task.type)}</Badge>
                    <TaskStatusBadge
                      dueDate={task.due_date}
                      status={task.status}
                    />
                  </div>
                  <p className="font-medium text-slate-950">{task.title}</p>
                  <p className="text-sm text-slate-500">
                    {task.course?.title ?? "Unknown course"}
                    {task.lecture?.title ? ` - ${task.lecture.title}` : ""}
                  </p>
                </div>
                <span className="text-sm text-slate-500">
                  Due {formatTaskDate(task.due_date)}
                </span>
              </div>
            </Link>
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
