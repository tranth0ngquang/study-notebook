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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        {examples.length > 0 ? <Accordion multiple>{examples.map((example) => <ExampleRow key={example.id} courseId={courseId} lectureId={lectureId} example={example} />)}</Accordion> : <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No examples yet.</p>}
      </CardContent>
    </Card>
  );
}

function ExampleRow({ courseId, lectureId, example }: { courseId: string; lectureId: string; example: Example }) {
  const [state, action] = useActionState(updateExampleAction, initialSectionActionState);
  return (
    <AccordionItem className="rounded-[1.75rem] border border-violet-200/80 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 shadow-[0_20px_45px_-30px_rgba(139,92,246,0.6)]" value={example.id}>
      <div className="flex items-start gap-3 p-5">
        <div className="min-w-0 flex-1">
          <AccordionTrigger className="bg-white/35">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-violet-200 bg-violet-100 text-violet-900">
                  Saved example
                </Badge>
                <span className="inline-flex rounded-full border border-fuchsia-200 bg-white/90 px-3 py-1 text-sm font-medium text-fuchsia-700">
                  Item #{example.sort_order + 1}
                </span>
              </div>
              <div className="space-y-1">
                <p className="line-clamp-1 text-lg font-semibold text-slate-900">
                  {example.title || "Untitled example"}
                </p>
                <p className="line-clamp-2 text-sm text-slate-600">
                  {example.description || "Expand to review the worked example details."}
                </p>
              </div>
            </div>
          </AccordionTrigger>
        </div>
        <form action={deleteExampleAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={example.id} />
          <SectionDeleteButton confirmMessage="Delete this example?" />
        </form>
      </div>

      <AccordionContent>
        <form action={action} className="space-y-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={example.id} />
          <input name="sortOrder" type="hidden" value={example.sort_order} />
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
                  Title
                </p>
                <Input defaultValue={example.title ?? ""} name="title" placeholder="Example title" />
              </div>
              <div className="hidden md:block" />
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-700">
                  Description
                </p>
                <Textarea className="md:col-span-2" defaultValue={example.description ?? ""} name="description" rows={4} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <SectionSubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
          </div>
        </form>
      </AccordionContent>
      {state.message ? <p className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-teal-700"}`}>{state.message}</p> : null}
    </AccordionItem>
  );
}
