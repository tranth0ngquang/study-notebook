export type AuthFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"displayName" | "email" | "password", string[]>>;
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
};
