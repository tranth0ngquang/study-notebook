"use client";

import { useActionState } from "react";

import {
  createQuestionAction,
  deleteQuestionAction,
  updateQuestionAction,
} from "@/lib/lecture-sections/actions";
import { initialSectionActionState } from "@/lib/lecture-sections/types";
import type { Database } from "@/types/database";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { SectionDeleteButton } from "./section-delete-button";
import { SectionSubmitButton } from "./section-submit-button";

type Question = Database["public"]["Tables"]["lecture_questions"]["Row"];

export function QuestionSection({ courseId, lectureId, questions }: { courseId: string; lectureId: string; questions: Question[] }) {
  const [createState, createAction] = useActionState(createQuestionAction, initialSectionActionState);
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader><CardTitle>Questions</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <form action={createAction} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="sortOrder" type="hidden" value="0" />
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <Textarea className="md:col-span-2" name="content" placeholder="What remains unclear or worth revisiting?" rows={3} />
            <select className="h-10 rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" defaultValue="unresolved" name="status">
              <option value="unresolved">Unresolved</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="flex justify-end">
              <SectionSubmitButton idleLabel="Add question" pendingLabel="Saving..." />
            </div>
          </div>
          {createState.message ? <p className={`mt-3 text-sm ${createState.status === "error" ? "text-destructive" : "text-teal-700"}`}>{createState.message}</p> : null}
        </form>
        {questions.length > 0 ? questions.map((question) => <QuestionRow key={question.id} courseId={courseId} lectureId={lectureId} question={question} />) : <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No questions yet.</p>}
      </CardContent>
    </Card>
  );
}

function QuestionRow({ courseId, lectureId, question }: { courseId: string; lectureId: string; question: Question }) {
  const [state, action] = useActionState(updateQuestionAction, initialSectionActionState);
  return (
    <div className="rounded-[1.75rem] border border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-5 shadow-[0_20px_45px_-30px_rgba(244,63,94,0.45)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge className="border-rose-200 bg-rose-100 text-rose-900">
            Saved question
          </Badge>
          <Badge
            className={
              question.is_resolved
                ? "border-emerald-200 bg-emerald-100 text-emerald-900"
                : "border-orange-200 bg-orange-100 text-orange-900"
            }
          >
            {question.is_resolved ? "Resolved" : "Unresolved"}
          </Badge>
        </div>
        <form action={deleteQuestionAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={question.id} />
          <SectionDeleteButton confirmMessage="Delete this question?" />
        </form>
      </div>

      <form action={action} className="space-y-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={question.id} />
          <input name="sortOrder" type="hidden" value={question.sort_order} />
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
                  Question
                </p>
                <Textarea defaultValue={question.content} name="content" rows={3} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-700">
                  Status
                </p>
                <select className="h-10 w-full rounded-xl border border-input bg-white px-3 text-[0.98rem] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" defaultValue={question.is_resolved ? "resolved" : "unresolved"} name="status">
                  <option value="unresolved">Unresolved</option>
                  <option value="resolved">Resolved</option>
                </select>
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
