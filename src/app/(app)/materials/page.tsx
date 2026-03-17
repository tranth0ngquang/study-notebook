import Link from "next/link";

import { Download, ExternalLink, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllMaterialsWithContext } from "@/lib/materials/queries";

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

export default async function MaterialsPage() {
  const materials = await getAllMaterialsWithContext();

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-3">
          <Badge className="w-fit" variant="secondary">
            Materials
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl tracking-tight">
              Lecture materials
            </CardTitle>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              View all uploaded lecture materials across the workspace and jump
              back to the lecture that owns each file.
            </p>
          </div>
        </CardHeader>
      </Card>

      {materials.length > 0 ? (
        <div className="space-y-4">
          {materials.map((material) => (
            <Card key={material.id} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-start lg:justify-between">
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
                    {material.course ? (
                      <Badge variant="outline">{material.course.title}</Badge>
                    ) : null}
                    {material.lecture ? (
                      <Badge variant="secondary">
                        {material.lecture.lecture_number
                          ? `Lecture ${material.lecture.lecture_number}`
                          : material.lecture.title}
                      </Badge>
                    ) : null}
                    <Badge variant="outline">{formatType(material.mime_type)}</Badge>
                    <Badge variant="secondary">{formatBytes(material.file_size)}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/courses/${material.course_id}/lectures/${material.lecture_id}`}
                  >
                    Open lecture
                  </Link>
                  <Link
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/api/materials/${material.id}/open`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" />
                    Open file
                  </Link>
                  <Link
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                    href={`/api/materials/${material.id}/download`}
                  >
                    <Download className="size-4" />
                    Download
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
          No materials uploaded yet. Add files inside lecture workspaces to see
          them here.
        </div>
      )}
    </div>
  );
}
