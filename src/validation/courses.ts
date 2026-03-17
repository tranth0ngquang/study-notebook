import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length === 0 ? null : value))
    .nullable()
    .optional();

export const courseSchema = z.object({
  name: z.string().trim().min(1, "Course name is required.").max(160),
  code: optionalTrimmed(32),
  semester: optionalTrimmed(80),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, "Color must be a hex value.")
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional(),
  description: optionalTrimmed(2000),
  archived: z.boolean().default(false),
});

export type CourseInput = z.infer<typeof courseSchema>;
