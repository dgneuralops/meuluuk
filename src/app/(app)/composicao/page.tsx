"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompositionPanel } from "@/components/composition/CompositionPanel";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { createLook } from "@/lib/actions";
import type { Piece } from "@/types";

const STEPS = ["Peças", "Composição", "Sua Foto", "Resultado"];

export default function ComposicaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const piecesJson = sessionStorage.getItem("luuk_pieces");
    const loaded: Piece[] = piecesJson ? JSON.parse(piecesJson) : [];
    if (loaded.length === 0) {
      router.replace("/pecas");
      return;
    }
    setPieces(loaded);
    setHydrated(true);
  }, [router]);

  if (!hydrated) return null;

  const handleSwap = (pieceId: string) => {
    router.push("/pecas");
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    const pieceIdsJson = sessionStorage.getItem("luuk_piece_ids");
    const pieceIds: string[] = pieceIdsJson ? JSON.parse(pieceIdsJson) : [];

    const result = await createLook(pieceIds);

    if (!result.success) {
      setError(result.error);
    } else {
      sessionStorage.setItem("luuk_look_id", result.look.id);
      router.push("/foto");
    }

    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <StepIndicator steps={STEPS} current={1} className="mb-8" />

      <div className="mb-8">
        <h1
          className="text-3xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Suas peças juntas
        </h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Confira a combinação antes de provar.
        </p>
      </div>

      <CompositionPanel pieces={pieces} onSwap={handleSwap} />

      {error && (
        <ErrorBanner message={error} className="mt-6" />
      )}

      <div className="mt-10 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => router.push("/pecas")}
          className="flex-1"
        >
          <span className="material-icons-outlined text-base mr-1">arrow_back</span>
          Voltar
        </Button>
        <Button onClick={handleContinue} loading={loading} className="flex-[2]">
          Continuar
          <span className="material-icons-outlined text-lg ml-1">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
}
