"use client";

import { useActionState } from "react";

import {
  initialTaskFormState,
  type TaskFormState,
} from "@/lib/tasks/types";
import type { Task } from "@/types/domain";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { TaskSubmitButton } from "./task-submit-button";

type TaskFormProps = {
  action: (
    state: TaskFormState,
    formData: FormData,
  ) => Promise<TaskFormState>;
  courseId: string;
  lectureId: string;
  initialValues?: Partial<Task>;
  mode: "create" | "edit";
};

function valueOrEmpty(value: string | null | undefined) {
  return value ?? "";
}

export function TaskForm({
  action,
  courseId,
  lectureId,
  initialValues,
  mode,
}: TaskFormProps) {
  const [state, formAction] = useActionState(action, initialTaskFormState);

  return (
    <form action={formAction} className="space-y-4">
      <input name="courseId" type="hidden" value={courseId} />
      <input name="lectureId" type="hidden" value={lectureId} />
      {mode === "edit" && initialValues?.id ? (
        <input name="taskId" type="hidden" value={initialValues.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-task-title`}>
            Title
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.title)}
            defaultValue={valueOrEmpty(initialValues?.title)}
            id={`${mode}-task-title`}
            name="title"
            placeholder="Finish normalization problem set"
            type="text"
          />
          {state.fieldErrors?.title ? (
            <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-task-type`}>
            Type
          </label>
          <select
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue={initialValues?.type ?? "assignment"}
            id={`${mode}-task-type`}
            name="type"
          >
            <option value="assignment">Assignment</option>
            <option value="action">Action item</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-task-status`}>
            Status
          </label>
          <select
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue={initialValues?.status ?? "todo"}
            id={`${mode}-task-status`}
            name="status"
          >
            <option value="todo">To do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-task-due-date`}>
            Due date
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.dueDate)}
            defaultValue={valueOrEmpty(initialValues?.due_date)}
            id={`${mode}-task-due-date`}
            name="dueDate"
            type="date"
          />
          {state.fieldErrors?.dueDate ? (
            <p className="text-sm text-destructive">{state.fieldErrors.dueDate[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-task-description`}>
            Description
          </label>
          <Textarea
            aria-invalid={Boolean(state.fieldErrors?.description)}
            defaultValue={valueOrEmpty(initialValues?.description)}
            id={`${mode}-task-description`}
            name="description"
            placeholder="What exactly needs to be finished or reviewed?"
            rows={4}
          />
          {state.fieldErrors?.description ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.description[0]}
            </p>
          ) : null}
        </div>
      </div>

      {state.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            state.status === "error"
              ? "border-destructive/25 bg-destructive/5 text-destructive"
              : "border-teal-200 bg-teal-50 text-teal-800"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex justify-end">
        <TaskSubmitButton
          idleLabel={mode === "create" ? "Add task" : "Save task"}
          pendingLabel={mode === "create" ? "Adding..." : "Saving..."}
        />
      </div>
    </form>
  );
}
