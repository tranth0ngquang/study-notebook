export type TaskFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<"title" | "description" | "type" | "status" | "dueDate", string[]>
  >;
};

export const initialTaskFormState: TaskFormState = {
  status: "idle",
};
