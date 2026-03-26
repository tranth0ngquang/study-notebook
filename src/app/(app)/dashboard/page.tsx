import Link from "next/link";

import { ArrowRight, BookOpenText, Clock3, ListTodo, PlaySquare } from "lucide-react";

import { getLectureCompletionBadgeStyle, getLectureCompletionCardStyle } from "@/lib/lectures/completion-style";
import { EmptyCoursesState } from "@/components/courses/empty-courses-state";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/courses/queries";
import { formatTaskDate, formatTaskTypeLabel } from "@/lib/tasks/utils";
import { dashboardOverviewCards } from "@/lib/navigation";

export default async function DashboardPage() {
  const { recentCourses, recentLectures, upcomingTasks } = await getDashboardData();

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <Badge variant="secondary" className="w-fit">
            Dashboard
          </Badge>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight">
                Your study workspace at a glance
              </CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Track recent courses, recently touched lectures, and the next tasks
                that need attention. This stays intentionally lightweight for the MVP.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                href="/courses"
              >
                Manage courses
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                href="/tasks"
              >
                View tasks
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {dashboardOverviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title} className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-slate-600">
                {card.description}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {recentCourses.length === 0 ? (
        <EmptyCoursesState
          actionHref="/courses"
          actionLabel="Create your first course"
          description="Once you add courses, the dashboard will surface the most recent ones here."
          title="No courses yet"
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl">Recent courses</CardTitle>
                <p className="text-sm text-slate-600">
                  Most recently updated courses.
                </p>
              </div>
              <BookOpenText className="size-5 text-teal-700" />
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  href={`/courses/${course.id}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: course.color ?? "#0F766E" }}
                      />
                      <span className="font-medium text-slate-950">{course.title}</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {course.term ?? "No semester set"}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-slate-400" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl">Recent lectures</CardTitle>
                <p className="text-sm text-slate-600">
                  Visible when lecture data exists.
                </p>
              </div>
              <PlaySquare className="size-5 text-teal-700" />
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLectures.length > 0 ? (
                recentLectures.map((lecture) => (
                  <Link
                    key={lecture.id}
                    className={`block rounded-2xl border p-4 transition-colors ${
                      lecture.is_completed
                        ? ""
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                    style={lecture.is_completed ? getLectureCompletionCardStyle(lecture.course?.color) : undefined}
                    href={`/courses/${lecture.course_id}/lectures/${lecture.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-slate-950">{lecture.title}</p>
                      {lecture.is_completed ? (
                        <Badge style={getLectureCompletionBadgeStyle(lecture.course?.color)}>
                          Done
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {lecture.summary?.trim() || "No summary yet."}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No lectures yet. They will appear here once you start adding lecture workspaces.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-xl">Upcoming tasks</CardTitle>
                <p className="text-sm text-slate-600">
                  Upcoming assignments and action items.
                </p>
              </div>
              <ListTodo className="size-5 text-teal-700" />
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <Link
                    key={task.id}
                    className="block rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                    href={
                      task.lecture_id
                        ? `/courses/${task.course_id}/lectures/${task.lecture_id}`
                        : "/tasks"
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-slate-950">{task.title}</p>
                      <Badge variant="outline">{formatTaskTypeLabel(task.type)}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <TaskStatusBadge dueDate={task.due_date} status={task.status} />
                    </div>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="size-4" />
                      {formatTaskDate(task.due_date)}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No pending tasks yet. Create them inside lectures when follow-up work appears.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
