"use client";

import type { SavedLook } from "@/types";
import { getCategoryLabel } from "@/lib/utils/validators";

interface LookCardProps {
  look: SavedLook;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function LookCard({ look, onDelete, onToggleFavorite }: LookCardProps) {
  const imageUrl = look.result?.image_url;
  const lookData: any = look.look;
  const pieces = lookData?.look_pieces || [];

  return (
    <div className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="aspect-[3/4]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Look salvo"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <span className="material-icons-outlined text-4xl text-border">
              image
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {pieces.slice(0, 3).map((lp: any) => (
              <span
                key={lp.id}
                className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full backdrop-blur-sm font-medium"
              >
                {getCategoryLabel(lp.piece?.category || "other")}
              </span>
            ))}
            {pieces.length > 3 && (
              <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] rounded-full backdrop-blur-sm font-medium">
                +{pieces.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          type="button"
          onClick={() => onToggleFavorite(look.id)}
          className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
        >
          <span className="material-icons-outlined text-base">
            {look.favorite ? "favorite" : "favorite_border"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(look.id)}
          className="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors backdrop-blur-sm"
        >
          <span className="material-icons-outlined text-base">delete</span>
        </button>
      </div>

      {look.favorite && (
        <div className="absolute top-2 left-2">
          <span className="material-icons-outlined text-base text-primary drop-shadow-lg">
            favorite
          </span>
        </div>
      )}
    </div>
  );
}
