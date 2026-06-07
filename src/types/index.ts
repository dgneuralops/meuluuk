export type PieceCategory =
  | "top"
  | "bottom"
  | "dress"
  | "shoes"
  | "bag"
  | "necklace"
  | "earrings"
  | "belt"
  | "other";

export type GenerationStatus = "pending" | "processing" | "completed" | "failed";
export type LookStatus = "draft" | "ready" | "generating" | "completed" | "failed" | "saved";

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Piece {
  id: string;
  user_id: string;
  category: PieceCategory;
  slot_key: string;
  image_url: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface BasePhoto {
  id: string;
  user_id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Look {
  id: string;
  user_id: string;
  status: LookStatus;
  created_at: string;
  updated_at: string;
}

export interface LookPiece {
  id: string;
  look_id: string;
  piece_id: string;
  slot_name: string;
  sort_order: number;
  piece?: Piece;
}

export interface Generation {
  id: string;
  look_id: string;
  base_photo_id: string;
  status: GenerationStatus;
  provider: string;
  prompt_used: string | null;
  payload: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Result {
  id: string;
  generation_id: string;
  image_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

export interface SavedLook {
  id: string;
  user_id: string;
  result_id: string;
  look_id: string | null;
  favorite: boolean;
  created_at: string;
  result?: Result;
  look?: Look;
  look_pieces?: LookPiece[];
}

export interface PieceSlotConfig {
  key: string;
  label: string;
  category: PieceCategory;
  icon: string;
}

export const PIECE_SLOTS: PieceSlotConfig[] = [
  { key: "top", label: "Peça superior", category: "top", icon: "checkroom" },
  { key: "bottom", label: "Peça inferior", category: "bottom", icon: "checkroom" },
  { key: "shoes", label: "Sapato", category: "shoes", icon: "shoe" },
  { key: "other_1", label: "Acessório 1", category: "other", icon: "diamond" },
  { key: "other_2", label: "Acessório 2", category: "other", icon: "diamond" },
  { key: "other_3", label: "Acessório 3", category: "other", icon: "diamond" },
];

export const ALL_CATEGORIES: { value: PieceCategory; label: string }[] = [
  { value: "top", label: "Blusa / Top" },
  { value: "bottom", label: "Calça / Saia" },
  { value: "dress", label: "Vestido" },
  { value: "shoes", label: "Sapato" },
  { value: "bag", label: "Bolsa" },
  { value: "necklace", label: "Colar" },
  { value: "earrings", label: "Brincos" },
  { value: "belt", label: "Cinto" },
  { value: "other", label: "Outro" },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
