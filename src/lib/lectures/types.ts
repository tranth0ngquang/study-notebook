export type LectureFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<
    Record<
      | "title"
      | "topic"
      | "lectureNumber"
      | "lectureDate"
      | "lecturer"
      | "durationMinutes"
      | "localVideoLabel"
      | "recordLink"
      | "slidesLink"
      | "summary"
      | "understandingScore",
      string[]
    >
  >;
};

export const initialLectureFormState: LectureFormState = {
  status: "idle",
};
