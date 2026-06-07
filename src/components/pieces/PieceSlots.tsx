"use client";

import { UploadSlot } from "@/components/ui/UploadSlot";
import { PIECE_SLOTS } from "@/types";
import type { Piece, PieceCategory } from "@/types";

interface PieceSlotsProps {
  pieces: Piece[];
  uploading: boolean;
  onUpload: (file: File, category: PieceCategory, slotKey: string) => void;
  onRemove: (pieceId: string) => void;
}

export function PieceSlots({
  pieces,
  uploading,
  onUpload,
  onRemove,
}: PieceSlotsProps) {
  const getPieceForSlot = (slotKey: string) => {
    console.log("[PieceSlots] Looking for slot:", slotKey, "Pieces:", pieces);
    return pieces.find((p) => p.slot_key === slotKey);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {PIECE_SLOTS.map((slot) => {
        const piece = getPieceForSlot(slot.key);
        console.log("[PieceSlots] Rendering slot:", slot.key, "Image URL:", piece?.image_url);
        return (
          <UploadSlot
            key={slot.key}
            label={slot.label}
            icon={slot.icon}
            image={piece?.image_url}
            uploading={uploading}
            onUpload={(file) => onUpload(file, slot.category, slot.key)}
            onRemove={piece ? () => onRemove(piece.id) : undefined}
          />
        );
      })}
    </div>
  );
}
