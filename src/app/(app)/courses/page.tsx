import { CourseCard } from "@/components/courses/course-card";
import { CourseForm } from "@/components/courses/course-form";
import { EmptyCoursesState } from "@/components/courses/empty-courses-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCourseAction } from "@/lib/courses/actions";
import { getCourses } from "@/lib/courses/queries";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <Badge variant="secondary" className="w-fit">
            Courses
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              Build and manage your course workspace
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Create, edit, and delete courses. All course records are scoped to
              the authenticated user and backed by Supabase RLS.
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Create course</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm action={createCourseAction} mode="create" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {courses.length > 0 ? (
            courses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <EmptyCoursesState
              description="Create your first course to start organizing lectures, tasks, and review later."
              title="No courses created yet"
            />
          )}
        </div>
      </div>
    </div>
  );
}
