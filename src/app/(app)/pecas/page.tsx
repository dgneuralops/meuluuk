"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePieces } from "@/hooks/usePieces";
import { PieceSlots } from "@/components/pieces/PieceSlots";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

const STEPS = ["Peças", "Composição", "Sua Foto", "Resultado"];

export default function PecasPage() {
  const router = useRouter();
  const { pieces, uploading, error, handleUpload, handleRemove } = usePieces();
  const [slotError, setSlotError] = useState<string | null>(null);

  console.log("[PecasPage] Pieces state:", pieces);

  const handleContinue = () => {
    if (pieces.length === 0) {
      setSlotError("Adicione pelo menos uma peça para continuar.");
      return;
    }
    setSlotError(null);

    const pieceIds = pieces.map((p) => p.id);
    const pieceData = pieces.map((p) => ({
      id: p.id,
      category: p.category,
      slot_key: p.slot_key,
      image_url: p.image_url,
    }));

    sessionStorage.setItem("luuk_pieces", JSON.stringify(pieceData));
    sessionStorage.setItem("luuk_piece_ids", JSON.stringify(pieceIds));
    router.push("/composicao");
  };

  return (
    <div className="animate-fade-in">
      <StepIndicator steps={STEPS} current={0} className="mb-8" />

      <div className="mb-8">
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Escolha suas peças
        </h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Toque nos slots para adicionar peças de roupa e acessórios.
        </p>
      </div>

      <PieceSlots
        pieces={pieces}
        uploading={uploading}
        onUpload={handleUpload}
        onRemove={handleRemove}
      />

      {slotError && (
        <ErrorBanner message={slotError} className="mt-6" />
      )}

      {error && (
        <ErrorBanner message={error} className="mt-6" />
      )}

      <div className="mt-10 space-y-4">
        <Button onClick={handleContinue} size="lg" className="w-full">
          Continuar
          <span className="material-icons-outlined text-lg ml-1">arrow_forward</span>
        </Button>
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-start gap-3">
            <span className="material-icons-outlined text-lg text-muted mt-0.5">
              lightbulb
            </span>
            <div>
              <p className="text-xs text-muted leading-relaxed">
                Use fotos com fundo neutro para melhores resultados. Não precisa subir
                todas as peças, apenas aquelas que você quer experimentar juntas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
