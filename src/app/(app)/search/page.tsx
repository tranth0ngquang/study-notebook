import Link from "next/link";

import { ArrowRight, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/lib/courses/queries";
import { searchCourseContent } from "@/lib/search/queries";

type SearchPageProps = {
  searchParams: Promise<{
    courseId?: string;
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const courses = await getCourses();
  const courseId = params.courseId ?? "";
  const query = params.q ?? "";
  const searchData = courseId ? await searchCourseContent(courseId, query) : null;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <Badge className="w-fit" variant="secondary">
            Search
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              Course search
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Search inside one course across lecture titles, topics, summaries,
              concepts, and questions. Results stay lecture-linked so you can
              jump straight into the right workspace.
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Search within a course</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 lg:grid-cols-[260px_1fr_auto]">
            <select
              className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={courseId}
              name="courseId"
            >
              <option value="">Choose course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input
              className="h-10 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={query}
              name="q"
              placeholder="Search concepts, questions, or lecture summaries"
              type="search"
            />
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              type="submit"
            >
              Search
            </button>
          </form>
        </CardContent>
      </Card>

      {!courseId ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
          Select a course before searching.
        </div>
      ) : !query.trim() ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
          Enter a search term to scan lecture notes and questions inside the selected course.
        </div>
      ) : !searchData?.course ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
          The selected course could not be found.
        </div>
      ) : (
        <>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle>{searchData.course.title}</CardTitle>
                <p className="text-sm text-slate-600">
                  {searchData.results.length} lecture
                  {searchData.results.length === 1 ? "" : "s"} matched
                  {" "}
                  &quot;{query.trim()}&quot;.
                </p>
              </div>
              <SearchIcon className="size-5 text-teal-700" />
            </CardHeader>
          </Card>

          {searchData.results.length > 0 ? (
            <div className="space-y-4">
              {searchData.results.map((result) => (
                <Card key={result.lecture.id} className="border-slate-200 bg-white shadow-sm">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {result.lecture.lecture_number ? (
                            <Badge variant="secondary">
                              Lecture {result.lecture.lecture_number}
                            </Badge>
                          ) : null}
                          {result.lecture.topic ? (
                            <Badge variant="outline">{result.lecture.topic}</Badge>
                          ) : null}
                        </div>
                        <CardTitle className="text-2xl">{result.lecture.title}</CardTitle>
                      </div>
                      <Link
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        href={`/courses/${courseId}/lectures/${result.lecture.id}`}
                      >
                        Open lecture
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.matches.map((match, index) => (
                      <div
                        key={`${result.lecture.id}-${match.field}-${index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-2">
                          <Badge variant="outline">{match.label}</Badge>
                        </div>
                        <p className="text-sm leading-6 text-slate-700">{match.snippet}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
              No lecture content matched &quot;{query.trim()}&quot; in this course.
            </div>
          )}
        </>
      )}
    </div>
  );
}
