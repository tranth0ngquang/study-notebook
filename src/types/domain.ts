import type { Database } from "@/types/database";

export type TaskType = Database["public"]["Enums"]["task_type"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type LectureRelationType =
  Database["public"]["Enums"]["lecture_relation_type"];

export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Lecture = Database["public"]["Tables"]["lectures"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type LectureMaterial =
  Database["public"]["Tables"]["lecture_materials"]["Row"];
