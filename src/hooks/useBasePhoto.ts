"use client";

import { useState, useCallback } from "react";
import { uploadBasePhoto } from "@/lib/actions";
import type { BasePhoto } from "@/types";

interface UseBasePhotoReturn {
  photo: BasePhoto | null;
  uploading: boolean;
  error: string | null;
  handleUpload: (file: File) => Promise<void>;
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

export function useBasePhoto(): UseBasePhotoReturn {
  const [photo, setPhoto] = useState<BasePhoto | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    // Convert to base64 on client side for demo mode persistence
    try {
      const base64 = await fileToBase64(file);
      formData.append("base64", base64);
    } catch {
      // If base64 conversion fails, server will use object URL
    }

    const result = await uploadBasePhoto(formData);

    if (!result.success) {
      setError(result.error);
    } else {
      setPhoto(result.photo);
    }

    setUploading(false);
  }, []);

  const reset = useCallback(() => {
    setPhoto(null);
    setError(null);
    setUploading(false);
  }, []);

  return { photo, uploading, error, handleUpload, reset };
}
