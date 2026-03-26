import Link from "next/link";
import { notFound } from "next/navigation";

import { ConceptSection } from "@/components/lecture-sections/concept-section";
import { ExampleSection } from "@/components/lecture-sections/example-section";
import { ObjectiveSection } from "@/components/lecture-sections/objective-section";
import { QuestionSection } from "@/components/lecture-sections/question-section";
import { TimestampSection } from "@/components/lecture-sections/timestamp-section";
import { MaterialsSection } from "@/components/materials/materials-section";
import { TaskSection } from "@/components/tasks/task-section";
import { LectureCompletionToggle } from "@/components/lectures/lecture-completion-toggle";
import { DeleteLectureButton } from "@/components/lectures/delete-lecture-button";
import { LectureForm } from "@/components/lectures/lecture-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getLectureCompletionBadgeStyle,
  getLectureCompletionCardStyle,
} from "@/lib/lectures/completion-style";
import { getLectureSections } from "@/lib/lecture-sections/queries";
import { deleteLectureAction, updateLectureAction } from "@/lib/lectures/actions";
import { getLectureById } from "@/lib/lectures/queries";
import { getCourseById } from "@/lib/courses/queries";
import { getLectureMaterials } from "@/lib/materials/queries";
import { getLectureTasks } from "@/lib/tasks/queries";

type LectureWorkspacePageProps = {
  params: Promise<{ courseId: string; lectureId: string }>;
};

export default async function LectureWorkspacePage({
  params,
}: LectureWorkspacePageProps) {
  const { courseId, lectureId } = await params;
  const lecture = await getLectureById(courseId, lectureId);
  const course = await getCourseById(courseId);
  const sections = await getLectureSections(lectureId);
  const materials = await getLectureMaterials(lectureId);
  const tasks = await getLectureTasks(lectureId);

  if (!lecture) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card
        className={
          lecture.is_completed
            ? "shadow-sm"
            : "border-slate-200 bg-white shadow-sm"
        }
        style={lecture.is_completed ? getLectureCompletionCardStyle(course?.color) : undefined}
      >
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="w-fit">
                  Lecture workspace
                </Badge>
                {lecture.is_completed ? (
                  <Badge style={getLectureCompletionBadgeStyle(course?.color)}>
                    Completed
                  </Badge>
                ) : null}
              </div>
              <CardTitle className="text-3xl tracking-tight">
                {lecture.title}
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LectureCompletionToggle
                checked={lecture.is_completed}
                courseId={courseId}
                courseColor={course?.color}
                lectureId={lecture.id}
                variant="header"
              />
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                href={`/courses/${courseId}`}
              >
                Back to course
              </Link>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            This lecture shell is ready for later submodules. In this phase you
            can manage the lecture overview, summary, understanding score, and
            completion state.
          </p>
        </CardHeader>
      </Card>

      <Tabs className="space-y-6" defaultValue="overview">
        <TabsList className="h-auto flex-wrap justify-start rounded-2xl bg-white p-2 shadow-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes-structure">Notes structure</TabsTrigger>
          <TabsTrigger value="review-cues">Review cues</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Edit lecture</CardTitle>
              </CardHeader>
              <CardContent>
                <LectureForm
                  action={updateLectureAction}
                  courseId={courseId}
                  initialValues={lecture}
                  mode="edit"
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Danger zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-slate-600">
                  Deleting a lecture also removes its related structured note
                  items, tasks, timestamps, and materials because of cascade
                  rules.
                </p>
                <form action={deleteLectureAction}>
                  <input name="courseId" type="hidden" value={courseId} />
                  <input name="lectureId" type="hidden" value={lecture.id} />
                  <input name="redirectTo" type="hidden" value={`/courses/${courseId}`} />
                  <DeleteLectureButton
                    confirmMessage={`Delete "${lecture.title}"? This cannot be undone.`}
                  />
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes-structure">
          <div className="space-y-6">
            <ObjectiveSection
              courseId={courseId}
              lectureId={lectureId}
              objectives={sections.objectives}
            />
            <ConceptSection
              concepts={sections.concepts}
              courseId={courseId}
              lectureId={lectureId}
            />
            <ExampleSection
              courseId={courseId}
              examples={sections.examples}
              lectureId={lectureId}
            />
          </div>
        </TabsContent>

        <TabsContent value="review-cues">
          <div className="space-y-6">
            <TimestampSection
              courseId={courseId}
              lectureId={lectureId}
              timestamps={sections.timestamps}
            />
            <QuestionSection
              courseId={courseId}
              lectureId={lectureId}
              questions={sections.questions}
            />
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <MaterialsSection
            courseId={courseId}
            lectureId={lectureId}
            materials={materials}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskSection courseId={courseId} lectureId={lectureId} tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
