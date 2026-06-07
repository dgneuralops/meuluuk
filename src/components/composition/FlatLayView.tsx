"use client";

import type { Piece } from "@/types";
import { getCategoryLabel } from "@/lib/utils/validators";

interface FlatLayViewProps {
  pieces: Piece[];
  onSwap?: (pieceId: string) => void;
  className?: string;
}

// Absolute positions (as % of container) for each garment category
const CATEGORY_POSITIONS: Record<string, React.CSSProperties> = {
  top: {
    top: "7%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "44%",
    zIndex: 2,
  },
  dress: {
    top: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "54%",
    zIndex: 2,
  },
  bottom: {
    top: "48%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "40%",
    zIndex: 1,
  },
  shoes: {
    bottom: "4%",
    left: "5%",
    width: "30%",
    zIndex: 3,
  },
  bag: {
    top: "40%",
    right: "4%",
    width: "27%",
    zIndex: 3,
  },
  necklace: {
    top: "4%",
    right: "5%",
    width: "15%",
    zIndex: 4,
  },
  earrings: {
    top: "4%",
    left: "5%",
    width: "13%",
    zIndex: 4,
  },
  belt: {
    top: "47%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "25%",
    zIndex: 5,
  },
};

// Fallback positions for "other" or unrecognized categories
const FALLBACK_POSITIONS: React.CSSProperties[] = [
  { top: "4%", right: "5%", width: "16%", zIndex: 4 },
  { top: "4%", left: "5%", width: "14%", zIndex: 4 },
  { bottom: "4%", right: "5%", width: "24%", zIndex: 3 },
  { top: "40%", left: "4%", width: "22%", zIndex: 3 },
];

// When two pieces share the same category, offset the second one slightly
const DUPLICATE_OFFSETS: React.CSSProperties[] = [
  { marginTop: "0", marginLeft: "0" },
  { transform: "translate(calc(-50% + 12px), 8px)", opacity: 0.92 },
  { transform: "translate(calc(-50% - 12px), -8px)", opacity: 0.85 },
];

export function FlatLayView({ pieces, onSwap, className = "" }: FlatLayViewProps) {
  if (pieces.length === 0) return null;

  // Track how many times each category has appeared to handle duplicates
  const categoryCounts: Record<string, number> = {};
  const fallbackPieces = pieces.filter((p) => !CATEGORY_POSITIONS[p.category]);
  let fallbackIdx = 0;

  const positionedPieces = pieces.map((piece) => {
    const known = CATEGORY_POSITIONS[piece.category];
    if (known) {
      const count = categoryCounts[piece.category] ?? 0;
      categoryCounts[piece.category] = count + 1;
      const base = { ...known };
      if (count > 0) {
        // Merge offset for duplicate category
        const offset = DUPLICATE_OFFSETS[count] ?? DUPLICATE_OFFSETS[DUPLICATE_OFFSETS.length - 1];
        Object.assign(base, offset);
      }
      return { piece, style: base };
    } else {
      const pos = FALLBACK_POSITIONS[fallbackIdx % FALLBACK_POSITIONS.length];
      fallbackIdx++;
      return { piece, style: { ...pos } };
    }
  });

  const isInteractive = !!onSwap;

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden ${className}`}
      style={{
        aspectRatio: "4 / 5",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {positionedPieces.map(({ piece, style }) => (
        <div
          key={piece.id}
          className={`absolute ${isInteractive ? "group cursor-pointer" : ""}`}
          style={style}
          onClick={isInteractive ? () => onSwap!(piece.id) : undefined}
          title={isInteractive ? `Trocar: ${getCategoryLabel(piece.category)}` : getCategoryLabel(piece.category)}
        >
          <img
            src={piece.image_url}
            alt={getCategoryLabel(piece.category)}
            className={`w-full h-auto object-contain transition-all duration-300 ${isInteractive ? "group-hover:scale-105" : ""}`}
            style={{
              mixBlendMode: "multiply",
              filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.15))",
            }}
          />
          {isInteractive && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:text-white">
              <span className="material-icons-outlined" style={{ fontSize: "11px" }}>swap_horiz</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
