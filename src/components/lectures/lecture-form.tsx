"use client";

import { useActionState } from "react";

import {
  initialLectureFormState,
  type LectureFormState,
} from "@/lib/lectures/types";
import type { Lecture } from "@/types/domain";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { LectureFormSubmit } from "./lecture-form-submit";

type LectureFormProps = {
  action: (
    state: LectureFormState,
    formData: FormData,
  ) => Promise<LectureFormState>;
  courseId: string;
  initialValues?: Partial<Lecture>;
  mode: "create" | "edit";
};

function valueOrEmpty(value: string | number | null | undefined) {
  return value ?? "";
}

export function LectureForm({
  action,
  courseId,
  initialValues,
  mode,
}: LectureFormProps) {
  const [state, formAction] = useActionState(action, initialLectureFormState);

  return (
    <form action={formAction} className="space-y-5">
      <input name="courseId" type="hidden" value={courseId} />
      {mode === "edit" && initialValues?.id ? (
        <input name="lectureId" type="hidden" value={initialValues.id} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-lecture-title`}>
            Title
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.title)}
            defaultValue={valueOrEmpty(initialValues?.title)}
            id={`${mode}-lecture-title`}
            name="title"
            placeholder="Normalization and Functional Dependencies"
            type="text"
          />
          {state.fieldErrors?.title ? (
            <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-topic`}>
            Topic
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.topic)}
            defaultValue={valueOrEmpty(initialValues?.topic)}
            id={`${mode}-topic`}
            name="topic"
            placeholder="Database design"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-lecture-number`}>
            Lecture number
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.lectureNumber)}
            defaultValue={valueOrEmpty(initialValues?.lecture_number)}
            id={`${mode}-lecture-number`}
            name="lectureNumber"
            placeholder="3"
            type="number"
          />
          {state.fieldErrors?.lectureNumber ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.lectureNumber[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-lecture-date`}>
            Lecture date
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.lectureDate)}
            defaultValue={valueOrEmpty(initialValues?.lecture_date)}
            id={`${mode}-lecture-date`}
            name="lectureDate"
            type="date"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-lecturer`}>
            Lecturer
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.lecturer)}
            defaultValue={valueOrEmpty(initialValues?.lecturer)}
            id={`${mode}-lecturer`}
            name="lecturer"
            placeholder="Dr. Nguyen"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-duration`}>
            Duration in minutes
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.durationMinutes)}
            defaultValue={valueOrEmpty(initialValues?.duration_minutes)}
            id={`${mode}-duration`}
            name="durationMinutes"
            placeholder="90"
            type="number"
          />
          {state.fieldErrors?.durationMinutes ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.durationMinutes[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-local-video`}>
            Local video label
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.localVideoLabel)}
            defaultValue={valueOrEmpty(initialValues?.local_video_label)}
            id={`${mode}-local-video`}
            name="localVideoLabel"
            placeholder="DB_SYS_L03.mp4"
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-record-link`}>
            Record link
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.recordLink)}
            defaultValue={valueOrEmpty(initialValues?.record_link)}
            id={`${mode}-record-link`}
            name="recordLink"
            placeholder="https://..."
            type="url"
          />
          {state.fieldErrors?.recordLink ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.recordLink[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-slides-link`}>
            Slides link
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.slidesLink)}
            defaultValue={valueOrEmpty(initialValues?.slides_link)}
            id={`${mode}-slides-link`}
            name="slidesLink"
            placeholder="https://..."
            type="url"
          />
          {state.fieldErrors?.slidesLink ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.slidesLink[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700" htmlFor={`${mode}-summary`}>
            Summary
          </label>
          <Textarea
            aria-invalid={Boolean(state.fieldErrors?.summary)}
            defaultValue={valueOrEmpty(initialValues?.summary)}
            id={`${mode}-summary`}
            name="summary"
            placeholder="What was covered, what matters most, and what to revisit."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor={`${mode}-understanding-score`}
          >
            Understanding score
          </label>
          <Input
            aria-invalid={Boolean(state.fieldErrors?.understandingScore)}
            defaultValue={valueOrEmpty(initialValues?.understanding_score)}
            id={`${mode}-understanding-score`}
            max={5}
            min={1}
            name="understandingScore"
            placeholder="4"
            type="number"
          />
          {state.fieldErrors?.understandingScore ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.understandingScore[0]}
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

      <div className="flex items-center justify-end">
        <LectureFormSubmit
          idleLabel={mode === "create" ? "Create lecture" : "Save lecture"}
          pendingLabel={mode === "create" ? "Creating..." : "Saving..."}
        />
      </div>
    </form>
  );
}
