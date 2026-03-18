"use client";

import { useActionState } from "react";

import {
  createConceptAction,
  deleteConceptAction,
  updateConceptAction,
} from "@/lib/lecture-sections/actions";
import { initialSectionActionState } from "@/lib/lecture-sections/types";
import type { Database } from "@/types/database";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SectionDeleteButton } from "./section-delete-button";
import { SectionSubmitButton } from "./section-submit-button";

type Concept = Database["public"]["Tables"]["lecture_concepts"]["Row"];

export function ConceptSection({
  concepts,
  courseId,
  lectureId,
}: {
  concepts: Concept[];
  courseId: string;
  lectureId: string;
}) {
  const [createState, createAction] = useActionState(
    createConceptAction,
    initialSectionActionState,
  );

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Concepts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={createAction} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Concept title" />
            <Textarea className="md:col-span-2" name="definition" placeholder="Definition" rows={3} />
            <Input name="formula" placeholder="Formula or notation" />
            <Input name="example" placeholder="Quick example" />
            <Textarea className="md:col-span-2" name="usageNote" placeholder="When this concept is useful" rows={3} />
          </div>
          <div className="mt-3 flex justify-end">
            <SectionSubmitButton idleLabel="Add concept" pendingLabel="Saving..." />
          </div>
          {createState.message ? <p className={`mt-3 text-sm ${createState.status === "error" ? "text-destructive" : "text-teal-700"}`}>{createState.message}</p> : null}
        </form>
        {concepts.length > 0 ? concepts.map((concept) => <ConceptRow key={concept.id} concept={concept} courseId={courseId} lectureId={lectureId} />) : <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No concepts yet.</p>}
      </CardContent>
    </Card>
  );
}

function ConceptRow({ concept, courseId, lectureId }: { concept: Concept; courseId: string; lectureId: string }) {
  const [state, action] = useActionState(updateConceptAction, initialSectionActionState);
  return (
    <div className="rounded-[1.75rem] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-5 shadow-[0_20px_45px_-30px_rgba(251,191,36,0.75)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge className="border-amber-200 bg-amber-100 text-amber-950">
            Saved concept
          </Badge>
          <span className="inline-flex rounded-full border border-rose-200 bg-white/90 px-3 py-1 text-sm font-medium text-rose-700">
            Item #{concept.sort_order + 1}
          </span>
        </div>
        <form action={deleteConceptAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={concept.id} />
          <SectionDeleteButton confirmMessage="Delete this concept?" />
        </form>
      </div>

      <form action={action} className="space-y-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={concept.id} />
          <input name="sortOrder" type="hidden" value={concept.sort_order} />
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Title
                </p>
                <Input defaultValue={concept.title ?? ""} name="title" placeholder="Concept title" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Formula
                </p>
                <Input defaultValue={concept.formula ?? ""} name="formula" placeholder="Formula or notation" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
                  Definition
                </p>
                <Textarea className="md:col-span-2" defaultValue={concept.definition ?? ""} name="definition" rows={3} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Example
                </p>
                <Input defaultValue={concept.example ?? ""} name="example" placeholder="Quick example" />
              </div>
              <div className="space-y-2 md:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
                  Usage note
                </p>
                <Textarea className="md:col-span-2" defaultValue={concept.usage_note ?? ""} name="usageNote" rows={3} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <SectionSubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
          </div>
      </form>
      {state.message ? <p className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-teal-700"}`}>{state.message}</p> : null}
    </div>
  );
}
