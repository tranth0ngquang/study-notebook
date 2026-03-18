import { MaterialList } from "@/components/materials/material-list";
import { MaterialUploadForm } from "@/components/materials/material-upload-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LectureMaterial } from "@/types/domain";

type MaterialsSectionProps = {
  courseId: string;
  lectureId: string;
  materials: LectureMaterial[];
};

export function MaterialsSection({
  courseId,
  lectureId,
  materials,
}: MaterialsSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle>Upload materials</CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Files are stored in private Supabase Storage under the path
            `user_id/course_id/lecture_id/file_name`. Duplicate names are renamed
            safely within the lecture folder.
          </p>
        </CardHeader>
        <CardContent>
          <MaterialUploadForm courseId={courseId} lectureId={lectureId} />
        </CardContent>
      </Card>

      <MaterialList
        courseId={courseId}
        lectureId={lectureId}
        materials={materials}
      />
    </div>
  );
}
