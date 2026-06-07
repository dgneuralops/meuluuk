"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { startGeneration, pollGeneration, saveLook } from "@/lib/actions";
import { POLLING_INTERVAL_MS, MAX_POLLING_ATTEMPTS } from "@/lib/utils/constants";

interface UseGenerationReturn {
  status: "idle" | "generating" | "completed" | "failed";
  imageUrl: string | null;
  error: string | null;
  progress: number;
  handleGenerate: (lookId: string, basePhotoId: string) => Promise<void>;
  handleSave: (resultId: string, lookId: string) => Promise<void>;
  reset: () => void;
}

export function useGeneration(): UseGenerationReturn {
  const [status, setStatus] = useState<"idle" | "generating" | "completed" | "failed">("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleGenerate = useCallback(async (lookId: string, basePhotoId: string) => {
    setStatus("generating");
    setError(null);
    setImageUrl(null);
    setProgress(0);
    attemptsRef.current = 0;

    const result = await startGeneration(lookId, basePhotoId);

    if (!result.success) {
      setStatus("failed");
      setError(result.error);
      return;
    }

    if (!result.generationId || !result.providerJobId) {
      setStatus("failed");
      setError("Erro ao iniciar geração");
      return;
    }

    pollingRef.current = setInterval(async () => {
      attemptsRef.current += 1;
      setProgress(Math.min((attemptsRef.current / MAX_POLLING_ATTEMPTS) * 100, 95));

      const pollResult = await pollGeneration(result.generationId!, result.providerJobId!);

      if (pollResult.status === "completed") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setStatus("completed");
        setImageUrl(pollResult.imageUrl || null);
        setProgress(100);
      }

      if (pollResult.status === "failed") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setStatus("failed");
        setError(pollResult.errorMessage || "Falha na geração");
      }

      if (attemptsRef.current >= MAX_POLLING_ATTEMPTS) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setStatus("failed");
        setError("Tempo esgotado. Tente novamente.");
      }
    }, POLLING_INTERVAL_MS);
  }, []);

  const handleSave = useCallback(async (resultId: string, lookId: string) => {
    await saveLook(resultId, lookId);
  }, []);

  const reset = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setStatus("idle");
    setError(null);
    setImageUrl(null);
    setProgress(0);
    attemptsRef.current = 0;
  }, []);

  return { status, imageUrl, error, progress, handleGenerate, handleSave, reset };
}
