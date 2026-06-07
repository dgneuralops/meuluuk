"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ResultLoading } from "@/components/result/ResultLoading";
import { ResultError } from "@/components/result/ResultError";
import { StepIndicator } from "@/components/layout/StepIndicator";
import { FlatLayView } from "@/components/composition/FlatLayView";
import { startGeneration, pollGeneration, saveLook } from "@/lib/actions";
import type { Piece } from "@/types";

const STEPS = ["Peças", "Composição", "Sua Foto", "Resultado"];
const DEMO_IMAGE = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80";

export default function ResultadoPage() {
  const router = useRouter();
  const startedRef = useRef(false);
  const [status, setStatus] = useState<"generating" | "completed" | "failed">("generating");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);

  const lookIdRef = useRef<string | null>(null);

  useEffect(() => {
    const lookId = sessionStorage.getItem("luuk_look_id");
    const basePhotoId = sessionStorage.getItem("luuk_base_photo_id");

    // Load pieces for flat-lay display
    const piecesJson = sessionStorage.getItem("luuk_pieces");
    if (piecesJson) {
      try {
        setPieces(JSON.parse(piecesJson));
      } catch {
        // ignore parse errors
      }
    }

    if (!lookId || !basePhotoId) {
      router.replace("/pecas");
      return;
    }

    lookIdRef.current = lookId;

    if (startedRef.current) return;
    startedRef.current = true;

    async function run() {
      const startResult = await startGeneration(lookId!, basePhotoId!);

      if (!startResult.success) {
        setStatus("failed");
        setError(startResult.error);
        return;
      }

      if (!startResult.providerJobId) {
        let p = 0;
        const interval = setInterval(() => {
          p += 5;
          setProgress(p);
          if (p >= 95) {
            clearInterval(interval);
            setImageUrl(DEMO_IMAGE);
            setResultId(`demo-result-${Date.now()}`);
            setProgress(100);
            const img = new Image();
            img.onload = () => setStatus("completed");
            img.onerror = () => {
              setStatus("failed");
              setError("Não foi possível carregar a imagem.");
            };
            img.src = DEMO_IMAGE;
          }
        }, 150);
        return;
      }

      for (let i = 0; i < 200; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        setProgress(Math.min(((i + 1) / 200) * 95, 95));

        const pollResult = await pollGeneration(startResult.generationId!, startResult.providerJobId!);

        if (pollResult.status === "completed") {
          setImageUrl(pollResult.imageUrl || null);
          setResultId(pollResult.resultId || null);
          setProgress(100);

          if (pollResult.imageUrl) {
            const img = new Image();
            img.onload = () => setStatus("completed");
            img.onerror = () => {
              setStatus("failed");
              setError("Não foi possível carregar a imagem.");
            };
            img.src = pollResult.imageUrl;
          } else {
            setStatus("failed");
            setError("Sem imagem de resultado.");
          }
          return;
        }

        if (pollResult.status === "failed") {
          setStatus("failed");
          setError(pollResult.errorMessage || "Falha na geração");
          return;
        }
      }

      setStatus("failed");
      setError("Tempo esgotado. Tente novamente.");
    }

    run();
  }, [router]);

  const handleSaveClick = async () => {
    const currentLookId = lookIdRef.current;
    if (!resultId || !currentLookId) return;
    setSaving(true);
    const result = await saveLook(resultId, currentLookId);
    setSaving(false);
    if (result.success) router.push("/meus-looks");
  };

  const handleNewLook = () => {
    startedRef.current = false;
    setStatus("generating");
    setError(null);
    setImageUrl(null);
    setProgress(0);
    setResultId(null);
    sessionStorage.removeItem("luuk_pieces");
    sessionStorage.removeItem("luuk_piece_ids");
    sessionStorage.removeItem("luuk_look_id");
    sessionStorage.removeItem("luuk_base_photo_id");
    router.push("/pecas");
  };

  const handleRetry = () => {
    startedRef.current = false;
    setStatus("generating");
    setError(null);
    setImageUrl(null);
    setProgress(0);
    setResultId(null);
    window.location.reload();
  };

  return (
    <div className="animate-fade-in">
      <StepIndicator steps={STEPS} current={3} className="mb-8" />

      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Seu Look
        </h1>
      </div>

      {status === "generating" && (
        <div className="space-y-6">
          {/* Show the flat-lay while generating so the user sees what's being processed */}
          {pieces.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-muted)" }}>
                Composição
              </p>
              <FlatLayView pieces={pieces} />
            </div>
          )}
          <ResultLoading progress={progress} />
        </div>
      )}

      {status === "completed" && imageUrl && (
        <div className="animate-slide-up space-y-8">

          {/* Section 1: Outfit flat-lay */}
          {pieces.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-1 h-5 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <p className="text-sm font-semibold tracking-wide" style={{ color: "var(--color-foreground)" }}>
                  Composição do look
                </p>
              </div>
              <FlatLayView pieces={pieces} />
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
              }}
            >
              você com o look
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
          </div>

          {/* Section 2: Try-on result on the person */}
          <div>
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <img
                src={imageUrl}
                alt="Você com o look"
                className="w-full object-cover"
                style={{ aspectRatio: "3/4" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 40%)",
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSaveClick}
              loading={saving}
              className="w-full"
            >
              <span className="material-icons-outlined text-lg mr-2">favorite_border</span>
              Salvar no Meus Looks
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={handleNewLook} className="w-full">
                <span className="material-icons-outlined text-base mr-1">autorenew</span>
                Novo look
              </Button>
              <Button variant="ghost" onClick={() => router.push("/meus-looks")} className="w-full">
                <span className="material-icons-outlined text-base mr-1">favorite</span>
                Meus Looks
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "failed" && (
        <ResultError
          message={error || "Não foi possível gerar o look."}
          onRetry={handleRetry}
          onBack={() => router.push("/foto")}
        />
      )}
    </div>
  );
}
