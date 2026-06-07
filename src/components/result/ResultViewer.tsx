"use client";

import { Button } from "@/components/ui/Button";

interface ResultViewerProps {
  imageUrl: string;
  onSave: () => void;
  onNewLook: () => void;
  onViewLooks: () => void;
  saving?: boolean;
}

export function ResultViewer({
  imageUrl,
  onSave,
  onNewLook,
  onViewLooks,
  saving = false,
}: ResultViewerProps) {
  return (
    <div className="animate-slide-up">
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-border">
        <img
          src={imageUrl}
          alt="Seu look gerado"
          className="w-full aspect-[3/4] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onSave}
          loading={saving}
          className="w-full"
        >
          <span className="material-icons-outlined text-lg mr-2">favorite_border</span>
          Salvar no Meus Looks
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onNewLook} className="w-full">
            <span className="material-icons-outlined text-base mr-1">autorenew</span>
            Novo look
          </Button>
          <Button variant="ghost" onClick={onViewLooks} className="w-full">
            <span className="material-icons-outlined text-base mr-1">favorite</span>
            Meus Looks
          </Button>
        </div>
      </div>
    </div>
  );
}
