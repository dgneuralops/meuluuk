import type { VirtualTryOnProvider, TryOnInput, TryOnOutput, TryOnPiece } from "./types";

const REPLICATE_API_URL = "https://api.replicate.com/v1";
const IDM_VTON_VERSION = "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985";

function getHeaders(): Record<string, string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function mapCategoryToIdmVton(category: string): "upper_body" | "lower_body" | "dresses" {
  if (category === "bottom") return "lower_body";
  if (category === "dress") return "dresses";
  return "upper_body";
}

// IDM-VTON supports one garment at a time.
// Priority: dress > top > bottom > shoes — accessories are excluded from try-on.
function selectMainGarment(pieces: TryOnPiece[]): { piece: TryOnPiece; vtonCategory: "upper_body" | "lower_body" | "dresses" } | null {
  const priority = ["dress", "top", "bottom", "shoes"];
  for (const cat of priority) {
    const found = pieces.find((p) => p.category === cat);
    if (found) {
      return { piece: found, vtonCategory: mapCategoryToIdmVton(found.category) };
    }
  }
  // If only accessories, fall back to the first piece
  if (pieces.length > 0) {
    return { piece: pieces[0], vtonCategory: "upper_body" };
  }
  return null;
}

export const replicateProvider: VirtualTryOnProvider = {
  name: "replicate",

  async generate(input: TryOnInput): Promise<TryOnOutput> {
    try {
      const selected = selectMainGarment(input.pieces);
      if (!selected) {
        return { status: "failed", errorMessage: "Nenhuma peça selecionada" };
      }

      const { piece, vtonCategory } = selected;

      // Build a description including all pieces in the look
      const allCategories = input.pieces.map((p) => p.category).join(", ");
      const garmentDescription = input.prompt || `Outfit: ${allCategories}`;

      console.log("[Replicate] Generating with:", {
        human_img: input.basePhotoUrl,
        garm_img: piece.imageUrl,
        category: vtonCategory,
        garment_des: garmentDescription,
        version: IDM_VTON_VERSION,
      });

      const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          version: IDM_VTON_VERSION,
          input: {
            human_img: input.basePhotoUrl,
            garm_img: piece.imageUrl,
            garment_des: garmentDescription,
            category: vtonCategory,
          },
        }),
      });

      const responseText = await response.text();
      console.log("[Replicate] Response status:", response.status);
      console.log("[Replicate] Response body:", responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { detail: responseText };
        }
        return {
          status: "failed",
          errorMessage: errorData.detail || "Erro ao iniciar geração",
        };
      }

      const data = JSON.parse(responseText);
      return {
        status: "processing",
        providerJobId: data.id,
      };
    } catch (err: any) {
      console.error("[Replicate] Error:", err);
      return {
        status: "failed",
        errorMessage: err.message || "Erro de conexão com Replicate",
      };
    }
  },

  async getStatus(jobId: string): Promise<TryOnOutput> {
    try {
      const response = await fetch(`${REPLICATE_API_URL}/predictions/${jobId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        return { status: "failed", errorMessage: "Erro ao verificar status" };
      }

      const data = await response.json();

      if (data.status === "succeeded") {
        return {
          status: "completed",
          imageUrl: Array.isArray(data.output) ? data.output[0] : data.output,
          providerJobId: jobId,
        };
      }

      if (data.status === "failed" || data.status === "canceled") {
        return {
          status: "failed",
          errorMessage: data.error || "Falha na geração",
          providerJobId: jobId,
        };
      }

      return { status: "processing", providerJobId: jobId };
    } catch (err: any) {
      return {
        status: "failed",
        errorMessage: err.message || "Erro de conexão com Replicate",
      };
    }
  },

  buildPrompt(input: TryOnInput): string {
    const selected = selectMainGarment(input.pieces);
    const mainCategory = selected?.piece.category || "garment";
    const allCategories = input.pieces.map((p) => p.category).join(", ");
    return `Virtual try-on: person wearing ${allCategories}. Main garment: ${mainCategory}. Photorealistic, preserve identity.`;
  },
};
