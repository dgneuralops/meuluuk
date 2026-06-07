"use client";

import { useRef, useCallback } from "react";
import { validateFile } from "@/lib/utils/validators";

interface PhotoUploadProps {
  onUpload: (file: File) => void;
  uploading?: boolean;
  error?: string | null;
}

export function PhotoUpload({
  onUpload,
  uploading = false,
  error,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      onUpload(file);
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      onUpload(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onUpload]
  );

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`
        relative w-full aspect-[3/4] max-w-sm mx-auto rounded-2xl border-2 border-dashed
        flex flex-col items-center justify-center gap-4 cursor-pointer
        transition-all duration-300
        ${uploading
          ? "border-primary/50 bg-primary-light/50"
          : "border-border hover:border-primary/50 hover:bg-peach"
        }
      `}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-muted">Enviando foto...</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center">
            <span className="material-icons-outlined text-3xl text-muted">
              photo_camera
            </span>
          </div>
          <div className="text-center px-6">
            <p className="text-sm font-semibold text-foreground mb-1">
              Arraste sua foto aqui
            </p>
            <p className="text-xs text-muted">
              ou toque para selecionar
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-muted px-8">
            <p className="flex items-center gap-2">
              <span className="material-icons-outlined text-sm text-primary">person</span>
              Foto de corpo inteiro, de frente
            </p>
            <p className="flex items-center gap-2">
              <span className="material-icons-outlined text-sm text-primary">wb_sunny</span>
              Fundo neutro e boa iluminação
            </p>
          </div>
        </>
      )}
      {error && (
        <p className="text-xs text-red-500 px-4 text-center">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
