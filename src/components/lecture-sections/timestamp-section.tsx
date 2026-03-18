"use client";

import { useActionState } from "react";

import {
  createTimestampAction,
  deleteTimestampAction,
  updateTimestampAction,
} from "@/lib/lecture-sections/actions";
import { initialSectionActionState } from "@/lib/lecture-sections/types";
import type { Database } from "@/types/database";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SectionDeleteButton } from "./section-delete-button";
import { SectionSubmitButton } from "./section-submit-button";

type Timestamp = Database["public"]["Tables"]["lecture_timestamps"]["Row"];

function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function TimestampSection({ courseId, lectureId, timestamps }: { courseId: string; lectureId: string; timestamps: Timestamp[] }) {
  const [createState, createAction] = useActionState(createTimestampAction, initialSectionActionState);
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle>Timestamps</CardTitle>
        <p className="text-sm leading-6 text-slate-600">
          These timestamps are for local video review only. This app does not host or play lecture video files.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={createAction} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="sortOrder" type="hidden" value="0" />
          <div className="grid gap-3 md:grid-cols-2">
            <Input name="timeLabel" placeholder="01:32" />
            <Input min={0} name="timeSeconds" placeholder="92" type="number" />
            <Input className="md:col-span-2" name="title" placeholder="Key explanation starts" />
            <Textarea className="md:col-span-2" name="note" placeholder="Why this point matters during review" rows={3} />
          </div>
          <div className="mt-3 flex justify-end">
            <SectionSubmitButton idleLabel="Add timestamp" pendingLabel="Saving..." />
          </div>
          {createState.message ? <p className={`mt-3 text-sm ${createState.status === "error" ? "text-destructive" : "text-teal-700"}`}>{createState.message}</p> : null}
        </form>
        {timestamps.length > 0 ? timestamps.map((timestamp) => <TimestampRow key={timestamp.id} courseId={courseId} lectureId={lectureId} timestamp={timestamp} />) : <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No timestamps yet.</p>}
      </CardContent>
    </Card>
  );
}

function TimestampRow({ courseId, lectureId, timestamp }: { courseId: string; lectureId: string; timestamp: Timestamp }) {
  const [state, action] = useActionState(updateTimestampAction, initialSectionActionState);
  return (
    <div className="rounded-[1.75rem] border border-cyan-200/80 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 shadow-[0_20px_45px_-30px_rgba(6,182,212,0.65)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-cyan-200 bg-cyan-100 text-cyan-950">
            Saved timestamp
          </Badge>
          <div className="inline-flex rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-sm font-semibold text-blue-700">
            {formatSeconds(timestamp.time_seconds)}
          </div>
        </div>
        <form action={deleteTimestampAction}>
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={timestamp.id} />
          <SectionDeleteButton confirmMessage="Delete this timestamp?" />
        </form>
      </div>
      <form action={action} className="space-y-4">
          <input name="courseId" type="hidden" value={courseId} />
          <input name="lectureId" type="hidden" value={lectureId} />
          <input name="itemId" type="hidden" value={timestamp.id} />
          <input name="sortOrder" type="hidden" value={timestamp.sort_order} />
          <div className="rounded-2xl border border-white/80 bg-white/85 p-4 backdrop-blur-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Time label
                </p>
                <Input defaultValue={timestamp.time_label ?? ""} name="timeLabel" placeholder="01:32" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Seconds
                </p>
                <Input defaultValue={timestamp.time_seconds} min={0} name="timeSeconds" type="number" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                  Title
                </p>
                <Input className="md:col-span-2" defaultValue={timestamp.title ?? ""} name="title" placeholder="Title" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                  Note
                </p>
                <Textarea className="md:col-span-2" defaultValue={timestamp.note ?? ""} name="note" rows={3} />
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
