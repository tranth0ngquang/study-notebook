export type SectionActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialSectionActionState: SectionActionState = {
  status: "idle",
};
