"use client";

import { useActionState } from "react";

import type { CourseFormState } from "@/lib/courses/types";
import { initialCourseFormState } from "@/lib/courses/types";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/domain";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CourseFormSubmit } from "./course-form-submit";

type CourseFormProps = {
  action: (
    state: CourseFormState,
    formData: FormData,
  ) => Promise<CourseFormState>;
  initialValues?: Partial<Course>;
  mode: "create" | "edit";
};

function valueOrEmpty(value: string | null | undefined) {
  return value ?? "";
}

export function CourseForm({ action, initialValues, mode }: CourseFormProps) {
  const [state, formAction] = useActionState(action, initialCourseFormState);

  return (
    <form action={formAction} className="space-y-5">
      {mode === "edit" && initialValues?.id ? (
        <input name="courseId" type="hidden" value={initialValues.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-name`}>
            Course name
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.name)}
            defaultValue={valueOrEmpty(initialValues?.title)}
            id={`${mode}-name`}
            name="name"
            placeholder="Database Systems"
            type="text"
          />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-code`}>
            Code
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.code)}
            defaultValue={valueOrEmpty(initialValues?.code)}
            id={`${mode}-code`}
            name="code"
            placeholder="CS301"
            type="text"
          />
          {state.fieldErrors?.code ? (
            <p className="text-sm text-destructive">{state.fieldErrors.code[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor={`${mode}-semester`}
          >
            Semester
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.semester)}
            defaultValue={valueOrEmpty(initialValues?.term)}
            id={`${mode}-semester`}
            name="semester"
            placeholder="Fall 2026"
            type="text"
          />
          {state.fieldErrors?.semester ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.semester[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-color`}>
            Color
          </label>
          <div className="flex items-center gap-3">
            <div
              className="size-10 rounded-xl border border-slate-200"
              style={{
                backgroundColor: valueOrEmpty(initialValues?.color) || "#0F766E",
              }}
            />
            <Input
              aria-invalid={Boolean(state.fieldErrors?.color)}
              defaultValue={valueOrEmpty(initialValues?.color) || "#0F766E"}
              id={`${mode}-color`}
              name="color"
              placeholder="#0F766E"
              type="text"
            />
          </div>
          {state.fieldErrors?.color ? (
            <p className="text-sm text-destructive">{state.fieldErrors.color[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor={`${mode}-description`}
          >
            Description
          </label>
          <Textarea
            defaultValue={valueOrEmpty(initialValues?.description)}
            id={`${mode}-description`}
            name="description"
            placeholder="Short notes about the course focus, grading, or what you want to track."
            rows={5}
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
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            state.status === "error"
              ? "border-destructive/25 bg-destructive/5 text-destructive"
              : "border-teal-200 bg-teal-50 text-teal-800",
          )}
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex items-center justify-end">
        <CourseFormSubmit
          idleLabel={mode === "create" ? "Create course" : "Save changes"}
          pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
        />
      </div>
    </form>
  );
}
