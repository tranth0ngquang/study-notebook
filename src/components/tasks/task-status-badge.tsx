import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle } from "lucide-react";

import { formatTaskStatusLabel, isTaskOverdue } from "@/lib/tasks/utils";
import type { TaskStatus } from "@/types/domain";

import { Badge } from "@/components/ui/badge";

type TaskStatusBadgeProps = {
  dueDate: string | null;
  status: TaskStatus;
};

export function TaskStatusBadge({
  dueDate,
  status,
}: TaskStatusBadgeProps) {
  const overdue = isTaskOverdue({ due_date: dueDate, status });

  if (overdue) {
    return (
      <Badge className="gap-1 bg-amber-100 text-amber-800" variant="secondary">
        <AlertTriangle className="size-3" />
        Overdue
      </Badge>
    );
  }

  if (status === "done") {
    return (
      <Badge className="gap-1 bg-emerald-100 text-emerald-800" variant="secondary">
        <CheckCircle2 className="size-3" />
        {formatTaskStatusLabel(status)}
      </Badge>
    );
  }

  if (status === "doing") {
    return (
      <Badge className="gap-1 bg-sky-100 text-sky-800" variant="secondary">
        <LoaderCircle className="size-3" />
        {formatTaskStatusLabel(status)}
      </Badge>
    );
  }

  return (
    <Badge className="gap-1 bg-slate-100 text-slate-800" variant="secondary">
      <Clock3 className="size-3" />
      {formatTaskStatusLabel(status)}
    </Badge>
  );
}
