export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          archived: boolean;
          code: string | null;
          color: string | null;
          created_at: string;
          description: string | null;
          id: string;
          instructor: string | null;
          term: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          archived?: boolean;
          code?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          instructor?: string | null;
          term?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      lecture_concepts: {
        Row: {
          content: string;
          created_at: string;
          definition: string | null;
          example: string | null;
          formula: string | null;
          id: string;
          lecture_id: string;
          sort_order: number;
          title: string | null;
          updated_at: string;
          usage_note: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          definition?: string | null;
          example?: string | null;
          formula?: string | null;
          id?: string;
          lecture_id: string;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
          usage_note?: string | null;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_concepts"]["Insert"]>;
        Relationships: [];
      };
      lecture_examples: {
        Row: {
          content: string;
          created_at: string;
          description: string | null;
          id: string;
          lecture_id: string;
          sort_order: number;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          lecture_id: string;
          sort_order?: number;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_examples"]["Insert"]>;
        Relationships: [];
      };
      lecture_materials: {
        Row: {
          course_id: string;
          created_at: string;
          file_name: string;
          file_size: number | null;
          id: string;
          lecture_id: string;
          mime_type: string | null;
          storage_path: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          file_name: string;
          file_size?: number | null;
          id?: string;
          lecture_id: string;
          mime_type?: string | null;
          storage_path: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_materials"]["Insert"]>;
        Relationships: [];
      };
      lecture_objectives: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          lecture_id: string;
          sort_order: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          lecture_id: string;
          sort_order?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_objectives"]["Insert"]>;
        Relationships: [];
      };
      lecture_questions: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          is_resolved: boolean;
          lecture_id: string;
          sort_order: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          is_resolved?: boolean;
          lecture_id: string;
          sort_order?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_questions"]["Insert"]>;
        Relationships: [];
      };
      lecture_relations: {
        Row: {
          created_at: string;
          id: string;
          note: string | null;
          relation_type: Database["public"]["Enums"]["lecture_relation_type"];
          source_lecture_id: string;
          target_lecture_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          note?: string | null;
          relation_type: Database["public"]["Enums"]["lecture_relation_type"];
          source_lecture_id: string;
          target_lecture_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_relations"]["Insert"]>;
        Relationships: [];
      };
      lecture_timestamps: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          lecture_id: string;
          note: string | null;
          sort_order: number;
          time_label: string | null;
          time_seconds: number;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
          lecture_id: string;
          note?: string | null;
          sort_order?: number;
          time_label?: string | null;
          time_seconds: number;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["lecture_timestamps"]["Insert"]>;
        Relationships: [];
      };
      lectures: {
        Row: {
          course_id: string;
          created_at: string;
          duration_minutes: number | null;
          id: string;
          lecture_date: string | null;
          lecture_number: number | null;
          lecturer: string | null;
          local_video_label: string | null;
          record_link: string | null;
          sort_order: number;
          slides_link: string | null;
          summary: string | null;
          topic: string | null;
          title: string;
          understanding_score: number | null;
          updated_at: string;
          user_id: string;
          video_path: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          duration_minutes?: number | null;
          id?: string;
          lecture_date?: string | null;
          lecture_number?: number | null;
          lecturer?: string | null;
          local_video_label?: string | null;
          record_link?: string | null;
          sort_order?: number;
          slides_link?: string | null;
          summary?: string | null;
          topic?: string | null;
          title: string;
          understanding_score?: number | null;
          updated_at?: string;
          user_id: string;
          video_path?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["lectures"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          email: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          completed_at: string | null;
          course_id: string;
          created_at: string;
          description: string | null;
          due_date: string | null;
          id: string;
          lecture_id: string | null;
          status: Database["public"]["Enums"]["task_status"];
          title: string;
          type: Database["public"]["Enums"]["task_type"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          course_id: string;
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          lecture_id?: string | null;
          status?: Database["public"]["Enums"]["task_status"];
          title: string;
          type: Database["public"]["Enums"]["task_type"];
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lecture_relation_type: "prerequisite" | "related" | "follow_up";
      task_status: "todo" | "doing" | "done";
      task_type: "assignment" | "action";
    };
    CompositeTypes: Record<string, never>;
  };
};
