import Link from "next/link";

import { CalendarDays, Clock3, PlaySquare, UserRound } from "lucide-react";

import { LectureCompletionToggle } from "@/components/lectures/lecture-completion-toggle";
import {
  getLectureCompletionBadgeStyle,
  getLectureCompletionCardStyle,
} from "@/lib/lectures/completion-style";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllLecturesWithCourse } from "@/lib/lectures/overview";

export default async function LecturesPage() {
  const lectures = await getAllLecturesWithCourse();

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-3">
          <Badge className="w-fit" variant="secondary">
            Lectures
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              Lecture overview
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Browse lecture workspaces across all courses and jump directly
              into the one you want to review or edit.
            </p>
          </div>
        </CardHeader>
      </Card>

      {lectures.length > 0 ? (
        <div className="space-y-4">
          {lectures.map((lecture) => (
            <Card
              key={lecture.id}
              className={
                lecture.is_completed
                  ? "shadow-sm"
                  : "border-slate-200 bg-white shadow-sm"
              }
              style={lecture.is_completed ? getLectureCompletionCardStyle(lecture.course?.color) : undefined}
            >
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {lecture.course ? (
                        <Badge variant="outline">{lecture.course.title}</Badge>
                      ) : null}
                      {lecture.lecture_number ? (
                        <Badge variant="secondary">
                          Lecture {lecture.lecture_number}
                        </Badge>
                      ) : null}
                      {lecture.is_completed ? (
                        <Badge style={getLectureCompletionBadgeStyle(lecture.course?.color)}>
                          Completed
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-2xl">{lecture.title}</CardTitle>
                  </div>
                  <Link
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/courses/${lecture.course_id}/lectures/${lecture.id}`}
                  >
                    Open lecture
                    <PlaySquare className="size-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
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
                <p className="text-sm leading-6 text-slate-600">
                  {lecture.summary?.trim() || "No summary yet."}
                </p>
                <div className="pt-1">
                  <LectureCompletionToggle
                    checked={lecture.is_completed}
                    courseId={lecture.course_id}
                    courseColor={lecture.course?.color}
                    lectureId={lecture.id}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
          No lectures yet. Create a course and add lectures to start building
          the review workspace.
        </div>
      )}
    </div>
  );
}
