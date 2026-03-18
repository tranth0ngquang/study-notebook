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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <Accordion multiple>
            {objectives.map((objective) => (
            <ObjectiveRow
              key={objective.id}
              courseId={courseId}
              lectureId={lectureId}
              objective={objective}
            />
            ))}
          </Accordion>
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
    <AccordionItem
      className="rounded-[1.75rem] border border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-[0_20px_45px_-30px_rgba(14,165,233,0.6)]"
      value={objective.id}
    >
      <div className="flex items-start gap-3 p-5">
        <div className="min-w-0 flex-1">
          <AccordionTrigger className="bg-white/35">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-sky-200 bg-sky-100 text-sky-900">
                  Saved objective
                </Badge>
                <span className="inline-flex rounded-full border border-sky-200 bg-white/90 px-3 py-1 text-sm font-medium text-sky-700">
                  Item #{objective.sort_order + 1}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Objective preview
                </p>
                <p className="line-clamp-2 text-base font-medium text-slate-900">
                  {objective.content}
                </p>
              </div>
            </div>
          </AccordionTrigger>
        </div>
        <form action={deleteObjectiveAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={objective.id} />
          <SectionDeleteButton confirmMessage="Delete this objective?" />
        </form>
      </div>

      <AccordionContent>
        <form action={action} className="space-y-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={objective.id} />
          <input name="sortOrder" type="hidden" value={objective.sort_order} />
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Saved objective content
              </p>
              <Input defaultValue={objective.content} name="content" />
            </div>
          </div>
          <div className="flex justify-end">
            <SectionSubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
          </div>
        </form>
      </AccordionContent>
      {state.message ? (
        <p className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-teal-700"}`}>
          {state.message}
        </p>
      ) : null}
    </AccordionItem>
  );
}
