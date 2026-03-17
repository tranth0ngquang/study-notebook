"use client";

import { useActionState } from "react";

import {
  createObjectiveAction,
  deleteObjectiveAction,
  updateObjectiveAction,
} from "@/lib/lecture-sections/actions";
import { initialSectionActionState } from "@/lib/lecture-sections/types";
import type { Database } from "@/types/database";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { SectionDeleteButton } from "./section-delete-button";
import { SectionSubmitButton } from "./section-submit-button";

type Objective = Database["public"]["Tables"]["lecture_objectives"]["Row"];

type ObjectiveSectionProps = {
  courseId: string;
  lectureId: string;
  objectives: Objective[];
};

export function ObjectiveSection({
  courseId,
  lectureId,
  objectives,
}: ObjectiveSectionProps) {
  const [createState, createAction] = useActionState(
    createObjectiveAction,
    initialSectionActionState,
  );

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Objectives</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={createAction} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input name="content" placeholder="Capture the key goal of this lecture" />
            <SectionSubmitButton idleLabel="Add objective" pendingLabel="Saving..." />
          </div>
          {createState.message ? (
            <p className={`mt-3 text-sm ${createState.status === "error" ? "text-destructive" : "text-teal-700"}`}>
              {createState.message}
            </p>
          ) : null}
        </form>

        {objectives.length > 0 ? (
          objectives.map((objective) => (
            <ObjectiveRow
              key={objective.id}
              courseId={courseId}
              lectureId={lectureId}
              objective={objective}
            />
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No objectives yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ObjectiveRow({
  courseId,
  lectureId,
  objective,
}: {
  courseId: string;
  lectureId: string;
  objective: Objective;
}) {
  const [state, action] = useActionState(
    updateObjectiveAction,
    initialSectionActionState,
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Saved objective</Badge>
          <span className="text-sm text-slate-500">#{objective.sort_order + 1}</span>
        </div>
        <form action={deleteObjectiveAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={objective.id} />
          <SectionDeleteButton confirmMessage="Delete this objective?" />
        </form>
      </div>

      <form action={action} className="space-y-3">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Objective
          </p>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={objective.id} />
          <input name="sortOrder" type="hidden" value={objective.sort_order} />
          <Input defaultValue={objective.content} name="content" />
        </div>
        <div className="flex justify-end">
          <SectionSubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
        </div>
      </form>
      {state.message ? (
        <p className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-teal-700"}`}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
