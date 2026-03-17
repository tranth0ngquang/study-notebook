export type CourseFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<"name" | "code" | "semester" | "color" | "description", string[]>
  >;
};

export const initialCourseFormState: CourseFormState = {
  status: "idle",
};
