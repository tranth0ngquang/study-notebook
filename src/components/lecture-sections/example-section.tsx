"use client";

import { useActionState } from "react";

import {
  createExampleAction,
  deleteExampleAction,
  updateExampleAction,
} from "@/lib/lecture-sections/actions";
import { initialSectionActionState } from "@/lib/lecture-sections/types";
import type { Database } from "@/types/database";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SectionDeleteButton } from "./section-delete-button";
import { SectionSubmitButton } from "./section-submit-button";

type Example = Database["public"]["Tables"]["lecture_examples"]["Row"];

export function ExampleSection({ courseId, lectureId, examples }: { courseId: string; lectureId: string; examples: Example[] }) {
  const [createState, createAction] = useActionState(createExampleAction, initialSectionActionState);
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader><CardTitle>Examples</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <form action={createAction} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Example title" />
            <Textarea className="md:col-span-2" name="description" placeholder="Describe the worked example" rows={4} />
          </div>
          <div className="mt-3 flex justify-end">
            <SectionSubmitButton idleLabel="Add example" pendingLabel="Saving..." />
          </div>
          {createState.message ? <p className={`mt-3 text-sm ${createState.status === "error" ? "text-destructive" : "text-teal-700"}`}>{createState.message}</p> : null}
        </form>
        {examples.length > 0 ? examples.map((example) => <ExampleRow key={example.id} courseId={courseId} lectureId={lectureId} example={example} />) : <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No examples yet.</p>}
      </CardContent>
    </Card>
  );
}

function ExampleRow({ courseId, lectureId, example }: { courseId: string; lectureId: string; example: Example }) {
  const [state, action] = useActionState(updateExampleAction, initialSectionActionState);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Saved example</Badge>
          <span className="text-sm text-slate-500">#{example.sort_order + 1}</span>
        </div>
        <form action={deleteExampleAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={example.id} />
          <SectionDeleteButton confirmMessage="Delete this example?" />
        </form>
      </div>

      <form action={action} className="grid gap-3 md:grid-cols-2">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={example.id} />
          <input name="sortOrder" type="hidden" value={example.sort_order} />
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Title
            </p>
            <Input defaultValue={example.title ?? ""} name="title" placeholder="Example title" />
          </div>
          <div className="hidden md:block" />
          <div className="space-y-2 md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Description
            </p>
            <Textarea className="md:col-span-2" defaultValue={example.description ?? ""} name="description" rows={4} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <SectionSubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
          </div>
      </form>
      {state.message ? <p className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-teal-700"}`}>{state.message}</p> : null}
    </div>
  );
}
