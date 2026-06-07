"use client";

import { useRef, useCallback } from "react";
import { validateFile } from "@/lib/utils/validators";

interface UploadSlotProps {
  label: string;
  icon?: string;
  image?: string;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  uploading?: boolean;
  error?: string | null;
}

export function UploadSlot({
  label,
  icon = "add_photo_alternate",
  image,
  onUpload,
  onRemove,
  uploading = false,
  error,
}: UploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  console.log("[UploadSlot] Render:", label, "image:", image ? "HAS IMAGE" : "NO IMAGE", "uploading:", uploading);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      console.log("[UploadSlot] File selected:", file?.name, file?.type, file?.size);
      if (!file) return;

      const validation = validateFile(file);
      console.log("[UploadSlot] Validation:", validation);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      console.log("[UploadSlot] Calling onUpload...");
      onUpload(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onUpload]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className={`
          relative w-full aspect-[3/4] rounded-xl overflow-hidden cursor-pointer
          transition-all duration-300 border-2 border-dashed
          ${image
            ? "border-transparent shadow-md hover:shadow-lg hover:scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-primary-light/50"
          }
          ${uploading ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        {image ? (
          <>
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                ×
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted">
            {uploading ? (
              <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <span className="material-icons-outlined text-3xl opacity-60">{icon}</span>
                <span className="text-[11px] text-center px-2 font-medium">{label}</span>
              </>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
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
