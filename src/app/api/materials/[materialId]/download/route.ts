import { NextRequest } from "next/server";

import { downloadMaterialFile } from "@/lib/materials/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<unknown> },
) {
  const { materialId } = (await context.params) as { materialId: string };
  const result = await downloadMaterialFile(materialId);

  if (!result) {
    return new Response("Material not found.", { status: 404 });
  }

  return new Response(result.blob, {
    headers: {
      "Content-Type": result.material.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(result.material.file_name)}"`,
    },
  });
}
