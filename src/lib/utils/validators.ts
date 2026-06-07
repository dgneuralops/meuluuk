import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/types";

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Formato não suportado. Use JPG, PNG ou WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Arquivo muito grande. Máximo: 10MB.",
    };
  }

  return { valid: true };
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    top: "Peça superior",
    bottom: "Peça inferior",
    dress: "Vestido",
    shoes: "Sapato",
    bag: "Bolsa",
    necklace: "Colar",
    earrings: "Brincos",
    belt: "Cinto",
    other: "Acessório",
  };
  return labels[category] || category;
}
