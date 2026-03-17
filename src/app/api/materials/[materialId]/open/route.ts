import { NextRequest, NextResponse } from "next/server";

import { createMaterialSignedUrl } from "@/lib/materials/storage";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<unknown> },
) {
  const { materialId } = (await context.params) as { materialId: string };
  const result = await createMaterialSignedUrl(materialId);

  if (!result) {
    return NextResponse.json({ error: "Material not found." }, { status: 404 });
  }

  return NextResponse.redirect(result.signedUrl);
}
