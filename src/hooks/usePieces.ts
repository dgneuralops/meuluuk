"use client";

import { useState, useCallback } from "react";
import { uploadPiece } from "@/lib/actions";
import type { Piece, PieceCategory } from "@/types";

interface UsePiecesReturn {
  pieces: Piece[];
  uploading: boolean;
  error: string | null;
  handleUpload: (file: File, category: PieceCategory, slotKey: string) => Promise<void>;
  handleRemove: (pieceId: string) => void;
  reset: () => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function usePieces(): UsePiecesReturn {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File, category: PieceCategory, slotKey: string) => {
    console.log("[usePieces] Starting upload:", file.name, category, slotKey);
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("slotKey", slotKey);

    // Convert to base64 on client side for demo mode persistence
    try {
      const base64 = await fileToBase64(file);
      formData.append("base64", base64);
    } catch {
      // If base64 conversion fails, server will use object URL
    }

    console.log("[usePieces] Calling uploadPiece action...");
    const result = await uploadPiece(formData);
    console.log("[usePieces] Result:", result);

    if (!result.success) {
      console.log("[usePieces] Upload failed:", result.error);
      setError(result.error);
    } else if (result.piece) {
      console.log("[usePieces] Upload success, updating state with piece:", result.piece);
      setPieces((prev) => {
        const filtered = prev.filter((p) => p.slot_key !== slotKey);
        const next = [...filtered, result.piece];
        console.log("[usePieces] New pieces state:", next);
        return next;
      });
    }

    setUploading(false);
  }, []);

  const handleRemove = useCallback((pieceId: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== pieceId));
  }, []);

  const reset = useCallback(() => {
    setPieces([]);
    setError(null);
    setUploading(false);
  }, []);

  return { pieces, uploading, error, handleUpload, handleRemove, reset };
}
