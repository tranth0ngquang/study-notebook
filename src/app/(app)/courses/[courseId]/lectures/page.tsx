import { redirect } from "next/navigation";

type CourseLecturesPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseLecturesPage({
  params,
}: CourseLecturesPageProps) {
  const { courseId } = await params;

  redirect(`/courses/${courseId}`);
}
