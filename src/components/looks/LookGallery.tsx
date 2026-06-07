"use client";

import type { SavedLook } from "@/types";
import { LookCard } from "./LookCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface LookGalleryProps {
  looks: SavedLook[];
  loading: boolean;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function LookGallery({
  looks,
  loading,
  onDelete,
  onToggleFavorite,
}: LookGalleryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-xl bg-surface animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (looks.length === 0) {
    return (
      <EmptyState
        icon="favorite_border"
        title="Nenhum look salvo"
        description="Seus looks salvos aparecerão aqui."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {looks.map((look) => (
        <LookCard
          key={look.id}
          look={look}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
