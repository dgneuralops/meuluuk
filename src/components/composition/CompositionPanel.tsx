"use client";

import type { Piece } from "@/types";
import { getCategoryLabel } from "@/lib/utils/validators";
import { FlatLayView } from "./FlatLayView";

interface CompositionPanelProps {
  pieces: Piece[];
  onSwap: (pieceId: string) => void;
}

export function CompositionPanel({ pieces, onSwap }: CompositionPanelProps) {
  if (pieces.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <span className="material-icons-outlined text-4xl mb-2 opacity-40">checkroom</span>
        <p>Nenhuma peça selecionada</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <FlatLayView pieces={pieces} onSwap={onSwap} />

      {/* Piece tags */}
      <div className="flex flex-wrap gap-2">
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className="text-xs bg-(--color-surface) border border-(--color-border) rounded-full px-3 py-1"
            style={{ color: "var(--color-muted)" }}
          >
            {getCategoryLabel(piece.category)}
          </span>
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: "var(--color-muted)", opacity: 0.6 }}>
        Toque em uma peça para trocar
      </p>
    </div>
  );
}
