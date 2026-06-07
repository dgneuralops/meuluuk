"use client";

import { ImagePreview } from "@/components/ui/ImagePreview";

interface PhotoPreviewProps {
  src: string;
  onChange: () => void;
}

export function PhotoPreview({ src, onChange }: PhotoPreviewProps) {
  return (
    <div className="animate-fade-in max-w-sm mx-auto">
      <div className="relative rounded-2xl overflow-hidden">
        <ImagePreview src={src} alt="Sua foto" aspectRatio="aspect-[3/4]" />
        <button
          type="button"
          onClick={onChange}
          className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 text-white rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-black/80 transition-colors"
        >
          <span className="material-icons-outlined text-sm">swap_horiz</span>
          Trocar foto
        </button>
      </div>
    </div>
  );
}
