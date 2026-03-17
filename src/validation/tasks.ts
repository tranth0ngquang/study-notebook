import { z } from "zod";

export const taskTypeSchema = z.enum(["assignment", "action"]);
export const taskStatusSchema = z.enum(["todo", "doing", "done"]);

export const taskSchema = z.object({
  courseId: z.uuid(),
  lectureId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(4000).nullish(),
  type: taskTypeSchema,
  status: taskStatusSchema.default("todo"),
  dueDate: z
    .string()
    .trim()
    .nullish()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Enter a valid due date.",
    }),
});

export type TaskInput = z.infer<typeof taskSchema>;
