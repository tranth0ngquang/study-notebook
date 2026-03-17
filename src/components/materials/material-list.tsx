import Link from "next/link";

import { Download, ExternalLink, FileText } from "lucide-react";

import { deleteLectureMaterialAction } from "@/lib/materials/actions";
import type { LectureMaterial } from "@/types/domain";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DeleteMaterialButton } from "./delete-material-button";

type MaterialListProps = {
  courseId: string;
  lectureId: string;
  materials: LectureMaterial[];
};

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatType(mimeType: string | null) {
  if (!mimeType) return "Unknown type";
  const [, subtype] = mimeType.split("/");
  return subtype ? subtype.toUpperCase() : mimeType;
}

export function MaterialList({
  courseId,
  lectureId,
  materials,
}: MaterialListProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Uploaded materials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {materials.length > 0 ? (
          materials.map((material) => (
            <div
              key={material.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <FileText className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-950">{material.file_name}</p>
                      <p className="text-sm text-slate-500">
                        Uploaded {new Date(material.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{formatType(material.mime_type)}</Badge>
                    <Badge variant="secondary">{formatBytes(material.file_size)}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/api/materials/${material.id}/open`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" />
                    Open
                  </Link>
                  <Link
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/api/materials/${material.id}/download`}
                  >
                    <Download className="size-4" />
                    Download
                  </Link>
                  <form action={deleteLectureMaterialAction}>
                    <input name="courseId" type="hidden" value={courseId} />
                    <input name="lectureId" type="hidden" value={lectureId} />
                    <input name="materialId" type="hidden" value={material.id} />
                    <input
                      name="redirectTo"
                      type="hidden"
                      value={`/courses/${courseId}/lectures/${lectureId}`}
                    />
                    <DeleteMaterialButton
                      confirmMessage={`Delete "${material.file_name}" from storage and metadata?`}
                    />
                  </form>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            No materials uploaded yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
