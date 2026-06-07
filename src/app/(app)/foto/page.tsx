"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBasePhoto } from "@/hooks/useBasePhoto";
import { PhotoUpload } from "@/components/photo/PhotoUpload";
import { PhotoPreview } from "@/components/photo/PhotoPreview";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { checkAndConsumeCredit } from "@/lib/actions";

const STEPS = ["Peças", "Composição", "Sua Foto", "Resultado"];

export default function FotoPage() {
  const router = useRouter();
  const { photo, uploading, error, handleUpload, reset } = useBasePhoto();
  const [pageError, setPageError] = useState<string | null>(null);
  const [checkingCredits, setCheckingCredits] = useState(false);
  const [lookId, setLookId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem("luuk_look_id");
    if (!id) {
      router.replace("/pecas");
      return;
    }
    setLookId(id);
    setHydrated(true);
  }, [router]);

  if (!hydrated) return null;

  const handleProvar = async () => {
    if (!photo) {
      setPageError("Envie sua foto para continuar.");
      return;
    }

    setCheckingCredits(true);
    setPageError(null);

    const creditResult = await checkAndConsumeCredit();

    if (!creditResult.success) {
      setPageError(creditResult.error);
      setCheckingCredits(false);
      return;
    }

    sessionStorage.setItem("luuk_base_photo_id", photo.id);
    sessionStorage.setItem("luuk_credits_remaining", String(creditResult.creditsRemaining));
    router.push("/resultado");
  };

  return (
    <div className="animate-fade-in">
      <StepIndicator steps={STEPS} current={2} className="mb-8" />

      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sua foto
        </h1>
        <p className="text-sm text-muted mt-1">
          Envie uma foto sua de corpo inteiro para o provador virtual.
        </p>
      </div>

      {photo ? (
        <PhotoPreview src={photo.image_url} onChange={reset} />
      ) : (
        <PhotoUpload onUpload={handleUpload} uploading={uploading} error={error} />
      )}

      {pageError && (
        <ErrorBanner message={pageError} className="mt-4" />
      )}

      <div className="mt-8 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => router.push("/composicao")}
          className="flex-1"
        >
          <span className="material-icons-outlined text-base mr-1">arrow_back</span>
          Voltar
        </Button>
        <Button onClick={handleProvar} loading={checkingCredits} className="flex-[2]">
          <span className="material-icons-outlined text-lg mr-1">auto_awesome</span>
          Provar o Look
        </Button>
      </div>
    </div>
  );
}
