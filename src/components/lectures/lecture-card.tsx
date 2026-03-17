import Link from "next/link";

import { ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";

import type { Lecture } from "@/types/domain";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type LectureCardProps = {
  courseId: string;
  lecture: Lecture;
};

export function LectureCard({ courseId, lecture }: LectureCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {lecture.lecture_number ? (
                <Badge variant="secondary">Lecture {lecture.lecture_number}</Badge>
              ) : null}
              {lecture.topic ? <Badge variant="outline">{lecture.topic}</Badge> : null}
            </div>
            <CardTitle className="text-xl">{lecture.title}</CardTitle>
          </div>
          {lecture.understanding_score ? (
            <Badge variant="secondary">
              Understanding {lecture.understanding_score}/5
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <div className="flex flex-wrap gap-4">
          {lecture.lecture_date ? (
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" />
              {new Date(lecture.lecture_date).toLocaleDateString()}
            </span>
          ) : null}
          {lecture.duration_minutes ? (
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4" />
              {lecture.duration_minutes} min
            </span>
          ) : null}
          {lecture.lecturer ? (
            <span className="inline-flex items-center gap-2">
              <UserRound className="size-4" />
              {lecture.lecturer}
            </span>
          ) : null}
        </div>
        <p className="min-h-12 leading-6">
          {lecture.summary?.trim() || "No summary yet."}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-slate-500">
          {lecture.local_video_label?.trim() || "No local video label"}
        </span>
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          href={`/courses/${courseId}/lectures/${lecture.id}`}
        >
          Open lecture
          <ArrowRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
