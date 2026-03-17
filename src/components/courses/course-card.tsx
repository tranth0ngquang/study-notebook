import Link from "next/link";

import { ArrowRight, CalendarDays, PencilLine } from "lucide-react";

import { deleteCourseAction } from "@/lib/courses/actions";
import type { Course } from "@/types/domain";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { DeleteCourseButton } from "./delete-course-button";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div
              className="h-3 w-16 rounded-full"
              style={{ backgroundColor: course.color ?? "#0F766E" }}
            />
            <CardTitle className="text-xl text-slate-950">{course.title}</CardTitle>
          </div>
          {course.code ? <Badge variant="secondary">{course.code}</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
          {course.term ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              <CalendarDays className="size-3.5" />
              {course.term}
            </span>
          ) : null}
          {course.archived ? <Badge variant="outline">Archived</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="min-h-12 text-sm leading-6 text-slate-600">
          {course.description?.trim() || "No description yet."}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
            href={`/courses/${course.id}`}
          >
            <PencilLine className="size-4" />
            Edit
          </Link>
          <form action={deleteCourseAction}>
            <input name="courseId" type="hidden" value={course.id} />
            <input name="redirectTo" type="hidden" value="/courses" />
            <DeleteCourseButton
              confirmMessage={`Delete "${course.title}"? This will also remove related lectures, tasks, and materials.`}
            />
          </form>
        </div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          href={`/courses/${course.id}`}
        >
          Open workspace
          <ArrowRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
