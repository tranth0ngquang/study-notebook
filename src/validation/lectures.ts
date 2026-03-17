import { z } from "zod";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length === 0 ? null : value))
    .nullable()
    .optional();

const optionalInteger = (
  min: number,
  max: number,
  minMessage: string,
  maxMessage: string,
  wholeMessage: string,
) =>
  z
    .union([z.string(), z.number(), z.null(), z.undefined()])
    .transform((value) => {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      const numericValue =
        typeof value === "number" ? value : Number.parseInt(value, 10);

      return Number.isNaN(numericValue) ? Number.NaN : numericValue;
    })
    .refine((value) => value === null || Number.isInteger(value), wholeMessage)
    .refine((value) => value === null || value >= min, minMessage)
    .refine((value) => value === null || value <= max, maxMessage);

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL.")
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

export const lectureSchema = z.object({
  courseId: z.uuid(),
  title: z.string().trim().min(1, "Lecture title is required.").max(160),
  topic: optionalTrimmed(160),
  lectureNumber: optionalInteger(
    1,
    9999,
    "Lecture number must be at least 1.",
    "Lecture number looks too large.",
    "Lecture number must be a whole number.",
  ),
  lectureDate: z.iso.date().nullable().optional(),
  lecturer: optionalTrimmed(120),
  durationMinutes: optionalInteger(
    0,
    1440,
    "Duration cannot be negative.",
    "Duration looks too large.",
    "Duration must be a whole number.",
  ),
  localVideoLabel: optionalTrimmed(200),
  recordLink: optionalUrl,
  slidesLink: optionalUrl,
  summary: optionalTrimmed(5000),
  understandingScore: optionalInteger(
    1,
    5,
    "Understanding score must be between 1 and 5.",
    "Understanding score must be between 1 and 5.",
    "Understanding score must be a whole number.",
  ),
});

export const lectureListItemSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const lectureConceptSchema = z.object({
  title: optionalTrimmed(160),
  definition: optionalTrimmed(3000),
  formula: optionalTrimmed(1000),
  example: optionalTrimmed(2000),
  usageNote: optionalTrimmed(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
}).refine(
  (value) =>
    Boolean(
      value.title ||
        value.definition ||
        value.formula ||
        value.example ||
        value.usageNote,
    ),
  {
    message: "Add at least one concept field.",
    path: ["title"],
  },
);

export const lectureExampleSchema = z.object({
  title: optionalTrimmed(160),
  description: optionalTrimmed(3000),
  sortOrder: z.coerce.number().int().min(0).default(0),
}).refine((value) => Boolean(value.title || value.description), {
  message: "Add an example title or description.",
  path: ["title"],
});

export const lectureTimestampSchema = z.object({
  timeLabel: optionalTrimmed(32),
  timeSeconds: z.coerce.number().int().min(0, "Seconds must be 0 or greater."),
  title: optionalTrimmed(160),
  note: optionalTrimmed(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const lectureQuestionSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  status: z.enum(["unresolved", "resolved"]).default("unresolved"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type LectureInput = z.infer<typeof lectureSchema>;
