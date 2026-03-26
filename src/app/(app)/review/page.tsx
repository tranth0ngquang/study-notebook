import type { ReactNode } from "react";

import Link from "next/link";

import { AlertTriangle, ArrowRight, BrainCircuit, CircleHelp, ListTodo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/lib/courses/queries";
import {
  getLectureCompletionBadgeStyle,
  getLectureCompletionCardStyle,
} from "@/lib/lectures/completion-style";
import { getCourseReviewData } from "@/lib/review/queries";

type ReviewPageProps = {
  searchParams: Promise<{
    courseId?: string;
    lowUnderstanding?: string;
    unfinishedTasks?: string;
    unresolvedQuestions?: string;
  }>;
};

function createReviewHref(
  courseId: string,
  key: "lowUnderstanding" | "unfinishedTasks" | "unresolvedQuestions",
  enabled: boolean,
  current: { lowUnderstanding: boolean; unfinishedTasks: boolean; unresolvedQuestions: boolean },
) {
  const params = new URLSearchParams();
  params.set("courseId", courseId);

  const next = {
    lowUnderstanding: current.lowUnderstanding,
    unfinishedTasks: current.unfinishedTasks,
    unresolvedQuestions: current.unresolvedQuestions,
    [key]: !enabled,
  };

  if (next.lowUnderstanding) params.set("lowUnderstanding", "1");
  if (next.unfinishedTasks) params.set("unfinishedTasks", "1");
  if (next.unresolvedQuestions) params.set("unresolvedQuestions", "1");

  return `/review?${params.toString()}`;
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const params = await searchParams;
  const courses = await getCourses();
  const courseId = params.courseId ?? "";
  const filters = {
    lowUnderstanding: params.lowUnderstanding === "1",
    unfinishedTasks: params.unfinishedTasks === "1",
    unresolvedQuestions: params.unresolvedQuestions === "1",
  };

  const reviewData = courseId
    ? await getCourseReviewData(courseId, {
        lowUnderstandingOnly: filters.lowUnderstanding,
        unfinishedTasksOnly: filters.unfinishedTasks,
        unresolvedQuestionsOnly: filters.unresolvedQuestions,
      })
    : null;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <Badge className="w-fit" variant="secondary">
            Review
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              Course revision workspace
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Review a course lecture by lecture, spot weak understanding, and
              jump straight into the sessions that still have open questions or
              unfinished work.
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Select course</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1fr_auto]">
            <select
              className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={courseId}
              name="courseId"
            >
              <option value="">Choose a course to review</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              type="submit"
            >
              Open review
            </button>
          </form>
        </CardContent>
      </Card>

      {!courseId || !reviewData?.course ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
          Select a course to open the review view.
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-4">
            <MetricCard label="Lectures" value={String(reviewData.totals.lectures)} />
            <MetricCard label="Low understanding" value={String(reviewData.totals.lowUnderstanding)} />
            <MetricCard label="Unfinished tasks" value={String(reviewData.totals.unfinishedTasks)} />
            <MetricCard label="Unresolved questions" value={String(reviewData.totals.unresolvedQuestions)} />
          </div>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="space-y-3">
              <CardTitle>{reviewData.course.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <FilterLink
                  active={filters.lowUnderstanding}
                  href={createReviewHref(
                    courseId,
                    "lowUnderstanding",
                    filters.lowUnderstanding,
                    filters,
                  )}
                  label="Low understanding"
                />
                <FilterLink
                  active={filters.unfinishedTasks}
                  href={createReviewHref(
                    courseId,
                    "unfinishedTasks",
                    filters.unfinishedTasks,
                    filters,
                  )}
                  label="Has unfinished tasks"
                />
                <FilterLink
                  active={filters.unresolvedQuestions}
                  href={createReviewHref(
                    courseId,
                    "unresolvedQuestions",
                    filters.unresolvedQuestions,
                    filters,
                  )}
                  label="Has unresolved questions"
                />
              </div>
            </CardHeader>
          </Card>

          {reviewData.lectures.length > 0 ? (
            <div className="space-y-4">
              {reviewData.lectures.map((lecture) => (
                <Card
                  key={lecture.id}
                  className={
                    lecture.is_completed
                      ? "shadow-sm"
                      : "border-slate-200 bg-white shadow-sm"
                  }
                  style={
                    lecture.is_completed
                      ? getLectureCompletionCardStyle(reviewData.course?.color)
                      : undefined
                  }
                >
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {lecture.lecture_number ? (
                            <Badge variant="secondary">
                              Lecture {lecture.lecture_number}
                            </Badge>
                          ) : null}
                          {lecture.lecture_date ? (
                            <Badge variant="outline">
                              {new Date(lecture.lecture_date).toLocaleDateString()}
                            </Badge>
                          ) : null}
                          {lecture.is_completed ? (
                            <Badge
                              style={getLectureCompletionBadgeStyle(
                                reviewData.course?.color,
                              )}
                            >
                              Completed
                            </Badge>
                          ) : null}
                        </div>
                        <CardTitle className="text-2xl">{lecture.title}</CardTitle>
                      </div>
                      <Link
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        href={`/courses/${courseId}/lectures/${lecture.id}`}
                      >
                        Open lecture
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-slate-600">
                      {lecture.summary?.trim() || "No summary yet."}
                    </p>

                    <div className="grid gap-3 md:grid-cols-3">
                      <ReviewSignal
                        icon={<BrainCircuit className="size-4" />}
                        label="Understanding"
                        value={
                          lecture.understanding_score
                            ? `${lecture.understanding_score}/5`
                            : "Not scored"
                        }
                        tone={
                          lecture.understanding_score !== null &&
                          lecture.understanding_score <= 2
                            ? "warn"
                            : "default"
                        }
                      />
                      <ReviewSignal
                        icon={<CircleHelp className="size-4" />}
                        label="Unresolved questions"
                        value={String(lecture.unresolvedQuestionCount)}
                        tone={lecture.unresolvedQuestionCount > 0 ? "warn" : "default"}
                      />
                      <ReviewSignal
                        icon={<ListTodo className="size-4" />}
                        label="Unfinished tasks"
                        value={String(lecture.unfinishedTaskCount)}
                        tone={lecture.unfinishedTaskCount > 0 ? "warn" : "default"}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
              No lectures match the current review filters.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2">
        <p className="text-sm text-slate-500">{label}</p>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function FilterLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950"
      }`}
      href={href}
    >
      {active ? <AlertTriangle className="size-4" /> : null}
      {label}
    </Link>
  );
}

function ReviewSignal({
  icon,
  label,
  tone,
  value,
}: {
  icon: ReactNode;
  label: string;
  tone: "default" | "warn";
  value: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        tone === "warn"
          ? "border-amber-200 bg-amber-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
