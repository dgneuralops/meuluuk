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
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
      };
      pieces: {
        Row: {
          id: string;
          user_id: string;
          category: "top" | "bottom" | "dress" | "shoes" | "bag" | "necklace" | "earrings" | "belt" | "other";
          image_url: string;
          mime_type: string;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: "top" | "bottom" | "dress" | "shoes" | "bag" | "necklace" | "earrings" | "belt" | "other";
          image_url: string;
          mime_type: string;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: "top" | "bottom" | "dress" | "shoes" | "bag" | "necklace" | "earrings" | "belt" | "other";
          image_url?: string;
          mime_type?: string;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
      };
      base_photos: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
      };
      looks: {
        Row: {
          id: string;
          user_id: string;
          status: "draft" | "ready" | "generating" | "completed" | "failed" | "saved";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "draft" | "ready" | "generating" | "completed" | "failed" | "saved";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "draft" | "ready" | "generating" | "completed" | "failed" | "saved";
          created_at?: string;
          updated_at?: string;
        };
      };
      look_pieces: {
        Row: {
          id: string;
          look_id: string;
          piece_id: string;
          slot_name: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          look_id: string;
          piece_id: string;
          slot_name: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          look_id?: string;
          piece_id?: string;
          slot_name?: string;
          sort_order?: number;
        };
      };
      generations: {
        Row: {
          id: string;
          look_id: string;
          base_photo_id: string;
          status: "pending" | "processing" | "completed" | "failed";
          provider: string;
          prompt_used: string | null;
          payload: Json | null;
          error_message: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          look_id: string;
          base_photo_id: string;
          status?: "pending" | "processing" | "completed" | "failed";
          provider?: string;
          prompt_used?: string | null;
          payload?: Json | null;
          error_message?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          look_id?: string;
          base_photo_id?: string;
          status?: "pending" | "processing" | "completed" | "failed";
          provider?: string;
          prompt_used?: string | null;
          payload?: Json | null;
          error_message?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      results: {
        Row: {
          id: string;
          generation_id: string;
          image_url: string;
          thumbnail_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          generation_id: string;
          image_url: string;
          thumbnail_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          generation_id?: string;
          image_url?: string;
          thumbnail_url?: string | null;
          created_at?: string;
        };
      };
      saved_looks: {
        Row: {
          id: string;
          user_id: string;
          result_id: string;
          look_id: string | null;
          favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          result_id: string;
          look_id?: string | null;
          favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          result_id?: string;
          look_id?: string | null;
          favorite?: boolean;
          created_at?: string;
        };
      };
      user_credits: {
        Row: {
          id: string;
          user_id: string;
          total_generations: number;
          credits_remaining: number;
          max_credits: number;
          reset_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_generations?: number;
          credits_remaining?: number;
          max_credits?: number;
          reset_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_generations?: number;
          credits_remaining?: number;
          max_credits?: number;
          reset_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_usage: {
        Row: {
          id: string;
          user_id: string;
          generation_id: string | null;
          credits_spent: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          generation_id?: string | null;
          credits_spent?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          generation_id?: string | null;
          credits_spent?: number;
          created_at?: string;
        };
      };
    };
  };
};
