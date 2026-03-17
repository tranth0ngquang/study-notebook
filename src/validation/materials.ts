import { z } from "zod";

export const lectureMaterialSchema = z.object({
  courseId: z.uuid(),
  lectureId: z.uuid(),
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().max(255).nullish(),
  fileSize: z.number().int().nonnegative().max(1024 * 1024 * 100).nullish(),
});

export type LectureMaterialInput = z.infer<typeof lectureMaterialSchema>;
