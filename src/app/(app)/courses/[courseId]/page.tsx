import Link from "next/link";

import { notFound } from "next/navigation";

import { EmptyLecturesState } from "@/components/lectures/empty-lectures-state";
import { LectureCard } from "@/components/lectures/lecture-card";
import { LectureForm } from "@/components/lectures/lecture-form";
import { CourseForm } from "@/components/courses/course-form";
import { DeleteCourseButton } from "@/components/courses/delete-course-button";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCourseAction, updateCourseAction } from "@/lib/courses/actions";
import { createLectureAction } from "@/lib/lectures/actions";
import { getCourseWithLectures } from "@/lib/lectures/queries";
import { getCourseUpcomingTasks } from "@/lib/tasks/queries";
import { formatTaskDate, formatTaskTypeLabel } from "@/lib/tasks/utils";

type CourseDetailPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params;
  const { course, lectures } = await getCourseWithLectures(courseId);
  const upcomingTasks = await getCourseUpcomingTasks(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <Badge variant="secondary" className="w-fit">
            Course details
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">{course.title}</CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Manage the course and its lectures from one place. This page is
              the main entry point into each lecture workspace.
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Create lecture</CardTitle>
            </CardHeader>
            <CardContent>
              <LectureForm
                action={createLectureAction}
                courseId={course.id}
                mode="create"
              />
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle>Lecture list</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                Open any lecture to edit its overview and prepare the later
                section modules.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {lectures.length > 0 ? (
                lectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    courseColor={course.color}
                    courseId={course.id}
                    lecture={lecture}
                  />
                ))
              ) : (
                <EmptyLecturesState
                  description="Create the first lecture for this course to start building the study workspace."
                  title="No lectures yet"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Edit course</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm
              action={updateCourseAction}
              initialValues={course}
              mode="edit"
            />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle>Upcoming tasks</CardTitle>
            <p className="text-sm leading-6 text-slate-600">
              Open a lecture to create assignments and action items. This card
              highlights the next unfinished work in the course.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {formatTaskTypeLabel(task.type)}
                        </Badge>
                        <TaskStatusBadge
                          dueDate={task.due_date}
                          status={task.status}
                        />
                      </div>
                      <p className="font-medium text-slate-950">{task.title}</p>
                      <p className="text-sm text-slate-500">
                        {task.description?.trim() || "No description yet."}
                      </p>
                    </div>
                    {task.lecture_id ? (
                      <Link
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        href={`/courses/${course.id}/lectures/${task.lecture_id}`}
                      >
                        Open lecture
                      </Link>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Due {formatTaskDate(task.due_date)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                No unfinished tasks yet for this course.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Danger zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">
              Deleting a course also removes its related lectures, materials,
              timestamps, questions, and tasks because of database cascade rules.
            </p>
            <form action={deleteCourseAction}>
              <input name="courseId" type="hidden" value={course.id} />
              <input name="redirectTo" type="hidden" value="/courses" />
              <DeleteCourseButton
                confirmMessage={`Delete "${course.title}"? This cannot be undone.`}
              />
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
